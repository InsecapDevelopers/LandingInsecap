import React from 'react';
import { NumberTicker } from "./ui/number-ticker";
import { Users, GraduationCap, Clock3, List } from "lucide-react";

const stats = [
  {
    label: "Usuarios Capacitados en 2025",
    value:'47700',
    icon: <Users className="w-10 h-10 text-white" />,
    suffix: "+"
  },
  {
    label: "Facilitadores Expertos",
    value: 341,
    icon: <GraduationCap className="w-10 h-10 text-white" />,
    suffix: "+"
  },
  {
    label: "Horas de Capacitación",
    value: 895863,
    icon: <Clock3 className="w-10 h-10 text-white" />,
    suffix: "+"
  },
  {
    label: "Cantidad de Cursos Diseñados",
    value: 1582,
    icon: <List className="w-10 h-10 text-white" />,
    suffix: "+"
  }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-t from-sky-400 via-blue-600 to-blue-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center p-4 bg-transparent transition-transform duration-300"
            >
              {/* Ícono sin fondo circular, ahora es más grande y blanco */}
              <div className="mb-6 opacity-90">
                {stat.icon}
              </div>

              {/* Número con efecto Ticker en blanco */}
              <div className="flex items-center text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">
                <NumberTicker 
                  value={stat.value} 
                  className="text-white" 
                />
                <span className="ml-1 opacity-90">{stat.suffix}</span>
              </div>

              {/* Etiqueta descriptiva en blanco con mayor legibilidad */}
              <p className="text-white/80 font-bold text-center uppercase tracking-widest text-xs max-w-[180px]">
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