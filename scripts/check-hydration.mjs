// Abre URLs en Chrome headless (CDP, sin dependencias) y falla si la consola
// muestra problemas de hidratación. Lo usa scripts/check-bots.sh.
//
//   node scripts/check-hydration.mjs http://localhost:8080/es http://localhost:8080/en
//
// Requiere Node >= 22 (WebSocket global) y Chrome/Chromium (CHROME_BIN o rutas habituales).
// Códigos de salida: 0 OK · 1 hidratación con problemas o error · 2 sin Chrome/WebSocket.
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const urls = process.argv.slice(2);
const WAIT_MS = Number(process.env.HYDRATION_WAIT || 3000);
// entry-client reporta onRecoverableError como console.warn('[hydrate]', …);
// en producción React además usa los errores minificados 418/423/425.
const HYDRATION_RE = /\[hydrate\]|hydrat|Minified React error #(418|419|421|422|423|425)\b/i;

const findChrome = () => {
  if (process.env.CHROME_BIN) return existsSync(process.env.CHROME_BIN) ? process.env.CHROME_BIN : null;
  const mac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (existsSync(mac)) return mac;
  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    try {
      return execFileSync('which', [name], { encoding: 'utf8' }).trim() || null;
    } catch {
      // sigue con el siguiente
    }
  }
  return null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chromePath = findChrome();
if (!chromePath || typeof WebSocket === 'undefined') {
  console.error(!chromePath ? '[hydration] no se encontró Chrome' : '[hydration] Node sin WebSocket global (usa Node >= 22)');
  process.exit(2);
}
if (urls.length === 0) {
  console.error('Uso: node scripts/check-hydration.mjs <url> [url…]');
  process.exit(1);
}

const profile = mkdtempSync(join(tmpdir(), 'check-hydration-'));
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    ...(process.env.CI ? ['--no-sandbox'] : []),
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let exitCode = 1;
try {
  // Chrome escribe el puerto elegido en DevToolsActivePort.
  let port;
  for (let i = 0; i < 100 && !port; i++) {
    try {
      port = readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0];
    } catch {
      await sleep(100);
    }
  }
  if (!port) throw new Error('Chrome no abrió el puerto de depuración');

  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((target) => target.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let nextId = 0;
  const pending = new Map();
  const listeners = new Set();
  let messages = [];
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
      return;
    }
    for (const listener of listeners) listener(msg);
    if (msg.method === 'Runtime.consoleAPICalled' && ['warning', 'error'].includes(msg.params.type)) {
      const text = msg.params.args.map((arg) => arg.value ?? arg.description ?? '').join(' ');
      messages.push(`[console.${msg.params.type}] ${text}`);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      const details = msg.params.exceptionDetails;
      messages.push(`[exception] ${details.exception?.description || details.text}`);
    } else if (msg.method === 'Log.entryAdded' && ['warning', 'error'].includes(msg.params.entry.level)) {
      messages.push(`[log.${msg.params.entry.level}] ${msg.params.entry.text} ${msg.params.entry.url || ''}`);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = ++nextId;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  const waitFor = (method, timeoutMs) =>
    new Promise((resolve) => {
      const timer = setTimeout(() => {
        listeners.delete(listener);
        resolve(false);
      }, timeoutMs);
      const listener = (msg) => {
        if (msg.method !== method) return;
        clearTimeout(timer);
        listeners.delete(listener);
        resolve(true);
      };
      listeners.add(listener);
    });

  await send('Runtime.enable');
  await send('Log.enable');
  await send('Page.enable');

  let problems = 0;
  for (const url of urls) {
    messages = [];
    const loaded = waitFor('Page.loadEventFired', 30000);
    await send('Page.navigate', { url });
    if (!(await loaded)) messages.push('[check] no terminó de cargar en 30 s');
    await sleep(WAIT_MS);

    const { result } = await send('Runtime.evaluate', {
      expression: 'JSON.stringify({h1: document.querySelectorAll("h1").length, root: document.getElementById("root")?.children.length ?? 0, lang: document.documentElement.lang})',
      returnByValue: true,
    });
    const state = JSON.parse(result.value);
    const hydration = messages.filter((text) => HYDRATION_RE.test(text));
    const broken = state.h1 !== 1 || state.root === 0;
    const verdict = hydration.length === 0 && !broken ? 'OK   ' : 'FALLA';
    console.log(`${verdict} ${url} h1=${state.h1} root=${state.root} lang=${state.lang}`);
    for (const text of messages) console.log(`        ${HYDRATION_RE.test(text) ? '!!' : '  '} ${text.slice(0, 300)}`);
    if (verdict !== 'OK   ') problems++;
  }

  ws.close();
  exitCode = problems === 0 ? 0 : 1;
} catch (error) {
  console.error('[hydration]', error);
  exitCode = 1;
} finally {
  chrome.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
process.exit(exitCode);
