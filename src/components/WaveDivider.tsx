/**
 * Separador de ondas entre secciones.
 * Mismas curvas y colores que el empalme del VideoHero, para que la transición
 * entre bloques se lea igual en toda la home.
 */
const WaveDivider = ({ className = '' }: { className?: string }) => (
  <div className={`w-full pointer-events-none ${className}`}>
    <svg
      className="block w-full h-[90px] sm:h-[130px]"
      viewBox="0 0 1440 150"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0,80 C240,30 480,110 720,70 C960,30 1200,100 1440,55 L1440,150 L0,150 Z"
        fill="#38BDF8"
        opacity="0.75"
      />
      <path
        d="M0,105 C300,55 600,125 900,85 C1120,58 1320,105 1440,80 L1440,150 L0,150 Z"
        fill="#818cf8"
        opacity="0.6"
      />
      {/* Cierra contra el fondo de la sección siguiente, no contra blanco */}
      <path
        d="M0,125 C320,85 720,140 1080,105 C1260,88 1380,115 1440,100 L1440,150 L0,150 Z"
        fill="#f0f9ff"
      />
    </svg>
  </div>
);

export default WaveDivider;
