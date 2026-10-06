import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { ACREDITACIONES, CIFRAS, MODALIDADES, formatCifra } from '@/data/respuestas';
import { sedes } from '@/data/sedes';

const TEXTOS = {
  es: {
    title: 'INSECAP en datos',
    acreditaciones: 'Acreditaciones y membresías',
    acreditacion: 'Acreditación',
    detalle: 'Detalle',
    modalidades: 'Modalidades de capacitación',
    sedes: 'Sedes',
    sede: 'Sede',
    direccion: 'Dirección',
    telefono: 'Teléfono',
    cifras: `Cifras al ${CIFRAS.anio}`,
    personas: 'personas capacitadas',
    facilitadores: 'facilitadores y facilitadoras',
    horas: 'horas de capacitación',
    cursos: 'cursos diseñados',
  },
  en: {
    title: 'INSECAP in figures',
    acreditaciones: 'Accreditations and memberships',
    acreditacion: 'Accreditation',
    detalle: 'Details',
    modalidades: 'Training formats',
    sedes: 'Offices',
    sede: 'Office',
    direccion: 'Address',
    telefono: 'Phone',
    cifras: `Figures as of ${CIFRAS.anio}`,
    personas: 'people trained',
    facilitadores: 'facilitators',
    horas: 'training hours',
    cursos: 'courses designed',
  },
  pt: {
    title: 'INSECAP em dados',
    acreditaciones: 'Credenciamentos e associações',
    acreditacion: 'Credenciamento',
    detalle: 'Detalhe',
    modalidades: 'Modalidades de capacitação',
    sedes: 'Unidades',
    sede: 'Unidade',
    direccion: 'Endereço',
    telefono: 'Telefone',
    cifras: `Números até ${CIFRAS.anio}`,
    personas: 'pessoas capacitadas',
    facilitadores: 'facilitadores',
    horas: 'horas de capacitação',
    cursos: 'cursos desenvolvidos',
  },
};

/**
 * Datos comparables de INSECAP en tablas y listas (Fase 8, contenido citable): acreditaciones,
 * modalidades, sedes (NAP único de src/data/sedes.ts) y las cifras 2025 con su fecha visible.
 * Solo datos del contexto de negocio (src/data/respuestas.ts).
 */
const InsecapEnDatos = () => {
  const { locale, localizedPath } = useLocalizedPath();
  const text = TEXTOS[locale];
  const cifras = [
    { value: CIFRAS.personasCapacitadas, label: text.personas },
    { value: CIFRAS.facilitadores, label: text.facilitadores },
    { value: CIFRAS.horas, label: text.horas },
    { value: CIFRAS.cursosDisenados, label: text.cursos },
  ];

  return (
    <section aria-labelledby="insecap-en-datos" className="py-16 bg-white">
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        <h2 id="insecap-en-datos" className="text-3xl md:text-4xl font-bold text-blue-950 mb-10 text-center">{text.title}</h2>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">{text.acreditaciones}</h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold text-foreground">{text.acreditacion}</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-foreground">{text.detalle}</th>
                  </tr>
                </thead>
                <tbody>
                  {ACREDITACIONES[locale].map((item) => (
                    <tr key={item.nombre} className="border-t border-border">
                      <th scope="row" className="px-4 py-3 text-left font-semibold text-foreground">{item.nombre}</th>
                      <td className="px-4 py-3 text-muted-foreground">{item.detalle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">{text.cifras}</h3>
              <dl className="grid grid-cols-2 gap-4">
                {cifras.map((cifra) => (
                  <div key={cifra.label} className="rounded-xl border border-border p-4">
                    <dt className="text-sm text-muted-foreground">{cifra.label}</dt>
                    <dd className="text-2xl font-bold text-insecap-blue tabular-nums">{formatCifra(cifra.value, locale)}+</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">{text.modalidades}</h3>
              <ul className="flex flex-wrap gap-2">
                {MODALIDADES[locale].map((modalidad) => (
                  <li key={modalidad} className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground">{modalidad}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-bold text-foreground mb-4">{text.sedes}</h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold text-foreground">{text.sede}</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-foreground">{text.direccion}</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-foreground">{text.telefono}</th>
                </tr>
              </thead>
              <tbody>
                {sedes.map((sede) => (
                  <tr key={sede.slug} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 text-left font-semibold">
                      <Link to={localizedPath(`/sedes/${sede.slug}`)} className="text-insecap-blue hover:underline">
                        INSECAP {sede.ciudad}
                      </Link>
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{sede.direccion}, {sede.ciudad}, {sede.region}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={`tel:${sede.telefonoE164}`} className="text-foreground hover:underline">{sede.telefono}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsecapEnDatos;
