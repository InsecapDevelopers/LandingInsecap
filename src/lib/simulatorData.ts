export interface SimulatorSpec {
  label: string;
  value: string;
}

export interface Simulator {
  id: string;
  name: string;
  handle: string;
  category: string;
  specs: SimulatorSpec[];
  image?: string;
}

export const SIMULATORS: Simulator[] = [
  // ── Camiones Minería ──────────────────────────────────────────────
  {
    id: 'cm-1',
    name: 'CAT 798AC',
    handle: 'cat-798ac',
    category: 'camiones-mineria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/cat-798ac-cd7cc15e.webp',
    specs: [
      { label: 'Potencia', value: '2610 KW' },
      { label: 'Peso Operativo', value: '623 T' },
      { label: 'Carga Útil', value: '372 T' },
    ],
  },
  {
    id: 'cm-2',
    name: 'KOMATSU 980E',
    handle: 'komatsu-980e',
    category: 'camiones-mineria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/komatsu-980e-af12ec14.webp',
    specs: [
      { label: 'Potencia', value: '2610 KW' },
      { label: 'Peso Operativo', value: '626 T' },
      { label: 'Carga Útil', value: '363 T' },
    ],
  },
  {
    id: 'cm-3',
    name: 'EH 3500',
    handle: 'eh-3500',
    category: 'camiones-mineria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/eh3500-9e9853a6.webp',
    specs: [
      { label: 'Potencia', value: '1491 KW' },
      { label: 'Peso Operativo', value: '322 T' },
      { label: 'Carga Útil', value: '181 T' },
    ],
  },
  {
    id: 'cm-4',
    name: 'EH 4000',
    handle: 'eh-4000',
    category: 'camiones-mineria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/eh4000-0972ffcf.webp',
    specs: [
      { label: 'Potencia', value: '1354 KW' },
      { label: 'Peso Operativo', value: '384 T' },
      { label: 'Carga Útil', value: '221 T' },
    ],
  },
  {
    id: 'cm-5',
    name: 'EH 5000',
    handle: 'eh-5000',
    category: 'camiones-mineria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/eh5000-30344440.webp',
    specs: [
      { label: 'Potencia', value: '2125 KW' },
      { label: 'Peso Operativo', value: '920 T' },
      { label: 'Carga Útil', value: '248 T' },
    ],
  },
  {
    id: 'cm-6',
    name: 'EX 1200',
    handle: 'ex-1200',
    category: 'camiones-mineria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/ex1200-494b5900.webp',
    specs: [
      { label: 'Potencia', value: '567 KW' },
      { label: 'Peso Operativo', value: '11.7 T' },
      { label: 'C. Útil Garzo', value: '6.7 M³' },
    ],
  },
  {
    id: 'cm-7',
    name: 'EX 1900',
    handle: 'ex-1900',
    category: 'camiones-mineria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/ex1900-2a605ab7.webp',
    specs: [
      { label: 'Potencia', value: '910 KW' },
      { label: 'Peso Operativo', value: '192 T' },
      { label: 'C. Útil Garzo', value: '12 M³' },
    ],
  },
  {
    id: 'cm-8',
    name: 'EH 2600',
    handle: 'eh-2600',
    category: 'camiones-mineria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/ex2600-54880b93.webp',
    specs: [
      { label: 'Potencia', value: '1115 KW' },
      { label: 'Peso Operativo', value: '354 T' },
      { label: 'C. Útil Garzo', value: '17 M³' },
    ],
  },
  {
    id: 'cm-10',
    name: 'EX 5500',
    handle: 'ex-5500',
    category: 'camiones-mineria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/ex5500-873bb4bc.webp',
    specs: [
      { label: 'Potencia', value: '2088 KW' },
      { label: 'Peso Operativo', value: '622 T' },
      { label: 'C. Útil Garzo', value: '29 M³' },
    ],
  },
  // ── Maquinaria ────────────────────────────────────────────────────
  {
    id: 'mq-1',
    name: 'Cargador Frontal',
    handle: 'cargador-frontal-maq',
    category: 'maquinaria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/cargadorfrontal-afaa1c33.webp',
    specs: [
      { label: 'Potencia', value: '672 KW / 901 HP' },
    ],
  },
  {
    id: 'mq-2',
    name: 'Retrocargadora',
    handle: 'retrocargadora',
    category: 'maquinaria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/retrocargadora-b3750907.webp',
    specs: [
      { label: 'Potencia', value: '55 KW' },
      { label: 'Norma', value: 'ISO 14396 (SAE J1)' },
    ],
  },
  {
    id: 'mq-3',
    name: 'Excavadora Cadenas',
    handle: 'excavadora-cadenas',
    category: 'maquinaria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/excavadora-cadenas-06837197.webp',
    specs: [
      { label: 'Tipo', value: 'Cadenas' },
    ],
  },
  {
    id: 'mq-4',
    name: 'Bulldozer',
    handle: 'bulldozer',
    category: 'maquinaria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/bulldozer-90051f63.webp',
    specs: [
      { label: 'Potencia', value: '55.4 KW' },
    ],
  },
  {
    id: 'mq-5',
    name: 'Motoniveladora',
    handle: 'motoniveladora',
    category: 'maquinaria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/motoniveladora-affa5b15.webp',
    specs: [
      { label: 'Potencia', value: '104 KW' },
    ],
  },
  {
    id: 'mq-6',
    name: 'Minicargador',
    handle: 'minicargador',
    category: 'maquinaria',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/minicargador-310010fe.webp',
    specs: [
      { label: 'Potencia', value: '55.4 KW' },
    ],
  },
  // ── Monta Carga ───────────────────────────────────────────────────
  {
    id: 'mc-1',
    name: 'Cargador Frontal',
    handle: 'montacarga-frontal',
    category: 'monta-carga',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/montacargas-frontal-f44f7097.webp',
    specs: [
      { label: 'Tipo', value: 'Frontal' },
    ],
  },
  {
    id: 'mc-2',
    name: 'Cargador Frontal Doble',
    handle: 'montacarga-frontal-doble',
    category: 'monta-carga',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/cargador-frontaldoble-79df4f26.webp',
    specs: [
      { label: 'Tipo', value: 'Frontal Doble' },
    ],
  },
  {
    id: 'mc-3',
    name: 'Cargador Lateral',
    handle: 'montacarga-lateral',
    category: 'monta-carga',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/cargadorlateral-b40b5099.webp',
    specs: [
      { label: 'Tipo', value: 'Retráctil Lateral' },
    ],
  },
  // ── Manejo 4x4 ────────────────────────────────────────────────────
  {
    id: '4x4-1',
    name: 'PICKUP 4X4',
    handle: 'pickup-4x4',
    category: 'manejo-4x4',
    image: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/hilux4x4-d97582ad.webp',
    specs: [
      { label: 'Cilindrada', value: '1968 CC' },
      { label: 'Modelos', value: 'Toyota Hilux / VW Amarok' },
    ],
  },
];

export const SIMULATOR_CATEGORIES = {
  es: {
    'camiones-mineria': 'Camiones Minería',
    'maquinaria': 'Maquinaria',
    'monta-carga': 'Monta Carga',
    'manejo-4x4': 'Manejo 4x4',
  },
  en: {
    'camiones-mineria': 'Mining Trucks',
    'maquinaria': 'Machinery',
    'monta-carga': 'Forklifts',
    'manejo-4x4': '4x4 Driving',
  },
  pt: {
    'camiones-mineria': 'Caminhões de mineração',
    'maquinaria': 'Máquinas pesadas',
    'monta-carga': 'Empilhadeiras',
    'manejo-4x4': 'Condução 4x4',
  },
};
