import React from 'react';
import {
  FileText,
  UserCheck,
  Target,
  CalendarClock,
  ShieldAlert,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/use-scroll-animation';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const sectionIcons = [
  <FileText className="w-7 h-7 text-white" />,
  <UserCheck className="w-7 h-7 text-white" />,
  <Target className="w-7 h-7 text-white" />,
  <CalendarClock className="w-7 h-7 text-white" />,
  <ShieldAlert className="w-7 h-7 text-white" />,
  <Lock className="w-7 h-7 text-white" />,
];

const PrivacyPolicy = () => {
  const { locale } = useLocalizedPath();
  const introSection = useScrollAnimation({ threshold: 0.2 });
  const cardsSection = useStaggerAnimation({ threshold: 0.1 });
  const acceptanceSection = useScrollAnimation({ threshold: 0.2 });

  const content = {
    es: {
      title: 'Condiciones del Servicio',
      subtitle: 'TMS.INSECAP.CL',
      breadcrumb: 'Politica de Privacidad',
      app: 'Aplicacion TMS.INSECAP.CL',
      introTitle: 'Terminos y Condiciones de Uso',
      introText: 'La presente declaracion establece los terminos y condiciones de uso del sistema TMS.INSECAP.CL, propiedad de INSECAP Capacitacion, respecto al tratamiento de datos de trabajadores de empresas externas y la programacion de reuniones informativas con fines de coordinacion y seguimiento de capacitaciones.',
      acceptance: '7. Aceptacion',
      acceptanceText: 'El uso del sistema implica la aceptacion plena de estas condiciones. Cualquier modificacion sera informada por los canales oficiales de INSECAP Capacitacion.',
      sectionData: {
        titles: ['1. Objeto del Servicio', '2. Ingreso de Datos de Participantes Externos', '3. Finalidad del Tratamiento de Datos', '4. Agenda de Reuniones', '5. Responsabilidad del Usuario', '6. Confidencialidad y Seguridad'],
        contentTexts: [
          'El sistema TMS.INSECAP.CL permite a empresas usuarias y colaboradores registrados:',
          'Al ingresar los datos de trabajadores pertenecientes a empresas externas:',
          'Los datos ingresados serán utilizados únicamente para:',
          'El sistema TMS.INSECAP.CL habilita a los usuarios autorizados a:',
          null,
          null,
        ],
        items: [
          ['Registrar información de trabajadores que serán participantes en procesos de capacitación.', 'Agendar reuniones virtuales o presenciales para informar sobre programas, fechas, asistencia y evaluaciones de los cursos impartidos.'],
          ['Se declara que la empresa que utiliza el sistema cuenta con autorización expresa de sus trabajadores para compartir sus datos personales (nombre, RUT, correo electrónico, teléfono, cargo, etc.) con INSECAP Capacitación, exclusivamente para fines de gestión formativa.', 'INSECAP no se hace responsable por el ingreso de información sin consentimiento, siendo esta responsabilidad directa de la empresa usuaria del sistema.', 'Los datos serán tratados conforme a la Ley N° 19.628 sobre Protección de la Vida Privada y otras normas aplicables en Chile.'],
          ['Coordinar el desarrollo de las actividades de capacitación.', 'Realizar seguimiento al avance del participante.', 'Emitir certificados, informes y reportes.', 'Programar reuniones informativas con los participantes o representantes de su empresa.'],
          ['Programar reuniones con anticipación para informar sobre el proceso formativo.', 'Notificar por correo electrónico u otros medios a los participantes y/o encargados de RRHH de su empresa.', 'Realizar seguimiento posterior a las reuniones a través de registros internos del sistema.'],
          ['La empresa que utilice la plataforma será responsable de la veracidad y exactitud de los datos ingresados.', 'Cualquier uso indebido, falsificación de información o falta de consentimiento informado por parte de los participantes será responsabilidad exclusiva del usuario que ejecutó el registro.'],
          ['Toda la información ingresada será almacenada en servidores seguros bajo estándares de cifrado y acceso controlado.', 'INSECAP se compromete a no divulgar, vender ni transferir información personal a terceros, salvo obligación legal.'],
        ],
      },
    },
    en: {
      title: 'Service Terms',
      subtitle: 'TMS.INSECAP.CL',
      breadcrumb: 'Privacy Policy',
      app: 'TMS.INSECAP.CL Application',
      introTitle: 'Terms and Conditions of Use',
      introText: 'This statement establishes the terms and conditions for using the TMS.INSECAP.CL system, owned by INSECAP Training, regarding the processing of external company employee data and the scheduling of informational meetings for training coordination and follow-up.',
      acceptance: '7. Acceptance',
      acceptanceText: 'Using the system implies full acceptance of these conditions. Any modification will be communicated through INSECAP Training official channels.',
      sectionData: {
        titles: ['1. Service Subject', '2. Entry of External Participant Data', '3. Purpose of Data Processing', '4. Meeting Schedule', '5. User Responsibility', '6. Confidentiality and Security'],
        contentTexts: [
          'The TMS.INSECAP.CL system allows registered company users and collaborators to:',
          'When entering data of workers belonging to external companies:',
          'Data entered will be used exclusively to:',
          'The TMS.INSECAP.CL system enables authorized users to:',
          null,
          null,
        ],
        items: [
          ['Register information of workers who will be participants in training processes.', 'Schedule virtual or in-person meetings to inform about programs, dates, attendance and evaluations of the courses delivered.'],
          ['It is declared that the company using the system has express authorization from its workers to share their personal data (name, national ID, email, phone, position, etc.) with INSECAP Training, exclusively for training management purposes.', 'INSECAP is not responsible for entering information without consent; this responsibility lies directly with the company user of the system.', 'Data will be processed in accordance with Law No. 19.628 on Protection of Private Life and other applicable regulations in Chile.'],
          ['Coordinate the development of training activities.', 'Monitor participant progress.', 'Issue certificates, reports and summaries.', 'Schedule informational meetings with participants or representatives of their company.'],
          ['Schedule meetings in advance to inform about the training process.', 'Notify participants and/or HR managers at their company by email or other means.', 'Conduct follow-up after meetings through internal system records.'],
          ['The company using the platform is responsible for the accuracy and completeness of the data entered.', 'Any misuse, falsification of information or lack of informed consent from participants is the sole responsibility of the user who executed the registration.'],
          ['All information entered will be stored on secure servers under encryption and controlled access standards.', 'INSECAP commits to not disclosing, selling or transferring personal information to third parties, except by legal obligation.'],
        ],
      },
    },
    pt: {
      title: 'Condicoes do Servico',
      subtitle: 'TMS.INSECAP.CL',
      breadcrumb: 'Politica de Privacidade',
      app: 'Aplicacao TMS.INSECAP.CL',
      introTitle: 'Termos e Condicoes de Uso',
      introText: 'Esta declaracao estabelece os termos e condicoes de uso do sistema TMS.INSECAP.CL, propriedade da INSECAP Capacitacao, em relacao ao tratamento de dados de trabalhadores de empresas externas e ao agendamento de reunioes informativas para coordenacao e acompanhamento de capacitacoes.',
      acceptance: '7. Aceitacao',
      acceptanceText: 'O uso do sistema implica a aceitacao plena destas condicoes. Qualquer modificacao sera comunicada pelos canais oficiais da INSECAP Capacitacao.',
      sectionData: {
        titles: ['1. Objeto do Serviço', '2. Inserção de Dados de Participantes Externos', '3. Finalidade do Tratamento de Dados', '4. Agenda de Reuniões', '5. Responsabilidade do Usuário', '6. Confidencialidade e Segurança'],
        contentTexts: [
          'O sistema TMS.INSECAP.CL permite a empresas usuárias e colaboradores registrados:',
          'Ao inserir dados de trabalhadores pertencentes a empresas externas:',
          'Os dados inseridos serão utilizados exclusivamente para:',
          'O sistema TMS.INSECAP.CL habilita os usuários autorizados a:',
          null,
          null,
        ],
        items: [
          ['Registrar informações de trabalhadores que serão participantes em processos de capacitação.', 'Agendar reuniões virtuais ou presenciais para informar sobre programas, datas, presença e avaliações dos cursos ministrados.'],
          ['Declara-se que a empresa que utiliza o sistema possui autorização expressa de seus trabalhadores para compartilhar seus dados pessoais (nome, CPF/RUT, e-mail, telefone, cargo, etc.) com a INSECAP Capacitação, exclusivamente para fins de gestão formativa.', 'A INSECAP não se responsabiliza pela inserção de informações sem consentimento, sendo esta responsabilidade direta da empresa usuária do sistema.', 'Os dados serão tratados conforme a Lei N° 19.628 sobre Proteção da Vida Privada e outras normas aplicáveis no Chile.'],
          ['Coordenar o desenvolvimento das atividades de capacitação.', 'Acompanhar o progresso do participante.', 'Emitir certificados, relatórios e registros.', 'Programar reuniões informativas com os participantes ou representantes de sua empresa.'],
          ['Agendar reuniões com antecedência para informar sobre o processo formativo.', 'Notificar por e-mail ou outros meios os participantes e/ou responsáveis de RH de sua empresa.', 'Realizar acompanhamento posterior às reuniões por meio de registros internos do sistema.'],
          ['A empresa que utilizar a plataforma será responsável pela veracidade e exatidão dos dados inseridos.', 'Qualquer uso indevido, falsificação de informações ou falta de consentimento informado por parte dos participantes será responsabilidade exclusiva do usuário que efetuou o registro.'],
          ['Todas as informações inseridas serão armazenadas em servidores seguros sob padrões de criptografia e acesso controlado.', 'A INSECAP compromete-se a não divulgar, vender nem transferir informações pessoais a terceiros, salvo obrigação legal.'],
        ],
      },
    },
  }[locale];

  const makeContent = (text: string | null) => {
    if (!text) return null;
    const parts = text.split('TMS.INSECAP.CL');
    return (
      <p className="text-slate-600 text-base leading-relaxed">
        {parts[0]}{parts.length > 1 && <><strong>TMS.INSECAP.CL</strong>{parts[1]}</>}
      </p>
    );
  };

  const sections = content.sectionData.titles.map((title, i) => ({
    id: i + 1,
    icon: sectionIcons[i],
    title,
    content: makeContent(content.sectionData.contentTexts[i]),
    items: content.sectionData.items[i],
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: content.breadcrumb }]}
        />

        {/* Intro Banner */}
        <section className="py-16 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-[150px] opacity-10 -mr-48 -mt-48" />
          <div className="container mx-auto px-8 md:px-14 lg:px-16 relative z-10">
            <div
              ref={introSection.ref}
              className={`max-w-3xl mx-auto text-center transition-all duration-700 ease-out ${
                introSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-4">{content.app}</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                {content.introTitle}
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                {content.introText}
              </p>
            </div>
          </div>
        </section>

        {/* Sections Grid */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            <div ref={cardsSection.ref} className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {sections.map((sec, index) => (
                <div
                  key={sec.id}
                  className={`bg-white rounded-[1.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 ${
                    cardsSection.isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{
                    transitionDelay: cardsSection.isVisible
                      ? cardsSection.getDelay(index, 100)
                      : '0ms',
                  }}
                >
                  {/* Icon + title */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                      {sec.icon}
                    </div>
                    <h3 className="text-xl font-bold text-blue-950 leading-snug pt-1">
                      {sec.title}
                    </h3>
                  </div>

                  {sec.content && <div className="mb-4">{sec.content}</div>}

                  <ul className="space-y-3">
                    {sec.items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Aceptación CTA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            <div
              ref={acceptanceSection.ref}
              className={`max-w-3xl mx-auto bg-primary rounded-[2rem] p-12 text-white text-center overflow-hidden relative transition-all duration-700 ease-out ${
                acceptanceSection.isVisible
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-10 scale-[0.97]'
              }`}
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[120px] opacity-15 -ml-32 -mb-32" />
              <div className="relative z-10">
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{content.acceptance}</h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {content.acceptanceText}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
