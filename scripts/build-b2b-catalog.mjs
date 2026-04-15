import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const DEFAULT_INPUT_PATH = path.join(ROOT_DIR, 'catalogo_tematico_cursos.xlsx');
const DEFAULT_OUTPUT_PATH = path.join(ROOT_DIR, 'src/data/b2bCatalog.json');

const slugify = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const normalizeKey = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');

const toNumberOrNull = (value) => {
  if (value == null || value === '') {
    return null;
  }
  const num = Number(String(value).replace(',', '.'));
  return Number.isFinite(num) && num > 0 ? num : null;
};

const firstValue = (row, keys, fallback = '') => {
  for (const key of keys) {
    if (row[key] != null && String(row[key]).trim() !== '') {
      return String(row[key]).trim();
    }
  }
  return fallback;
};

const buildCanonicalRows = (rows) => {
  const byHandle = new Map();

  rows.forEach((rawRow, idx) => {
    const row = Object.fromEntries(
      Object.entries(rawRow).map(([key, value]) => [normalizeKey(key), value])
    );

    const tema = firstValue(row, ['tema', 'nombrecurso', 'curso', 'nombre', 'titulo']);
    if (!tema) {
      return;
    }

    const categoria = firstValue(row, ['categoria', 'familia', 'area'], 'Sin categoria');
    const modalidad = firstValue(row, ['modalidad', 'tipomodalidad'], 'Por definir');
    const estandar = firstValue(row, ['estandar', 'norma', 'estandares'], 'General');
    const horas = toNumberOrNull(firstValue(row, ['horas', 'duracion', 'horascronologicas'], ''));
    const handle = slugify(firstValue(row, ['handle'], '') || `${tema}-${categoria}-${idx}`);

    const existing = byHandle.get(handle);
    const combination = { modalidad, horas, estandar };

    if (!existing) {
      byHandle.set(handle, {
        tema,
        handle,
        categoria,
        cursos_fuente: 1,
        modalidades: [],
        estandares: [],
        combinaciones: [combination],
      });
      return;
    }

    existing.cursos_fuente += 1;
    existing.combinaciones.push(combination);
  });

  return Array.from(byHandle.values()).map((topic) => {
    const comboMap = new Map();

    topic.combinaciones.forEach((combination) => {
      const key = `${combination.modalidad}|${combination.horas ?? 'cotizar'}|${combination.estandar}`;
      if (!comboMap.has(key)) {
        comboMap.set(key, combination);
      }
    });

    const combinaciones = Array.from(comboMap.values());

    return {
      ...topic,
      combinaciones,
      modalidades: Array.from(new Set(combinaciones.map((item) => item.modalidad))).sort(),
      estandares: Array.from(new Set(combinaciones.map((item) => item.estandar))).sort(),
    };
  });
};

const run = async () => {
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_INPUT_PATH;
  const outputPath = process.argv[3] ? path.resolve(process.argv[3]) : DEFAULT_OUTPUT_PATH;

  if (!fs.existsSync(inputPath)) {
    console.error(`No se encontro archivo Excel en: ${inputPath}`);
    console.error('Uso: npm run catalog:b2b:build -- ./ruta/catalogo.xlsx [./ruta/salida.json]');
    process.exit(1);
  }

  let XLSX;
  try {
    ({ default: XLSX } = await import('xlsx'));
  } catch (error) {
    console.error('Falta dependencia xlsx. Instala con: npm i -D xlsx');
    process.exit(1);
  }

  const workbook = XLSX.readFile(inputPath);
  const firstSheet = workbook.SheetNames[0];

  if (!firstSheet) {
    console.error('El Excel no contiene hojas.');
    process.exit(1);
  }

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], {
    defval: '',
    raw: false,
  });

  const normalized = buildCanonicalRows(rows);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf-8');

  console.log(`Catalogo B2B generado: ${outputPath}`);
  console.log(`Cursos agregados: ${normalized.length}`);
};

run();
