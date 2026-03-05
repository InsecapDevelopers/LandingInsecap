import React, { useRef } from 'react';
import { useInView } from 'motion/react';
import { NumberTicker } from "./ui/number-ticker";
import { Particles } from "./ui/particles";
import { Users, GraduationCap, Clock3, List } from "lucide-react";

const stats = [
  {
    label: "Usuarios Capacitados en 2025",
    value: 47700,
    icon: <Users className="w-8 h-8 text-white/90" />,
    suffix: "+"
  },
  {
    label: "Facilitadores Expertos",
    value: 341,
    icon: <GraduationCap className="w-8 h-8 text-white/90" />,
    suffix: "+"
  },
  {
    label: "Horas de Capacitación",
    value: 895863,
    icon: <Clock3 className="w-8 h-8 text-white/90" />,
    suffix: "+"
  },
  {
    label: "Cantidad de Cursos Diseñados",
    value: 1582,
    icon: <List className="w-8 h-8 text-white/90" />,
    suffix: "+"
  }
];

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-80px" });

  return (
    <section ref={sectionRef} className="relative py-16 overflow-hidden bg-gradient-to-r from-[#2952cc] via-insecap-blue to-sky-400">
      <Particles className="absolute inset-0" quantity={120} color="#ffffff" staticity={30} ease={60} />
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-white/25">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center py-8 px-6"
            >
              <div className="mb-4">
                {stat.icon}
              </div>
              <div className="flex items-baseline text-4xl md:text-5xl font-extrabold text-white mb-2 tabular-nums">
                <NumberTicker
                  value={stat.value}
                  className="text-white"
                  duration={2.2}
                  trigger={isInView}
                />
                <span className="ml-0.5">{stat.suffix}</span>
              </div>
              <p className="text-white/80 font-semibold text-center text-sm max-w-[160px] leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;