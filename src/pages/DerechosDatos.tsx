import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Loader2, Mail, Send, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { formatRut } from '@/lib/insecapUtils';
import { cn } from '@/lib/utils';
import {
  CORREO_PRIVACIDAD, DERECHOS, ENDPOINT_DERECHOS_DATOS, LIMITES, ORDEN_CAMPOS, camposFormulario,
  validarAdjunto, validarSolicitud,
  type CampoSolicitud, type Derecho, type ErrorCodigo, type ErroresSolicitud, type SolicitudDerechos,
} from '@/lib/derechosDatos';

// Mismo host que la postulación de relatores (BeRelator): en producción la API del TMS Plus; en dev,
// el proxy de Vite (vite.config.ts). El endpoint se construye en la Ola 2 (docs/ley21719-contrato-derechos-datos.md).
const API_BASE = (import.meta.env.VITE_TMS_PLUS_API_URL ?? '').replace(/\/+$/, '');
const apiUrl = (endpoint: string) => (import.meta.env.PROD ? `${API_BASE}${endpoint}` : endpoint);

const VACIA: SolicitudDerechos = {
  derechos: [],
  nombreCompleto: '',
  run: '',
  correo: '',
  telefono: '',
  esRepresentante: false,
  nombreRepresentante: '',
  descripcion: '',
  adjunto: null,
  aceptaPolitica: false,
};

type ErrorEnvio = 'validacion' | 'rateLimit' | 'generico' | 'muyRapido';

const content = {
  es: {
    title: 'Ejerce tus derechos sobre tus datos personales',
    subtitle: 'Ley N° 21.719',
    breadcrumbPolicy: 'Política de privacidad',
    breadcrumb: 'Ejercer mis derechos',
    intro: 'Si INSECAP trata tus datos personales (como participante, relator, contacto de una empresa cliente o postulante), puedes pedirnos que los revisemos, corrijamos, eliminemos o dejemos de usarlos. El trámite es gratuito.',
    rightsHeading: 'Tus derechos',
    rights: {
      acceso: ['Acceso', 'Saber si tratamos tus datos, cuáles, de dónde vienen, para qué los usamos y a quién se comunican.'],
      rectificacion: ['Rectificación', 'Corregir datos inexactos, desactualizados o incompletos.'],
      supresion: ['Supresión', 'Pedir que eliminemos tus datos. Si la ley nos obliga a conservarlos, los bloqueamos y te explicamos el motivo.'],
      oposicion: ['Oposición', 'Oponerte a tratamientos basados en interés legítimo y a las comunicaciones comerciales.'],
      portabilidad: ['Portabilidad', 'Recibir tus datos en un formato estructurado y de uso común, o que los enviemos a otro responsable.'],
      bloqueo: ['Bloqueo', 'Suspender temporalmente el tratamiento mientras resolvemos una rectificación, supresión u oposición.'],
    } as Record<Derecho, [string, string]>,
    termsHeading: 'Plazos',
    terms: 'Acusamos recibo y respondemos dentro de 30 días corridos. Si necesitamos más tiempo, el plazo se puede prorrogar una sola vez por otros 30 días y te avisaremos el motivo. Las solicitudes de bloqueo se atienden en 2 días hábiles.',
    identity: 'Para proteger tus datos verificamos tu identidad antes de responder: te pediremos una copia de tu cédula y, si actúas como representante, el poder que te faculta.',
    altHeading: 'Otro canal',
    altText: 'También puedes escribir a',
    formHeading: 'Formulario de solicitud',
    formIntro: 'Los campos marcados con * son obligatorios.',
    legendRights: '¿Qué derechos quieres ejercer? *',
    legendRightsHint: 'Puedes marcar uno o más.',
    sectionTitular: 'Datos del titular',
    labelNombre: 'Nombre completo *',
    labelRun: 'RUN *',
    placeholderRun: '11.111.111-1',
    labelCorreo: 'Correo electrónico *',
    hintCorreo: 'Aquí te enviaremos el acuse de recibo y la respuesta.',
    placeholderCorreo: 'nombre@ejemplo.cl',
    labelTelefono: 'Teléfono (opcional)',
    placeholderTelefono: '+56 9 0000 0000',
    labelRepresentante: 'Actúo como representante del titular',
    labelNombreRepresentante: 'Nombre completo del representante *',
    labelDescripcion: 'Describe tu solicitud *',
    hintDescripcion: `Cuéntanos qué necesitas (por ejemplo, qué dato corregir). Entre ${LIMITES.descripcionMin} y ${LIMITES.descripcion} caracteres.`,
    labelAdjunto: 'Documento de respaldo (opcional)',
    hintAdjunto: 'Copia de tu cédula y, si eres representante, el poder (puedes unirlos en un PDF). PDF, JPG o PNG, máximo 5 MB.',
    removeFile: 'Quitar archivo',
    acceptBefore: 'He leído la ',
    acceptLink: 'política de privacidad',
    acceptAfter: ' y autorizo a INSECAP a tratar los datos de este formulario para atender mi solicitud. *',
    honeypot: 'Sitio web (deja este campo vacío)',
    submit: 'Enviar solicitud',
    sending: 'Enviando…',
    errors: {
      derechos: { requerido: 'Marca al menos un derecho.', invalido: 'Selección no válida.' },
      nombreCompleto: { requerido: 'Ingresa tu nombre completo.', largo: 'El nombre es demasiado largo.', invalido: 'Revisa el nombre.' },
      run: { requerido: 'Ingresa tu RUN.', invalido: 'El RUN no es válido: revisa los números y el dígito verificador.' },
      correo: { requerido: 'Ingresa tu correo.', invalido: 'Ingresa un correo válido.' },
      telefono: { invalido: 'Ingresa un teléfono válido (solo números, espacios y +).' },
      nombreRepresentante: { requerido: 'Ingresa el nombre del representante.', largo: 'El nombre es demasiado largo.', invalido: 'Revisa el nombre.' },
      descripcion: { requerido: 'Describe tu solicitud.', corto: `Escribe al menos ${LIMITES.descripcionMin} caracteres.`, largo: `Máximo ${LIMITES.descripcion} caracteres.`, invalido: 'Revisa la descripción.' },
      adjunto: { tipoArchivo: 'El archivo debe ser PDF, JPG o PNG.', pesoArchivo: 'El archivo debe pesar menos de 5 MB.', invalido: 'Revisa el archivo.' },
      aceptaPolitica: { requerido: 'Debes aceptar la política de privacidad para enviar la solicitud.' },
    } as Partial<Record<CampoSolicitud, Partial<Record<ErrorCodigo, string>>>>,
    summaryErrors: 'Revisa los campos marcados.',
    sendErrors: {
      validacion: 'No pudimos procesar la solicitud porque algunos datos no son válidos. Revísalos e inténtalo de nuevo.',
      rateLimit: 'Recibimos demasiadas solicitudes desde tu conexión. Espera unos minutos e inténtalo de nuevo.',
      generico: 'No pudimos enviar tu solicitud en este momento. Inténtalo más tarde.',
      muyRapido: 'Revisa tus datos y vuelve a presionar «Enviar solicitud».',
    } as Record<ErrorEnvio, string>,
    sendErrorAlt: 'Si el problema continúa, escríbenos a',
    successHeading: 'Recibimos tu solicitud',
    successNumber: 'Tu número de seguimiento es',
    successText: 'Te enviaremos un acuse de recibo a tu correo. Guarda el número de seguimiento para cualquier consulta sobre tu solicitud.',
    sendAnother: 'Enviar otra solicitud',
  },
  en: {
    title: 'Exercise your rights over your personal data',
    subtitle: 'Chilean Law No. 21,719',
    breadcrumbPolicy: 'Privacy policy',
    breadcrumb: 'Exercise my rights',
    intro: 'If INSECAP processes your personal data (as a participant, instructor, client company contact or applicant), you can ask us to review, correct, delete or stop using it. The request is free of charge.',
    rightsHeading: 'Your rights',
    rights: {
      acceso: ['Access', 'Know whether we process your data, which data, where it comes from, why we use it and who receives it.'],
      rectificacion: ['Rectification', 'Correct inaccurate, outdated or incomplete data.'],
      supresion: ['Erasure', 'Ask us to delete your data. If the law requires us to keep it, we block it and explain why.'],
      oposicion: ['Objection', 'Object to processing based on legitimate interest and to marketing communications.'],
      portabilidad: ['Portability', 'Receive your data in a structured, commonly used format, or have us send it to another controller.'],
      bloqueo: ['Blocking', 'Temporarily suspend processing while we resolve a rectification, erasure or objection request.'],
    } as Record<Derecho, [string, string]>,
    termsHeading: 'Response times',
    terms: 'We acknowledge receipt and respond within 30 calendar days. If we need more time, the deadline can be extended once for another 30 days and we will tell you why. Blocking requests are handled within 2 business days.',
    identity: 'To protect your data we verify your identity before responding: we will ask for a copy of your ID card and, if you act as a representative, the power of attorney that authorizes you.',
    altHeading: 'Other channel',
    altText: 'You can also write to',
    formHeading: 'Request form',
    formIntro: 'Fields marked with * are required.',
    legendRights: 'Which rights do you want to exercise? *',
    legendRightsHint: 'You can select one or more.',
    sectionTitular: 'Data subject details',
    labelNombre: 'Full name *',
    labelRun: 'RUN (Chilean ID number) *',
    placeholderRun: '11.111.111-1',
    labelCorreo: 'Email *',
    hintCorreo: 'We will send the acknowledgment of receipt and our response here.',
    placeholderCorreo: 'name@example.com',
    labelTelefono: 'Phone (optional)',
    placeholderTelefono: '+56 9 0000 0000',
    labelRepresentante: 'I am acting on behalf of the data subject',
    labelNombreRepresentante: 'Representative full name *',
    labelDescripcion: 'Describe your request *',
    hintDescripcion: `Tell us what you need (for example, which data to correct). Between ${LIMITES.descripcionMin} and ${LIMITES.descripcion} characters.`,
    labelAdjunto: 'Supporting document (optional)',
    hintAdjunto: 'A copy of your ID card and, if you are a representative, the power of attorney (you can merge them into one PDF). PDF, JPG or PNG, up to 5 MB.',
    removeFile: 'Remove file',
    acceptBefore: 'I have read the ',
    acceptLink: 'privacy policy',
    acceptAfter: ' and authorize INSECAP to process the data in this form to handle my request. *',
    honeypot: 'Website (leave this field empty)',
    submit: 'Send request',
    sending: 'Sending…',
    errors: {
      derechos: { requerido: 'Select at least one right.', invalido: 'Invalid selection.' },
      nombreCompleto: { requerido: 'Enter your full name.', largo: 'The name is too long.', invalido: 'Check the name.' },
      run: { requerido: 'Enter your RUN.', invalido: 'The RUN is not valid: check the numbers and the check digit.' },
      correo: { requerido: 'Enter your email.', invalido: 'Enter a valid email.' },
      telefono: { invalido: 'Enter a valid phone number (digits, spaces and + only).' },
      nombreRepresentante: { requerido: 'Enter the representative name.', largo: 'The name is too long.', invalido: 'Check the name.' },
      descripcion: { requerido: 'Describe your request.', corto: `Write at least ${LIMITES.descripcionMin} characters.`, largo: `Up to ${LIMITES.descripcion} characters.`, invalido: 'Check the description.' },
      adjunto: { tipoArchivo: 'The file must be PDF, JPG or PNG.', pesoArchivo: 'The file must be smaller than 5 MB.', invalido: 'Check the file.' },
      aceptaPolitica: { requerido: 'You must accept the privacy policy to send the request.' },
    } as Partial<Record<CampoSolicitud, Partial<Record<ErrorCodigo, string>>>>,
    summaryErrors: 'Check the highlighted fields.',
    sendErrors: {
      validacion: 'We could not process the request because some data is not valid. Please check it and try again.',
      rateLimit: 'We received too many requests from your connection. Please wait a few minutes and try again.',
      generico: 'We could not send your request right now. Please try again later.',
      muyRapido: 'Please review your details and press "Send request" again.',
    } as Record<ErrorEnvio, string>,
    sendErrorAlt: 'If the problem persists, write to us at',
    successHeading: 'We received your request',
    successNumber: 'Your tracking number is',
    successText: 'We will send an acknowledgment of receipt to your email. Keep the tracking number for any questions about your request.',
    sendAnother: 'Send another request',
  },
  pt: {
    title: 'Exerça seus direitos sobre seus dados pessoais',
    subtitle: 'Lei chilena N° 21.719',
    breadcrumbPolicy: 'Política de privacidade',
    breadcrumb: 'Exercer meus direitos',
    intro: 'Se a INSECAP trata seus dados pessoais (como participante, instrutor, contato de uma empresa cliente ou candidato), você pode pedir que os revisemos, corrijamos, eliminemos ou deixemos de usá-los. A solicitação é gratuita.',
    rightsHeading: 'Seus direitos',
    rights: {
      acceso: ['Acesso', 'Saber se tratamos seus dados, quais, de onde vêm, para que os usamos e a quem são comunicados.'],
      rectificacion: ['Retificação', 'Corrigir dados inexatos, desatualizados ou incompletos.'],
      supresion: ['Eliminação', 'Pedir que eliminemos seus dados. Se a lei nos obrigar a conservá-los, nós os bloqueamos e explicamos o motivo.'],
      oposicion: ['Oposição', 'Opor-se a tratamentos baseados em interesse legítimo e a comunicações comerciais.'],
      portabilidad: ['Portabilidade', 'Receber seus dados em formato estruturado e de uso comum, ou que os enviemos a outro responsável.'],
      bloqueo: ['Bloqueio', 'Suspender temporariamente o tratamento enquanto resolvemos uma retificação, eliminação ou oposição.'],
    } as Record<Derecho, [string, string]>,
    termsHeading: 'Prazos',
    terms: 'Confirmamos o recebimento e respondemos em até 30 dias corridos. Se precisarmos de mais tempo, o prazo pode ser prorrogado uma única vez por mais 30 dias e informaremos o motivo. Os pedidos de bloqueio são atendidos em 2 dias úteis.',
    identity: 'Para proteger seus dados, verificamos sua identidade antes de responder: pediremos uma cópia do seu documento de identidade e, se você atuar como representante, a procuração que o autoriza.',
    altHeading: 'Outro canal',
    altText: 'Você também pode escrever para',
    formHeading: 'Formulário de solicitação',
    formIntro: 'Os campos marcados com * são obrigatórios.',
    legendRights: 'Quais direitos você deseja exercer? *',
    legendRightsHint: 'Você pode marcar um ou mais.',
    sectionTitular: 'Dados do titular',
    labelNombre: 'Nome completo *',
    labelRun: 'RUN (número de identidade chileno) *',
    placeholderRun: '11.111.111-1',
    labelCorreo: 'E-mail *',
    hintCorreo: 'Enviaremos aqui a confirmação de recebimento e a resposta.',
    placeholderCorreo: 'nome@exemplo.com',
    labelTelefono: 'Telefone (opcional)',
    placeholderTelefono: '+56 9 0000 0000',
    labelRepresentante: 'Atuo como representante do titular',
    labelNombreRepresentante: 'Nome completo do representante *',
    labelDescripcion: 'Descreva sua solicitação *',
    hintDescripcion: `Conte o que você precisa (por exemplo, qual dado corrigir). Entre ${LIMITES.descripcionMin} e ${LIMITES.descripcion} caracteres.`,
    labelAdjunto: 'Documento de apoio (opcional)',
    hintAdjunto: 'Cópia do seu documento de identidade e, se for representante, a procuração (você pode juntá-los em um PDF). PDF, JPG ou PNG, até 5 MB.',
    removeFile: 'Remover arquivo',
    acceptBefore: 'Li a ',
    acceptLink: 'política de privacidade',
    acceptAfter: ' e autorizo a INSECAP a tratar os dados deste formulário para atender minha solicitação. *',
    honeypot: 'Site (deixe este campo vazio)',
    submit: 'Enviar solicitação',
    sending: 'Enviando…',
    errors: {
      derechos: { requerido: 'Marque pelo menos um direito.', invalido: 'Seleção inválida.' },
      nombreCompleto: { requerido: 'Informe seu nome completo.', largo: 'O nome é muito longo.', invalido: 'Verifique o nome.' },
      run: { requerido: 'Informe seu RUN.', invalido: 'O RUN não é válido: verifique os números e o dígito verificador.' },
      correo: { requerido: 'Informe seu e-mail.', invalido: 'Informe um e-mail válido.' },
      telefono: { invalido: 'Informe um telefone válido (apenas números, espaços e +).' },
      nombreRepresentante: { requerido: 'Informe o nome do representante.', largo: 'O nome é muito longo.', invalido: 'Verifique o nome.' },
      descripcion: { requerido: 'Descreva sua solicitação.', corto: `Escreva pelo menos ${LIMITES.descripcionMin} caracteres.`, largo: `Máximo de ${LIMITES.descripcion} caracteres.`, invalido: 'Verifique a descrição.' },
      adjunto: { tipoArchivo: 'O arquivo deve ser PDF, JPG ou PNG.', pesoArchivo: 'O arquivo deve ter menos de 5 MB.', invalido: 'Verifique o arquivo.' },
      aceptaPolitica: { requerido: 'Você deve aceitar a política de privacidade para enviar a solicitação.' },
    } as Partial<Record<CampoSolicitud, Partial<Record<ErrorCodigo, string>>>>,
    summaryErrors: 'Verifique os campos marcados.',
    sendErrors: {
      validacion: 'Não foi possível processar a solicitação porque alguns dados não são válidos. Verifique-os e tente novamente.',
      rateLimit: 'Recebemos muitas solicitações da sua conexão. Aguarde alguns minutos e tente novamente.',
      generico: 'Não foi possível enviar sua solicitação agora. Tente novamente mais tarde.',
      muyRapido: 'Revise seus dados e pressione «Enviar solicitação» novamente.',
    } as Record<ErrorEnvio, string>,
    sendErrorAlt: 'Se o problema continuar, escreva para',
    successHeading: 'Recebemos sua solicitação',
    successNumber: 'Seu número de acompanhamento é',
    successText: 'Enviaremos uma confirmação de recebimento para o seu e-mail. Guarde o número de acompanhamento para qualquer consulta sobre sua solicitação.',
    sendAnother: 'Enviar outra solicitação',
  },
};

const inputClass = 'rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11';
const invalidClass = 'border-destructive focus-visible:ring-destructive';
const labelClass = 'block text-sm font-semibold text-slate-700';
const hintClass = 'text-xs text-slate-500';

/** Lleva el 400 del backend (ValidationProblemDetails: errors { NombreCompleto: [...] }) a los campos. */
const erroresDelServidor = (body: unknown): ErroresSolicitud => {
  const errors = (body as { errors?: Record<string, unknown> } | null)?.errors;
  const out: ErroresSolicitud = {};
  if (!errors || typeof errors !== 'object') return out;
  for (const key of Object.keys(errors)) {
    const base = key.replace(/\[.*$/, '');
    const campo = (base.charAt(0).toLowerCase() + base.slice(1)) as CampoSolicitud;
    if (ORDEN_CAMPOS.includes(campo)) out[campo] = 'invalido';
  }
  return out;
};

const DerechosDatos = () => {
  const { locale, localizedPath } = useLocalizedPath();
  const c = content[locale];
  const fid = useId();
  const id = (campo: string) => `${fid}-${campo}`;

  const [form, setForm] = useState<SolicitudDerechos>(VACIA);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [sitioWeb, setSitioWeb] = useState('');
  const [errores, setErrores] = useState<ErroresSolicitud>({});
  const [errorEnvio, setErrorEnvio] = useState<ErrorEnvio | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState<{ numero: string | null } | null>(null);

  const inicio = useRef(0);
  const refs = useRef<Partial<Record<CampoSolicitud, HTMLElement | null>>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const exitoRef = useRef<HTMLHeadingElement>(null);
  const errorEnvioRef = useRef<HTMLDivElement>(null);

  // Se mide en el cliente (no en el render): tiempo mínimo de llenado anti-spam.
  useEffect(() => {
    inicio.current = Date.now();
  }, []);

  useEffect(() => {
    if (exito) exitoRef.current?.focus();
  }, [exito]);

  const set = <K extends keyof SolicitudDerechos>(campo: K, valor: SolicitudDerechos[K]) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const toggleDerecho = (d: Derecho, marcado: boolean) =>
    set('derechos', marcado ? DERECHOS.filter((x) => x === d || form.derechos.includes(x)) : form.derechos.filter((x) => x !== d));

  const enfocarPrimerError = (e: ErroresSolicitud) => {
    const primero = ORDEN_CAMPOS.find((campo) => e[campo]);
    if (primero) refs.current[primero]?.focus();
  };

  const mensaje = (campo: CampoSolicitud) => {
    const codigo = errores[campo];
    return codigo ? (c.errors[campo]?.[codigo] ?? c.errors[campo]?.invalido ?? c.summaryErrors) : null;
  };

  /** Props de accesibilidad de un campo: aria-invalid y aria-describedby con su ayuda y su error. */
  const a11y = (campo: CampoSolicitud, conAyuda = false) => {
    const describedBy = [conAyuda && id(`${campo}-hint`), errores[campo] && id(`${campo}-error`)].filter(Boolean).join(' ');
    return {
      'aria-invalid': errores[campo] ? true : undefined,
      'aria-describedby': describedBy || undefined,
    } as const;
  };

  const ErrorCampo = ({ campo }: { campo: CampoSolicitud }) => {
    const texto = mensaje(campo);
    return texto ? <p id={id(`${campo}-error`)} className="text-sm font-medium text-red-700">{texto}</p> : null;
  };

  const elegirArchivo = (file: File | null) => {
    setArchivo(file);
    const adjunto = file ? { name: file.name, size: file.size, type: file.type } : null;
    set('adjunto', adjunto);
    const err = validarAdjunto(adjunto);
    setErrores((e) => ({ ...e, adjunto: err }));
  };

  const quitarArchivo = () => {
    elegirArchivo(null);
    if (fileRef.current) {
      fileRef.current.value = '';
      fileRef.current.focus();
    }
  };

  const reiniciar = () => {
    setForm(VACIA);
    setArchivo(null);
    setErrores({});
    setErrorEnvio(null);
    setExito(null);
    inicio.current = Date.now();
  };

  const mostrarErrorEnvio = (tipo: ErrorEnvio) => {
    setErrorEnvio(tipo);
    requestAnimationFrame(() => errorEnvioRef.current?.focus());
  };

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setErrorEnvio(null);

    const e = validarSolicitud(form);
    setErrores(e);
    if (Object.keys(e).length > 0) {
      enfocarPrimerError(e);
      return;
    }

    // Honeypot lleno: es un bot. No se envía nada.
    if (sitioWeb) {
      mostrarErrorEnvio('generico');
      return;
    }
    const tiempoLlenadoMs = Date.now() - inicio.current;
    if (tiempoLlenadoMs < LIMITES.tiempoMinimoMs) {
      mostrarErrorEnvio('muyRapido');
      return;
    }

    const body = new FormData();
    for (const [k, v] of camposFormulario(form, { idioma: locale, sitioWeb, tiempoLlenadoMs })) body.append(k, v);
    if (archivo) body.append('Adjunto', archivo, archivo.name);

    setEnviando(true);
    try {
      const res = await fetch(apiUrl(ENDPOINT_DERECHOS_DATOS), { method: 'POST', body });
      const json: unknown = await res.json().catch(() => null);

      if (res.ok) {
        const numero = (json as { numeroSeguimiento?: unknown } | null)?.numeroSeguimiento;
        setExito({ numero: typeof numero === 'string' && numero ? numero : null });
        return;
      }
      if (res.status === 429) {
        mostrarErrorEnvio('rateLimit');
        return;
      }
      if (res.status === 400) {
        const delServidor = erroresDelServidor(json);
        setErrores(delServidor);
        mostrarErrorEnvio('validacion');
        return;
      }
      mostrarErrorEnvio('generico');
    } catch {
      mostrarErrorEnvio('generico');
    } finally {
      setEnviando(false);
    }
  };

  const mailto = (
    <a href={`mailto:${CORREO_PRIVACIDAD}`} className="font-semibold text-insecap-cyan-ink underline underline-offset-4 hover:text-primary">
      {CORREO_PRIVACIDAD}
    </a>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <SEO url="/derechos-datos" />

      <main>
        <PageHero
          title={c.title}
          subtitle={c.subtitle}
          breadcrumbs={[{ label: c.breadcrumbPolicy, href: '/politica-de-privacidad' }, { label: c.breadcrumb }]}
        />

        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 md:px-14 lg:px-16">
            <div className="grid gap-10 lg:grid-cols-5 max-w-6xl mx-auto">

              {/* Información: derechos, plazos y canal alternativo */}
              <div className="lg:col-span-2 space-y-8">
                <p className="text-slate-700 text-base leading-relaxed">{c.intro}</p>

                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-bold text-primary mb-4">
                    <ShieldCheck className="w-6 h-6 text-insecap-cyan-ink" aria-hidden="true" />
                    {c.rightsHeading}
                  </h2>
                  <dl className="space-y-3">
                    {DERECHOS.map((d) => (
                      <div key={d} className="rounded-xl bg-white border border-slate-200 p-4">
                        <dt className="font-semibold text-slate-900">{c.rights[d][0]}</dt>
                        <dd className="text-sm text-slate-600 leading-relaxed mt-1">{c.rights[d][1]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-bold text-primary mb-3">
                    <Clock className="w-6 h-6 text-insecap-cyan-ink" aria-hidden="true" />
                    {c.termsHeading}
                  </h2>
                  <p className="text-slate-700 leading-relaxed">{c.terms}</p>
                  <p className="text-slate-700 leading-relaxed mt-3">{c.identity}</p>
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-bold text-primary mb-3">
                    <Mail className="w-6 h-6 text-insecap-cyan-ink" aria-hidden="true" />
                    {c.altHeading}
                  </h2>
                  <p className="text-slate-700 leading-relaxed">{c.altText} {mailto}.</p>
                </div>
              </div>

              {/* Formulario */}
              <div className="lg:col-span-3 rounded-[1.5rem] bg-white border border-slate-200 shadow-sm p-6 md:p-10">
                {exito ? (
                  <div className="flex flex-col items-center text-center gap-5 py-10">
                    <CheckCircle2 className="w-16 h-16 text-green-600" aria-hidden="true" />
                    <h2 ref={exitoRef} tabIndex={-1} className="scroll-mt-28 text-2xl md:text-3xl font-bold text-slate-900 outline-none">
                      {c.successHeading}
                    </h2>
                    {exito.numero && (
                      <p className="text-slate-700">
                        {c.successNumber}{' '}
                        <strong className="block mt-2 text-2xl font-bold tracking-wide text-primary">{exito.numero}</strong>
                      </p>
                    )}
                    <p className="text-slate-600 max-w-md">{c.successText}</p>
                    <Button variant="outline" className="mt-2 rounded-xl" onClick={reiniciar}>
                      {c.sendAnother}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-8" aria-labelledby={id('titulo')} data-clarity-mask="true">
                    <div>
                      <h2 id={id('titulo')} className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{c.formHeading}</h2>
                      <p className={hintClass}>{c.formIntro}</p>
                    </div>

                    {/* Derechos */}
                    <fieldset className="space-y-3" aria-describedby={[id('derechos-hint'), errores.derechos && id('derechos-error')].filter(Boolean).join(' ')}>
                      <legend className={labelClass}>{c.legendRights}</legend>
                      <p id={id('derechos-hint')} className={hintClass}>{c.legendRightsHint}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {DERECHOS.map((d, i) => (
                          <label
                            key={d}
                            htmlFor={id(`derecho-${d}`)}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 min-h-11 py-2 cursor-pointer hover:border-blue-400"
                          >
                            <Checkbox
                              id={id(`derecho-${d}`)}
                              ref={i === 0 ? (el) => { refs.current.derechos = el; } : undefined}
                              checked={form.derechos.includes(d)}
                              onCheckedChange={(v) => toggleDerecho(d, v === true)}
                              aria-invalid={errores.derechos ? true : undefined}
                            />
                            <span className="text-sm text-slate-800">{c.rights[d][0]}</span>
                          </label>
                        ))}
                      </div>
                      <ErrorCampo campo="derechos" />
                    </fieldset>

                    {/* Titular */}
                    <fieldset className="space-y-5">
                      <legend className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-1">{c.sectionTitular}</legend>

                      <div className="space-y-1.5">
                        <label htmlFor={id('nombreCompleto')} className={labelClass}>{c.labelNombre}</label>
                        <Input
                          id={id('nombreCompleto')}
                          ref={(el) => { refs.current.nombreCompleto = el; }}
                          autoComplete="name"
                          maxLength={LIMITES.nombre}
                          value={form.nombreCompleto}
                          onChange={(e) => set('nombreCompleto', e.target.value)}
                          className={cn(inputClass, errores.nombreCompleto && invalidClass)}
                          {...a11y('nombreCompleto')}
                        />
                        <ErrorCampo campo="nombreCompleto" />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor={id('run')} className={labelClass}>{c.labelRun}</label>
                          <Input
                            id={id('run')}
                            ref={(el) => { refs.current.run = el; }}
                            inputMode="text"
                            autoComplete="off"
                            placeholder={c.placeholderRun}
                            value={form.run}
                            onChange={(e) => set('run', formatRut(e.target.value))}
                            className={cn(inputClass, errores.run && invalidClass)}
                            {...a11y('run')}
                          />
                          <ErrorCampo campo="run" />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor={id('telefono')} className={labelClass}>{c.labelTelefono}</label>
                          <Input
                            id={id('telefono')}
                            ref={(el) => { refs.current.telefono = el; }}
                            type="tel"
                            autoComplete="tel"
                            placeholder={c.placeholderTelefono}
                            value={form.telefono}
                            onChange={(e) => set('telefono', e.target.value)}
                            className={cn(inputClass, errores.telefono && invalidClass)}
                            {...a11y('telefono')}
                          />
                          <ErrorCampo campo="telefono" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor={id('correo')} className={labelClass}>{c.labelCorreo}</label>
                        <Input
                          id={id('correo')}
                          ref={(el) => { refs.current.correo = el; }}
                          type="email"
                          autoComplete="email"
                          maxLength={LIMITES.correo}
                          placeholder={c.placeholderCorreo}
                          value={form.correo}
                          onChange={(e) => set('correo', e.target.value)}
                          className={cn(inputClass, errores.correo && invalidClass)}
                          {...a11y('correo', true)}
                        />
                        <p id={id('correo-hint')} className={hintClass}>{c.hintCorreo}</p>
                        <ErrorCampo campo="correo" />
                      </div>

                      <div className="flex items-center gap-3 min-h-11">
                        <Checkbox
                          id={id('esRepresentante')}
                          ref={(el) => { refs.current.esRepresentante = el; }}
                          checked={form.esRepresentante}
                          onCheckedChange={(v) => set('esRepresentante', v === true)}
                        />
                        <label htmlFor={id('esRepresentante')} className="text-sm text-slate-800 cursor-pointer">{c.labelRepresentante}</label>
                      </div>

                      {form.esRepresentante && (
                        <div className="space-y-1.5">
                          <label htmlFor={id('nombreRepresentante')} className={labelClass}>{c.labelNombreRepresentante}</label>
                          <Input
                            id={id('nombreRepresentante')}
                            ref={(el) => { refs.current.nombreRepresentante = el; }}
                            maxLength={LIMITES.nombre}
                            value={form.nombreRepresentante}
                            onChange={(e) => set('nombreRepresentante', e.target.value)}
                            className={cn(inputClass, errores.nombreRepresentante && invalidClass)}
                            {...a11y('nombreRepresentante')}
                          />
                          <ErrorCampo campo="nombreRepresentante" />
                        </div>
                      )}
                    </fieldset>

                    {/* Solicitud */}
                    <div className="space-y-1.5">
                      <label htmlFor={id('descripcion')} className={labelClass}>{c.labelDescripcion}</label>
                      <Textarea
                        id={id('descripcion')}
                        ref={(el) => { refs.current.descripcion = el; }}
                        rows={5}
                        maxLength={LIMITES.descripcion}
                        value={form.descripcion}
                        onChange={(e) => set('descripcion', e.target.value)}
                        className={cn('min-h-32 rounded-xl border border-slate-300 bg-white text-slate-900 focus-visible:ring-blue-400 focus-visible:border-blue-400', errores.descripcion && invalidClass)}
                        {...a11y('descripcion', true)}
                      />
                      <p id={id('descripcion-hint')} className={hintClass}>{c.hintDescripcion}</p>
                      <ErrorCampo campo="descripcion" />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor={id('adjunto')} className={labelClass}>{c.labelAdjunto}</label>
                      <input
                        id={id('adjunto')}
                        ref={(el) => { fileRef.current = el; refs.current.adjunto = el; }}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        onChange={(e) => elegirArchivo(e.target.files?.[0] ?? null)}
                        className={cn(
                          'block w-full text-sm text-slate-700 rounded-xl border border-dashed border-slate-300 bg-white p-2 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                          errores.adjunto && 'border-destructive',
                        )}
                        {...a11y('adjunto', true)}
                      />
                      <p id={id('adjunto-hint')} className={hintClass}>{c.hintAdjunto}</p>
                      {archivo && (
                        <button type="button" onClick={quitarArchivo} className="text-sm font-semibold text-insecap-cyan-ink underline underline-offset-4 hover:text-primary">
                          {c.removeFile}
                        </button>
                      )}
                      <ErrorCampo campo="adjunto" />
                    </div>

                    {/* Honeypot: invisible para personas; los bots suelen llenarlo. */}
                    <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
                      <label htmlFor={id('sitioWeb')}>{c.honeypot}</label>
                      <input
                        id={id('sitioWeb')}
                        type="text"
                        name="sitioWeb"
                        tabIndex={-1}
                        autoComplete="off"
                        value={sitioWeb}
                        onChange={(e) => setSitioWeb(e.target.value)}
                      />
                    </div>

                    {/* Aceptación: no premarcada */}
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={id('aceptaPolitica')}
                          ref={(el) => { refs.current.aceptaPolitica = el; }}
                          checked={form.aceptaPolitica}
                          onCheckedChange={(v) => set('aceptaPolitica', v === true)}
                          className="mt-0.5"
                          {...a11y('aceptaPolitica')}
                        />
                        <label htmlFor={id('aceptaPolitica')} className="text-sm text-slate-700 leading-relaxed cursor-pointer">
                          {c.acceptBefore}
                          <Link to={localizedPath('/politica-de-privacidad')} className="font-semibold text-insecap-cyan-ink underline underline-offset-4 hover:text-primary">
                            {c.acceptLink}
                          </Link>
                          {c.acceptAfter}
                        </label>
                      </div>
                      <ErrorCampo campo="aceptaPolitica" />
                    </div>

                    {errorEnvio && (
                      <div ref={errorEnvioRef} tabIndex={-1} role="alert" className="scroll-mt-28 rounded-xl border border-destructive/40 bg-red-50 p-4 text-sm text-slate-800 outline-none">
                        <p>{c.sendErrors[errorEnvio]}</p>
                        {errorEnvio !== 'muyRapido' && <p className="mt-2">{c.sendErrorAlt} {mailto}.</p>}
                      </div>
                    )}

                    <p className="sr-only" role="status">
                      {Object.values(errores).some(Boolean) ? c.summaryErrors : ''}
                    </p>

                    <Button
                      type="submit"
                      disabled={enviando}
                      className="w-full h-12 rounded-full bg-primary hover:bg-[#3547B1] text-white font-semibold text-base"
                    >
                      {enviando ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                          {c.sending}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" aria-hidden="true" />
                          {c.submit}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DerechosDatos;
