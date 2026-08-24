import { useEffect, useState } from 'react';
import { Send, Loader2, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { formatRut } from '@/lib/insecapUtils';
import { Link } from 'react-router-dom';

interface Ciudad {
  id: number;
  nombre: string;
}

interface CursoParticular {
  id: number;
  codigoCurso: string;
  nombreCurso: string;
  tipoEjecucion: string;
  fechaInicio: string;
  fechaTermino: string;
  valorMaximoPorPersona: number;
}

// Este formulario habla con el TMS Plus (api-plus.insecap.cl), no con el TMS clásico.
// En dev pega a rutas relativas: el proxy de Vite (vite.config.ts → TMS_PLUS_PROXY_TARGET)
// las reenvía server-side, evitando CORS. En prod arma la URL completa.
const getApiUrl = (endpoint: string) => {
  const baseUrl = import.meta.env.VITE_TMS_PLUS_API_URL;
  return import.meta.env.PROD ? `${baseUrl}${endpoint}` : endpoint;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-CL');
};

// Sentinel: ningún curso real usa este id. Al elegirlo se pide texto libre en vez de idCalendarizacionAbierta.
const CURSO_NO_LISTADO = '-1';

// Cursos abiertos ofertados que todavía no tienen calendarización cargada en el TMS.
// Se listan igual para que se puedan solicitar; viajan como texto libre (cursoInteres),
// no como idCalendarizacionAbierta. Al cargarlos en el TMS, borrar la entrada de aquí.
//
// OJO: un curso listado acá NO genera interesado en el R08 del TMS — el backend solo lo crea
// cuando llega un idCalendarizacionAbierta real (ContactoPublicoController). Por eso esta lista
// es un último recurso: si el curso ya tiene calendarización vigente, sacarlo de acá.
const CURSOS_SIN_CALENDARIZACION: {
  id: string;
  modalidad: string;
  nombreCurso: string;
  fecha: string;
  nota?: Record<string, string>;
}[] = [
  // Septiembre 2026 · presenciales Calama (ids negativos, sin calendarización en el TMS todavía)
  { id: '-10', modalidad: '1', nombreCurso: 'Trabajo en Altura Física', fecha: '01-09-2026' },
  { id: '-11', modalidad: '1', nombreCurso: 'Trabajo en Altura Física', fecha: '08-09-2026' },
  { id: '-12', modalidad: '1', nombreCurso: 'Trabajo en Altura Física', fecha: '22-09-2026' },
  { id: '-13', modalidad: '1', nombreCurso: 'Técnicas de Aislación y Bloqueo', fecha: '03-09-2026' },
  { id: '-14', modalidad: '1', nombreCurso: 'Técnicas de Aislación y Bloqueo', fecha: '10-09-2026' },
  { id: '-15', modalidad: '1', nombreCurso: 'Técnicas de Aislación y Bloqueo', fecha: '24-09-2026' },
  { id: '-16', modalidad: '1', nombreCurso: 'Espacios Confinados', fecha: '04-09-2026' },
  { id: '-17', modalidad: '1', nombreCurso: 'Espacios Confinados', fecha: '11-09-2026' },
  { id: '-18', modalidad: '1', nombreCurso: 'Espacios Confinados', fecha: '25-09-2026' },
];

// Aclaraciones por calendarización (id que entrega /cursos-particulares). Para cursos cuya
// distribución horaria no se deduce de las fechas del select.
const NOTAS_POR_CALENDARIZACION: Record<string, Record<string, string>> = {
  // 468 = SAP PM (ES-TEC-3001), 28-08-2026: 24 hrs repartidas en viernes y sábados.
  '468': {
    es: 'La fecha corresponde al primer día (viernes, 4 hrs). Las 24 hrs se distribuyen en viernes de 4 hrs y sábados de 8 hrs; los días siguientes se acuerdan con el relator en la primera sesión.',
    en: 'The date shown is the first day (Friday, 4 hrs). The 24 hrs are split into 4-hr Fridays and 8-hr Saturdays; remaining days are agreed with the instructor in the first session.',
    pt: 'A data indicada corresponde ao primeiro dia (sexta-feira, 4 hrs). As 24 hrs sao distribuidas em sextas de 4 hrs e sabados de 8 hrs; os demais dias sao acordados com o instrutor na primeira sessao.',
  },
};

interface OpenCourseRequestFormProps {
  onSuccess?: () => void;
  // Cuando se pasan, fijan y ocultan el campo correspondiente (ej. vista /formulario/cursos-abiertos).
  fixedCiudadNombre?: string;
  fixedTipoContactado?: '1' | '2';
  fixedModalidad?: '1' | '2';
  /** Preselecciona la modalidad dejándola editable (hay cursos abiertos presenciales y online). */
  defaultModalidad?: '1' | '2';
  /** Preselecciona una fecha del select (id de calendarización que entrega la API). */
  preselectedCalendarizacionId?: string;
}

const OpenCourseRequestForm = ({
  onSuccess,
  fixedCiudadNombre,
  fixedTipoContactado,
  fixedModalidad,
  defaultModalidad,
  preselectedCalendarizacionId,
}: OpenCourseRequestFormProps) => {
  const { locale, localizedPath } = useLocalizedPath();
  const { toast } = useToast();

  const buildInitialFormState = () => ({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    ciudadId: '',
    rut: '',
    noTieneRut: false,
    aceptaPrivacidad: false,
    tipoContactado: (fixedTipoContactado ?? '') as '' | '1' | '2',
    modalidadEjecucion: (fixedModalidad ?? defaultModalidad ?? '') as '' | '1' | '2',
    idCalendarizacionAbierta: preselectedCalendarizacionId ?? '',
    cursoInteres: '',
  });

  const [formData, setFormData] = useState(buildInitialFormState);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [cursos, setCursos] = useState<CursoParticular[]>([]);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(getApiUrl('/api/contacto/ciudades'))
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Ciudad[]) => {
        setCiudades(data);
        if (fixedCiudadNombre) {
          const match = data.find((c) => c.nombre.toLowerCase() === fixedCiudadNombre.toLowerCase());
          if (match) setFormData((prev) => ({ ...prev, ciudadId: String(match.id) }));
        }
      })
      .catch(() => setCiudades([]));
  }, [fixedCiudadNombre]);

  // El select de cursos reemplaza el texto libre cuando la modalidad viene fija (vista /cursos-abiertos)
  // o cuando el usuario elige "Particular" en el flujo general de contacto.
  const showCursoSelect =
    fixedModalidad !== undefined || defaultModalidad !== undefined || formData.tipoContactado === '1';
  const cursoNoListadoSelected = showCursoSelect && formData.idCalendarizacionAbierta === CURSO_NO_LISTADO;

  // Cursos ofertados sin calendarización, filtrados por la modalidad elegida.
  const cursosSinCalendarizacion = CURSOS_SIN_CALENDARIZACION.filter(
    (c) => c.modalidad === formData.modalidadEjecucion
  );
  const cursoSinCalendarizacionSelected = cursosSinCalendarizacion.find(
    (c) => c.id === formData.idCalendarizacionAbierta
  );
  // Ambos casos viajan como texto libre; solo el "no listado" pide escribirlo a mano.
  const enviarComoTextoLibre = cursoNoListadoSelected || Boolean(cursoSinCalendarizacionSelected);
  // La aclaración horaria sale del mapa por calendarización; si el curso todavía es hardcodeado,
  // se usa la suya.
  const notaCurso =
    cursoSinCalendarizacionSelected?.nota ??
    NOTAS_POR_CALENDARIZACION[formData.idCalendarizacionAbierta];

  useEffect(() => {
    if (!showCursoSelect || !formData.modalidadEjecucion) {
      setCursos([]);
      return;
    }

    setLoadingCursos(true);
    fetch(getApiUrl(`/api/contacto/cursos-particulares?modalidad=${formData.modalidadEjecucion}`))
      .then((res) => (res.ok ? res.json() : []))
      .then((data: CursoParticular[]) => {
        setCursos(data);
        // Conserva la fecha que venía preseleccionada desde el catálogo, si sigue vigente.
        // Los cursos sin calendarización no vienen en la respuesta: se validan aparte.
        const preseleccionValida =
          preselectedCalendarizacionId &&
          (data.some((curso) => String(curso.id) === preselectedCalendarizacionId) ||
            CURSOS_SIN_CALENDARIZACION.some((c) => c.id === preselectedCalendarizacionId));
        setFormData((prev) => ({
          ...prev,
          idCalendarizacionAbierta: preseleccionValida ? preselectedCalendarizacionId : '',
        }));
      })
      .catch(() => setCursos([]))
      .finally(() => setLoadingCursos(false));
  }, [showCursoSelect, formData.modalidadEjecucion, preselectedCalendarizacionId]);

  const content = {
    es: {
      labelNombre: 'Nombre completo',
      labelEmail: 'Correo electrónico',
      labelTelefono: 'Teléfono',
      labelRut: 'RUT',
      noTieneRut: 'No tengo RUT',
      labelCiudad: 'Ciudad',
      selectPlaceholder: 'Selecciona...',
      labelTipoContactado: '¿Nos contactas como...?',
      particular: 'Particular',
      empresa: 'Empresa',
      labelModalidad: 'Modalidad',
      presencial: 'Presencial',
      online: 'Online',
      labelCurso: 'Curso',
      loadingCursos: 'Cargando cursos...',
      noCursos: 'No hay cursos disponibles para esta modalidad',
      cursoNoListado: 'El curso que quiero no está en la lista',
      labelCursoInteres: 'Curso de interés',
      placeholderCursoInteres: 'Ej: Curso de prevención de riesgos',
      labelMensaje: 'Mensaje',
      placeholderMensaje: 'Cuéntanos qué necesitas...',
      privacyPrefix: 'Acepto la',
      privacyLink: 'política de privacidad',
      submitBtn: 'Enviar solicitud',
      sending: 'Enviando...',
      successTitle: 'Solicitud enviada',
      successMsg: '¡Gracias por contactarnos! Te responderemos a la brevedad.',
      sendAnother: 'Enviar otra solicitud',
      errorTitle: 'No se pudo enviar tu solicitud',
      errorDesc: 'Ocurrió un problema al enviar tu información. Inténtalo nuevamente.',
    },
    en: {
      labelNombre: 'Full name',
      labelEmail: 'Email address',
      labelTelefono: 'Phone',
      labelRut: 'ID Number (RUT)',
      noTieneRut: "I don't have a RUT",
      labelCiudad: 'City',
      selectPlaceholder: 'Select...',
      labelTipoContactado: 'Are you contacting us as...?',
      particular: 'Individual',
      empresa: 'Company',
      labelModalidad: 'Modality',
      presencial: 'In-person',
      online: 'Online',
      labelCurso: 'Course',
      loadingCursos: 'Loading courses...',
      noCursos: 'No courses available for this modality',
      cursoNoListado: "The course I want isn't on the list",
      labelCursoInteres: 'Course of interest',
      placeholderCursoInteres: 'E.g: Risk prevention course',
      labelMensaje: 'Message',
      placeholderMensaje: 'Tell us what you need...',
      privacyPrefix: 'I accept the',
      privacyLink: 'privacy policy',
      submitBtn: 'Send request',
      sending: 'Sending...',
      successTitle: 'Request sent',
      successMsg: 'Thanks for contacting us! We will get back to you shortly.',
      sendAnother: 'Send another request',
      errorTitle: 'Could not send your request',
      errorDesc: 'There was a problem sending your information. Please try again.',
    },
    pt: {
      labelNombre: 'Nome completo',
      labelEmail: 'E-mail',
      labelTelefono: 'Telefone',
      labelRut: 'RUT',
      noTieneRut: 'Não tenho RUT',
      labelCiudad: 'Cidade',
      selectPlaceholder: 'Selecione...',
      labelTipoContactado: 'Você está entrando em contato como...?',
      particular: 'Particular',
      empresa: 'Empresa',
      labelModalidad: 'Modalidade',
      presencial: 'Presencial',
      online: 'Online',
      labelCurso: 'Curso',
      loadingCursos: 'Carregando cursos...',
      noCursos: 'Nenhum curso disponível para esta modalidade',
      cursoNoListado: 'O curso que eu quero não está na lista',
      labelCursoInteres: 'Curso de interesse',
      placeholderCursoInteres: 'Ex: Curso de prevenção de riscos',
      labelMensaje: 'Mensagem',
      placeholderMensaje: 'Conte-nos o que você precisa...',
      privacyPrefix: 'Aceito a',
      privacyLink: 'política de privacidade',
      submitBtn: 'Enviar solicitação',
      sending: 'Enviando...',
      successTitle: 'Solicitação enviada',
      successMsg: 'Obrigado por entrar em contato! Responderemos em breve.',
      sendAnother: 'Enviar outra solicitação',
      errorTitle: 'Não foi possível enviar sua solicitação',
      errorDesc: 'Ocorreu um problema ao enviar suas informações. Tente novamente.',
    },
  }[locale];

  const inputClass =
    'rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11';
  const labelClass = 'block text-xs font-semibold tracking-widest text-slate-500 uppercase';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'rut' ? formatRut(value) : value }));
  };

  const resetForm = () => {
    setFormData((prev) => ({ ...buildInitialFormState(), ciudadId: fixedCiudadNombre ? prev.ciudadId : '' }));
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        mensaje: formData.mensaje.trim(),
        ciudadId: formData.ciudadId ? Number(formData.ciudadId) : null,
        rut: formData.noTieneRut ? '' : formData.rut.trim(),
        noTieneRut: formData.noTieneRut,
        aceptaPrivacidad: formData.aceptaPrivacidad,
        tipoContactado: Number(formData.tipoContactado),
        modalidadEjecucion: Number(formData.modalidadEjecucion),
        idCalendarizacionAbierta:
          showCursoSelect && !enviarComoTextoLibre ? Number(formData.idCalendarizacionAbierta) : null,
        cursoInteres: cursoSinCalendarizacionSelected
          ? `${cursoSinCalendarizacionSelected.nombreCurso} — ${cursoSinCalendarizacionSelected.fecha}`
          : !showCursoSelect || cursoNoListadoSelected
            ? formData.cursoInteres.trim()
            : null,
      };

      const res = await fetch(getApiUrl('/api/contacto'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok || !result?.success) {
        // El backend manda la lista de campos inválidos en `errors`; se muestran en vez del mensaje genérico
        const errors: string[] = Array.isArray(result?.errors) ? result.errors : [];
        toast({
          variant: 'destructive',
          title: content.errorTitle,
          description: errors.length ? errors.join(' ') : result?.message || content.errorDesc,
        });
        return;
      }

      setSubmitted(true);
      onSuccess?.();
    } catch {
      toast({ variant: 'destructive', title: content.errorTitle, description: content.errorDesc });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-16">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <p className="text-slate-700 text-lg font-medium max-w-sm">{content.successMsg}</p>
        <Button
          variant="outline"
          className="mt-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-xl"
          onClick={resetForm}
        >
          {content.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className={labelClass}>{content.labelNombre}</label>
        <Input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>{content.labelEmail}</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>{content.labelTelefono}</label>
          <Input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <div className="space-y-1.5">
          <label className={labelClass}>{content.labelRut}</label>
          <Input
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            required={!formData.noTieneRut}
            disabled={formData.noTieneRut}
            placeholder="12.345.678-9"
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 h-11 text-sm text-slate-600">
          <Checkbox
            checked={formData.noTieneRut}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, noTieneRut: checked === true, rut: checked === true ? '' : prev.rut }))
            }
          />
          {content.noTieneRut}
        </label>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>{content.labelCiudad}</label>
        <select
          name="ciudadId"
          value={formData.ciudadId}
          onChange={(e) => setFormData((prev) => ({ ...prev, ciudadId: e.target.value }))}
          required
          // Si la ciudad fija no existe en el catálogo, se deja elegir: un select deshabilitado
          // salta el `required` y el backend responde 400 (CiudadId obligatorio).
          disabled={!!fixedCiudadNombre && !!formData.ciudadId}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <option value="">{content.selectPlaceholder}</option>
          {ciudades.map((ciudad) => (
            <option key={ciudad.id} value={ciudad.id}>
              {ciudad.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>{content.labelTipoContactado}</label>
          <div className="flex gap-3 h-11 items-center">
            {(['1', '2'] as const).map((value) => (
              <label
                key={value}
                className={`flex items-center gap-2 text-sm text-slate-700 ${fixedTipoContactado ? 'opacity-70' : ''}`}
              >
                <input
                  type="radio"
                  name="tipoContactado"
                  value={value}
                  checked={formData.tipoContactado === value}
                  onChange={() => setFormData((prev) => ({ ...prev, tipoContactado: value }))}
                  required
                  disabled={!!fixedTipoContactado}
                  className="accent-blue-600 disabled:cursor-not-allowed"
                />
                {value === '1' ? content.particular : content.empresa}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>{content.labelModalidad}</label>
          <div className="flex gap-3 h-11 items-center">
            {(['1', '2'] as const).map((value) => (
              <label
                key={value}
                className={`flex items-center gap-2 text-sm text-slate-700 ${fixedModalidad ? 'opacity-70' : ''}`}
              >
                <input
                  type="radio"
                  name="modalidadEjecucion"
                  value={value}
                  checked={formData.modalidadEjecucion === value}
                  onChange={() => setFormData((prev) => ({ ...prev, modalidadEjecucion: value }))}
                  required
                  disabled={!!fixedModalidad}
                  className="accent-blue-600 disabled:cursor-not-allowed"
                />
                {value === '1' ? content.presencial : content.online}
              </label>
            ))}
          </div>
        </div>
      </div>

      {showCursoSelect ? (
        <div className="space-y-1.5">
          <label className={labelClass}>{content.labelCurso}</label>
          <select
            name="idCalendarizacionAbierta"
            value={formData.idCalendarizacionAbierta}
            onChange={(e) => setFormData((prev) => ({ ...prev, idCalendarizacionAbierta: e.target.value }))}
            required
            disabled={loadingCursos}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11 disabled:opacity-50"
          >
            <option value="">
              {loadingCursos
                ? content.loadingCursos
                : cursos.length === 0 && cursosSinCalendarizacion.length === 0
                  ? content.noCursos
                  : content.selectPlaceholder}
            </option>
            <option value={CURSO_NO_LISTADO}>{content.cursoNoListado}</option>
            {cursosSinCalendarizacion.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombreCurso} — {curso.fecha}
              </option>
            ))}
            {Object.entries(
              cursos.reduce<Record<string, CursoParticular[]>>((grupos, curso) => {
                (grupos[curso.nombreCurso] ??= []).push(curso);
                return grupos;
              }, {})
            ).map(([nombreCurso, fechas]) => (
              <optgroup key={nombreCurso} label={nombreCurso}>
                {fechas.map((curso) => (
                  // El nombre va también en la opción: al cerrarse el select el optgroup
                  // no se ve y solo quedaría la fecha, sin decir de qué curso es.
                  <option key={curso.id} value={curso.id}>
                    {nombreCurso} — {formatDate(curso.fechaInicio)} al{' '}
                    {formatDate(curso.fechaTermino)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {notaCurso && (
            <p className="mt-2 flex gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs leading-relaxed text-slate-600">
              <Info className="mt-0.5 w-4 h-4 shrink-0 text-blue-600" />
              <span>{notaCurso[locale]}</span>
            </p>
          )}
          {cursoNoListadoSelected && (
            <Input
              name="cursoInteres"
              value={formData.cursoInteres}
              onChange={handleChange}
              placeholder={content.placeholderCursoInteres}
              required
              className={`${inputClass} mt-2`}
            />
          )}
        </div>
      ) : (
        formData.tipoContactado === '2' && (
          <div className="space-y-1.5">
            <label className={labelClass}>{content.labelCursoInteres}</label>
            <Input
              name="cursoInteres"
              value={formData.cursoInteres}
              onChange={handleChange}
              placeholder={content.placeholderCursoInteres}
              required
              className={inputClass}
            />
          </div>
        )
      )}

      <div className="space-y-1.5">
        <label className={labelClass}>{content.labelMensaje}</label>
        <Textarea
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          placeholder={content.placeholderMensaje}
          rows={4}
          className="min-h-28 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 focus-visible:border-blue-400"
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-600">
        <Checkbox
          checked={formData.aceptaPrivacidad}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, aceptaPrivacidad: checked === true }))}
          required
          className="mt-0.5"
        />
        <span>
          {content.privacyPrefix}{' '}
          <Link to={localizedPath('/politica-de-privacidad')} target="_blank" className="text-blue-600 hover:underline">
            {content.privacyLink}
          </Link>
        </span>
      </label>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-13 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base py-4 shadow-sm transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {content.sending}
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            {content.submitBtn}
          </>
        )}
      </Button>
    </form>
  );
};

export default OpenCourseRequestForm;
