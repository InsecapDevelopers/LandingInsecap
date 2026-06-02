import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Send, Loader2, CheckCircle2, Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const formatOptionLabel = (option: any) => {
  return option.nombre + (option.comuna ? ` (${option.comuna}, ${option.region})` : '');
};

const getPublicApiBaseUrl = () => {
  // En DEV usamos ruta relativa para que el proxy de Vite maneje el SSL del backend local.
  // En producción apuntamos a la URL del env o al dominio de producción.
  if (import.meta.env.DEV) return '';
  return import.meta.env.VITE_TMS_API_URL ?? 'https://tms.insecap.cl';
};

// --- Subcomponente para los Selects con buscador ---
const SearchableSelect = ({ label, options, value, onChange, placeholder = "Selecciona..." }: {
  label: string, 
  options: any[], 
  value: string, 
  onChange: (val: string) => void,
  placeholder?: string
}) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => String(opt.id) === String(value));

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11 font-normal"
          >
            <span className="truncate">
              {selectedOption ? formatOptionLabel(selectedOption) : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar..." />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const displayStr = formatOptionLabel(opt);
                  return (
                    <CommandItem
                      key={String(opt.id)}
                      value={displayStr}
                      onSelect={() => {
                        const optId = String(opt.id);
                        onChange(optId === String(value) ? "" : optId);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          String(value) === String(opt.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {displayStr}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const MultiSearchableSelect = ({ label, options, values, onChange, placeholder = "Selecciona uno o más..." }: {
  label: string,
  options: any[],
  values: string[],
  onChange: (vals: string[]) => void,
  placeholder?: string
}) => {
  const [open, setOpen] = useState(false);
  const selectedOptions = options.filter((opt) => values.includes(String(opt.id)));

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-expanded={open}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpen(true);
              }
            }}
            className="flex min-h-[7.75rem] w-full cursor-pointer items-start justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:border-blue-400"
          >
            <div className="flex min-h-[4.5rem] flex-1 flex-wrap content-start gap-2 pr-3 text-left">
              {selectedOptions.length === 0 ? (
                <span className="pt-1 text-slate-400">{placeholder}</span>
              ) : (
                selectedOptions.map((option) => {
                  const optionId = String(option.id);

                  return (
                    <span
                      key={optionId}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-[15px] text-slate-600 shadow-sm"
                    >
                      <button
                        type="button"
                        aria-label={`Quitar ${formatOptionLabel(option)}`}
                        className="text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus:text-slate-700"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onChange(values.filter((value) => value !== optionId));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <span className="truncate">{formatOptionLabel(option)}</span>
                    </span>
                  );
                })
              )}
            </div>
            <ChevronsUpDown className="mt-1 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar..." />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const optionId = String(opt.id);
                  const displayStr = formatOptionLabel(opt);
                  const isSelected = values.includes(optionId);

                  return (
                    <CommandItem
                      key={optionId}
                      value={displayStr}
                      onSelect={() => {
                        onChange(
                          isSelected
                            ? values.filter((value) => value !== optionId)
                            : [...values, optionId]
                        );
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {displayStr}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const BeRelator = () => {
  const { locale } = useLocalizedPath();
  const { toast } = useToast();
  const heading = useScrollAnimation({ triggerOnce: true });
  const formRef = useScrollAnimation({ triggerOnce: true });

  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    rut: '',
    correo: '',
    telefonoPrefix: '+56',
    telefono: '9',
    observaciones: '',
    profesionId: '',
    disponibilidadId: '',
    categoriaId: '',
    ciudadId: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States para selectores
  const [profesiones, setProfesiones] = useState<any[]>([]);
  const [disponibilidades, setDisponibilidades] = useState<any[]>([]);
  const [idiomas, setIdiomas] = useState<any[]>([]);
  const [selectedIdiomaIds, setSelectedIdiomaIds] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);

  useEffect(() => {
    const fetchSelects = async () => {
      const baseUrl = getPublicApiBaseUrl();
      try {
        const [resProfesiones, resDisponibilidades, resIdiomas, resCategorias, resCiudades] = await Promise.all([
          fetch(`${baseUrl}/api/publica/profesiones`),
          fetch(`${baseUrl}/api/publica/disponibilidades`),
          fetch(`${baseUrl}/api/publica/idiomas`),
          fetch(`${baseUrl}/api/publica/categorias`),
          fetch(`${baseUrl}/api/publica/ciudades`)
        ]);

        const parseData = async (res: Response) => {
          const json = await res.json();
          return json.data || json;
        };

        if (resProfesiones.ok) setProfesiones(await parseData(resProfesiones));
        if (resDisponibilidades.ok) setDisponibilidades(await parseData(resDisponibilidades));
        if (resIdiomas.ok) {
          const fetchedIdiomas = await parseData(resIdiomas);
          setIdiomas(fetchedIdiomas);
          // Set Español por defecto si existe y no hay nada seleccionado
          if (Array.isArray(fetchedIdiomas)) {
            const espanol = fetchedIdiomas.find(i => i.nombre?.trim().toLowerCase() === 'español' || i.nombre?.trim().toLowerCase() === 'espanol');
            if (espanol) {
              setSelectedIdiomaIds(prev => prev.length === 0 ? [String(espanol.id)] : prev);
            }
          }
        }
        if (resCategorias.ok) {
          const catData = await parseData(resCategorias);
          if (Array.isArray(catData)) {
            const excluded = ['Pre-Contrato', 'Recertificaciones de Capacitación', 'Miscellaneous'];
            const seen = new Set();
            const filteredCat = catData.filter(c => {
              const name = c.nombre?.trim() || '';
              if (!name) return false;
              if (excluded.includes(name)) return false;
              if (seen.has(name)) return false;
              seen.add(name);
              return true;
            });
            setCategorias(filteredCat);
          } else {
            setCategorias(catData);
          }
        }
        if (resCiudades.ok) setCiudades(await parseData(resCiudades));
      } catch (error) {
        console.error("Error al cargar los selectores:", error);
      }
    };

    fetchSelects();
  }, []);

  const formatRut = (rut: string) => {
    let cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    
    // Limitar a 9 caracteres (8 para el cuerpo + 1 para el DV)
    if (cleanRut.length > 9) {
      cleanRut = cleanRut.slice(0, 9);
    }

    if (cleanRut.length === 0) return '';
    if (cleanRut.length <= 1) return cleanRut;

    const dv = cleanRut.slice(-1);
    const body = cleanRut.slice(0, -1);

    let formattedBody = '';
    for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
      formattedBody = body.charAt(i) + formattedBody;
      if ((j + 1) % 3 === 0 && i !== 0) {
        formattedBody = '.' + formattedBody;
      }
    }

    return `${formattedBody}-${dv}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === 'rut') {
      newValue = formatRut(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar correo (acepta mínimo formato texto@texto.texto ej: a@a.cl)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.correo)) {
      toast({
        variant: "destructive",
        title: content.invalidEmailTitle,
        description: content.invalidEmailDesc,
      });
      return;
    }

    if (cvFile) {
      const fileName = cvFile.name.toLowerCase();
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const hasValidExtension = validExtensions.some((extension) => fileName.endsWith(extension));

      if (!hasValidExtension) {
        toast({
          variant: "destructive",
          title: content.invalidFileTitle,
          description: content.invalidFileDesc,
        });
        return;
      }

      if (cvFile.size > 25 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: content.invalidFileTitle,
          description: content.fileTooLargeDesc,
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.append('Nombre', formData.nombre.trim());
      body.append('Rut', formData.rut.trim());
      body.append('Correo', formData.correo.trim());

      if (formData.apellidoPaterno.trim()) body.append('ApellidoPaterno', formData.apellidoPaterno.trim());
      if (formData.apellidoMaterno.trim()) body.append('ApellidoMaterno', formData.apellidoMaterno.trim());
      if (formData.telefono.trim()) body.append('Telefono', `${formData.telefonoPrefix} ${formData.telefono}`.trim());
      if (formData.observaciones.trim()) body.append('Observaciones', formData.observaciones.trim());
      if (formData.profesionId) body.append('IdProfesion', formData.profesionId);
      if (formData.disponibilidadId) body.append('IdDisponibilidad', formData.disponibilidadId);
      if (formData.categoriaId) body.append('IdCategoriaR11', formData.categoriaId);
      if (formData.ciudadId) body.append('IdCiudad', formData.ciudadId);
      selectedIdiomaIds.forEach((idiomaId, index) => body.append(`IdsIdiomas[${index}]`, idiomaId));
      if (cvFile) body.append('ArchivoBase', cvFile, cvFile.name);

      console.group(`[LANDING][POSTULAR] >>> Nueva postulación: ${formData.rut.trim()} - ${formData.nombre.trim()}`);
      console.log("URL de destino:", `${getPublicApiBaseUrl()}/api/publica/postular`);
      const payloadLog: any = {};
      for (const [key, value] of body.entries()) {
        payloadLog[key] = value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value;
      }
      console.log("Payload (FormData):", payloadLog);

      const response = await fetch(`${getPublicApiBaseUrl()}/api/publica/postular`, {
        method: 'POST',
        body,
      });

      console.log(`Response HTTP Status: ${response.status} ${response.statusText}`);
      
      const result = await response.json().catch(() => null);
      console.log("Response Body (JSON):", result);
      console.groupEnd();

      if (!response.ok || result?.error) {
        toast({
          variant: "destructive",
          title: content.errorTitle,
          description: result?.message || content.errorDesc,
        });
        return;
      }

      setSubmitted(true);
      toast({
        title: content.successTitle,
        description: result?.message || content.successDesc,
      });
    } catch (err) {
      console.error("[LANDING][POSTULAR] Exception al hacer fetch:", err);
      toast({
        variant: "destructive",
        title: content.errorTitle,
        description: content.errorDesc,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = {
    es: {
      title: 'TRABAJA CON NOSOTROS',
      subtitle: 'Insecap Capacitación',
      breadcrumb: 'TRABAJA CON NOSOTROS',
      brand: 'Insecap Capacitación',
      paragraph1: 'Estamos en constante búsqueda de talento apasionado por la enseñanza y la capacitación. Si eres un relator de capacitación con experiencia y compromiso por compartir tu conocimiento, te invitamos a formar parte de nuestro dinámico equipo de facilitadores.',
      paragraph2: 'Para iniciar el proceso, te pedimos que completes nuestro formulario de contacto. En él podrás proporcionarnos información sobre tu experiencia, áreas de especialización y cómo crees que puedes contribuir a nuestro equipo.',
      formTitle: 'Formulario Trabaja con Nosotros',
      labelNombre: 'Nombre',
      labelApellidoPaterno: 'Apellido Paterno',
      labelApellidoMaterno: 'Apellido Materno',
      labelRut: 'RUT',
      labelCorreo: 'Correo Electrónico',
      labelTelefono: 'Teléfono',
      labelObservaciones: 'Observaciones',
      labelCv: 'Currículum Vitae',
      labelProfesion: 'Profesión',
      labelDisponibilidad: 'Disponibilidad',
      labelIdioma: 'Idiomas',
      labelCategoria: 'Categoría',
      labelCiudad: 'Ciudad',
      formTag: 'TRABAJA CON NOSOTROS',
      formHeading: 'Postula a nuestro equipo',
      formSubheading: 'Cuéntanos quién eres y déjanos tu currículum. El proceso toma menos de dos minutos.',
      sectionPersonal: 'Datos Personales',
      sectionContacto: 'Contacto',
      sectionDocumentos: 'Documentos',
      placeholderNombre: 'Escribe aquí tu nombre',
      placeholderApellidoPaterno: 'Apellido paterno',
      placeholderApellidoMaterno: 'Apellido materno',
      placeholderRut: '12.345.678-9',
      placeholderCorreo: 'tucorreo@ejemplo.cl',
      placeholderTelefono: '9 1234 5678',
      placeholderObservaciones: 'Comentarios adicionales sobre tu experiencia o disponibilidad',
      cvButton: 'Seleccionar archivo',
      cvNone: 'Sin archivos seleccionados · PDF, DOC, DOCX — máx. 25 MB',
      submitBtn: 'Enviar postulación',
      sending: 'Enviando...',
      successTitle: 'Postulación enviada',
      successDesc: 'Hemos recibido tu información. Te contactaremos a la brevedad.',
      successMsg: '¡Tu postulación fue enviada correctamente! Nos pondremos en contacto contigo pronto.',
      sendAnother: 'Enviar otra postulación',
      invalidEmailTitle: 'Correo inválido',
      invalidEmailDesc: 'Por favor, ingresa un correo electrónico válido.',
      invalidFileTitle: 'Archivo inválido',
      invalidFileDesc: 'Adjunta un archivo PDF, DOC o DOCX válido.',
      fileTooLargeDesc: 'El currículum no puede superar los 25 MB.',
      errorTitle: 'No se pudo enviar la postulación',
      errorDesc: 'Ocurrió un problema al enviar tu información. Inténtalo nuevamente.',
    },
    en: {
      title: 'WORK WITH US',
      subtitle: 'Insecap Training',
      breadcrumb: 'WORK WITH US',
      brand: 'Insecap Training',
      paragraph1: 'We are constantly looking for talented professionals who are passionate about teaching and training. If you are an instructor with experience and a real commitment to sharing your knowledge, we invite you to join our dynamic facilitator team.',
      paragraph2: 'To begin the process, please complete our contact form. There you can provide information about your experience, areas of expertise and how you believe you can contribute to our team.',
      formTitle: 'Work With Us Form',
      labelNombre: 'First Name',
      labelApellidoPaterno: 'First Last Name',
      labelProfesion: 'Profession',
      labelDisponibilidad: 'Availability',
      labelIdioma: 'Languages',
      labelCategoria: 'Category',
      labelCiudad: 'City',
      labelApellidoMaterno: 'Second Last Name',
      labelRut: 'ID Number',
      labelCorreo: 'Email Address',
      labelTelefono: 'Phone',
      labelObservaciones: 'Notes',
      labelCv: 'Curriculum Vitae',
      formTag: 'WORK WITH US',
      formHeading: 'Join our team',
      formSubheading: 'Tell us who you are and share your CV. The process takes less than two minutes.',
      sectionPersonal: 'Personal Data',
      sectionContacto: 'Contact',
      sectionDocumentos: 'Documents',
      placeholderNombre: 'Enter your first name',
      placeholderApellidoPaterno: 'First last name',
      placeholderApellidoMaterno: 'Second last name',
      placeholderRut: '12.345.678-9',
      placeholderCorreo: 'youremail@example.com',
      placeholderTelefono: '9 1234 5678',
      placeholderObservaciones: 'Additional comments about your experience or availability',
      cvButton: 'Choose file',
      cvNone: 'No file selected · PDF, DOC, DOCX — max. 25 MB',
      submitBtn: 'Submit application',
      sending: 'Sending...',
      successTitle: 'Application sent',
      successDesc: 'We have received your information. We will contact you shortly.',
      successMsg: 'Your application was submitted successfully! We will be in touch soon.',
      sendAnother: 'Submit another application',
      invalidEmailTitle: 'Invalid email',
      invalidEmailDesc: 'Please enter a valid email address.',
      invalidFileTitle: 'Invalid file',
      invalidFileDesc: 'Attach a valid PDF, DOC or DOCX file.',
      fileTooLargeDesc: 'The resume file cannot exceed 25 MB.',
      errorTitle: 'Could not submit application',
      errorDesc: 'There was a problem sending your information. Please try again.',
    },
    pt: {
      title: 'TRABALHE CONOSCO',
      subtitle: 'Insecap Capacitacao',
      breadcrumb: 'TRABALHE CONOSCO',
      brand: 'Insecap Capacitacao',
      paragraph1: 'Estamos em busca constante de talentos apaixonados por ensino e capacitacao. Se voce e um instrutor com experiencia e compromisso em compartilhar conhecimento, convidamos voce a fazer parte da nossa equipe dinamica de facilitadores.',
      paragraph2: 'Para iniciar o processo, pedimos que preencha nosso formulario de contato. Nele voce podera fornecer informacoes sobre sua experiencia, areas de especializacao e como acredita que pode contribuir para a nossa equipe.',
      formTitle: 'Formulario Trabalhe Conosco',
      labelNombre: 'Nome',
      labelApellidoPaterno: 'Sobrenome',
      labelApellidoMaterno: 'Segundo Sobrenome',
      labelRut: 'CPF/RUT',
      labelCorreo: 'E-mail',
      labelTelefono: 'Telefone',
      labelObservaciones: 'Observações',
      labelCv: 'Curriculo',
      labelProfesion: 'Profissão',
      labelDisponibilidad: 'Disponibilidade',
      labelIdioma: 'Idiomas',
      labelCategoria: 'Categoria',
      labelCiudad: 'Cidade',
      formTag: 'TRABALHE CONOSCO',
      formHeading: 'Candidate-se à nossa equipe',
      formSubheading: 'Conte-nos quem você é e envie seu currículo. O processo leva menos de dois minutos.',
      sectionPersonal: 'Dados Pessoais',
      sectionContacto: 'Contato',
      sectionDocumentos: 'Documentos',
      placeholderNombre: 'Digite seu nome',
      placeholderApellidoPaterno: 'Sobrenome',
      placeholderApellidoMaterno: 'Segundo sobrenome',
      placeholderRut: 'CPF/RUT',
      placeholderCorreo: 'seuemail@exemplo.com',
      placeholderTelefono: '11 9 1234-5678',
      placeholderObservaciones: 'Comentários adicionais sobre sua experiência ou disponibilidade',
      cvButton: 'Escolher arquivo',
      cvNone: 'Nenhum arquivo selecionado · PDF, DOC, DOCX — máx. 25 MB',
      submitBtn: 'Enviar candidatura',
      sending: 'Enviando...',
      successTitle: 'Candidatura enviada',
      successDesc: 'Recebemos suas informacoes. Entraremos em contato em breve.',
      successMsg: 'Sua candidatura foi enviada com sucesso! Entraremos em contato em breve.',
      sendAnother: 'Enviar outra candidatura',
      invalidEmailTitle: 'E-mail inválido',
      invalidEmailDesc: 'Por favor, insira um endereço de e-mail válido.',
      invalidFileTitle: 'Arquivo inválido',
      invalidFileDesc: 'Anexe um arquivo PDF, DOC ou DOCX válido.',
      fileTooLargeDesc: 'O currículo não pode exceder 25 MB.',
      errorTitle: 'Não foi possível enviar a candidatura',
      errorDesc: 'Ocorreu um problema ao enviar suas informações. Tente novamente.',
    },
  }[locale];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: content.breadcrumb }]}
        />

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-14 lg:px-16">
            <div className="max-w-2xl mx-auto">

              {/* Cabecera del formulario */}
              <div className="mb-8">
                <p className="text-xs font-semibold tracking-widest text-cyan-500 uppercase mb-2">
                  {content.formTag}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  {content.formHeading}
                </h2>
                <p className="text-slate-500 text-base leading-relaxed">
                  {content.formSubheading}
                </p>
                <div className="mt-6 border-t border-slate-200" />
              </div>

              {submitted ? (
                /* Estado de éxito */
                <div className="flex flex-col items-center text-center gap-5 py-16">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <p className="text-slate-700 text-lg font-medium max-w-sm">{content.successMsg}</p>
                  <Button
                    variant="outline"
                    className="mt-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-xl"
                    onClick={() => {
                      setSubmitted(false);
                        setFormData({ 
                          nombre: '', apellidoPaterno: '', apellidoMaterno: '', rut: '', 
                          correo: '', telefonoPrefix: '+56', telefono: '9',
                          observaciones: '',
                          profesionId: '', disponibilidadId: '', 
                          categoriaId: '', ciudadId: '' 
                        });
                      const espanol = idiomas.find(i => i.nombre?.trim().toLowerCase() === 'español' || i.nombre?.trim().toLowerCase() === 'espanol');
                      setSelectedIdiomaIds(espanol ? [String(espanol.id)] : []);
                      setCvFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    {content.sendAnother}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* ── 01 DATOS PERSONALES ── */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">01</span>
                      <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">{content.sectionPersonal}</span>
                    </div>

                    {/* Nombre */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
                        {content.labelNombre}
                      </label>
                      <Input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder={content.placeholderNombre}
                        required
                        className="rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11"
                      />
                    </div>

                    {/* Apellidos */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
                          {content.labelApellidoPaterno}
                        </label>
                        <Input
                          name="apellidoPaterno"
                          value={formData.apellidoPaterno}
                          onChange={handleChange}
                          placeholder={content.placeholderApellidoPaterno}
                          required
                          className="rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
                          {content.labelApellidoMaterno}
                        </label>
                        <Input
                          name="apellidoMaterno"
                          value={formData.apellidoMaterno}
                          onChange={handleChange}
                          placeholder={content.placeholderApellidoMaterno}
                          required
                          className="rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11"
                        />
                      </div>
                    </div>

                    {/* RUT */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
                        {content.labelRut}
                      </label>
                      <Input
                        name="rut"
                        value={formData.rut}
                        onChange={handleChange}
                        placeholder={content.placeholderRut}
                        required
                        className="rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11"
                      />
                    </div>
                    {/* Selectores dinamicos */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <SearchableSelect
                        label={content.labelProfesion}
                        options={profesiones}
                        value={formData.profesionId}
                        onChange={(val) => setFormData(prev => ({ ...prev, profesionId: val }))}
                      />
                      
                      <SearchableSelect
                        label={content.labelDisponibilidad}
                        options={disponibilidades}
                        value={formData.disponibilidadId}
                        onChange={(val) => setFormData(prev => ({ ...prev, disponibilidadId: val }))}
                      />

                      <MultiSearchableSelect
                        label={content.labelIdioma}
                        options={idiomas}
                        values={selectedIdiomaIds}
                        onChange={setSelectedIdiomaIds}
                      />

                      <SearchableSelect
                        label={content.labelCategoria}
                        options={categorias}
                        value={formData.categoriaId}
                        onChange={(val) => setFormData(prev => ({ ...prev, categoriaId: val }))}
                      />

                      <div className="col-span-1 sm:col-span-2">
                        <SearchableSelect
                          label={content.labelCiudad}
                          options={ciudades}
                          value={formData.ciudadId}
                          onChange={(val) => setFormData(prev => ({ ...prev, ciudadId: val }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── 02 CONTACTO ── */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">02</span>
                      <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">{content.sectionContacto}</span>
                    </div>

                    {/* Correo */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
                        {content.labelCorreo}
                      </label>
                      <Input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        placeholder={content.placeholderCorreo}
                        required
                        className="rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
                        {content.labelTelefono}
                      </label>
                      <div className="flex gap-2">
                        <select
                          name="telefonoPrefix"
                          value={formData.telefonoPrefix}
                          onChange={(e) => setFormData(prev => ({ ...prev, telefonoPrefix: e.target.value }))}
                          className="shrink-0 w-28 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11"
                        >
                          <option value="+56">CL (+56)</option>
                          <option value="+54">AR (+54)</option>
                          <option value="+55">BR (+55)</option>
                          <option value="+57">CO (+57)</option>
                          <option value="+52">MX (+52)</option>
                          <option value="+51">PE (+51)</option>
                        </select>
                        <Input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder={content.placeholderTelefono}
                          required
                          className="w-full flex-1 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 focus-visible:border-blue-400 h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
                        {content.labelObservaciones}
                      </label>
                      <Textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                        placeholder={content.placeholderObservaciones}
                        rows={4}
                        className="min-h-28 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 focus-visible:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* ── 03 DOCUMENTOS ── */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">03</span>
                      <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">{content.sectionDocumentos}</span>
                    </div>

                    {/* CV */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
                        {content.labelCv}
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-dashed border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/40 transition-colors text-left"
                      >
                        <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100">
                          <Upload className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{content.cvButton}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {cvFile ? cvFile.name : content.cvNone}
                          </p>
                        </div>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  {/* Botón enviar */}
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
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BeRelator;
