import React from 'react';
import { MapPin, Building2, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { Region, sedesFisicas } from './data';

interface SedePanelProps {
  activeRegion: string | null;
}

/** Info fija de las sedes físicas */
const sedeDetails: Record<
  string,
  { telefono: string; email: string; horario: string; googleMaps?: string }
> = {
  antofagasta: {
    telefono: '+56 55 231 6200',
    email: 'contacto@insecap.cl',
    horario: 'Lunes a Viernes, 08:30 - 18:00',
    googleMaps: 'https://maps.google.com/?q=La+Cascada+1513+Calama',
  },
  metropolitana: {
    telefono: '+56 2 2123 4567',
    email: 'santiago@insecap.cl',
    horario: 'Lunes a Viernes, 09:00 - 18:00',
    googleMaps: 'https://maps.google.com/?q=Valenzuela+Castillo+1063+Santiago',
  },
};

const SedePanel: React.FC<SedePanelProps> = ({ activeRegion }) => {
  const region = sedesFisicas.find((r) => r.id === activeRegion);
  const details = activeRegion ? sedeDetails[activeRegion] : null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-blue-950 text-sm">Sedes Físicas</h3>
          <p className="text-xs text-gray-500">Presencial</p>
        </div>
      </div>

      {/* Sede cards */}
      {!region ? (
        <div className="space-y-3">
          {/* Default: show all physical sedes as cards */}
          {sedesFisicas.map((r) => (
            <div key={r.id} className="space-y-2">
              {r.sedes
                .filter((s) => s.tipo === 'fisica')
                .map((sede, i) => (
                  <div
                    key={i}
                    className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-xl p-4 
                               hover:shadow-md hover:border-blue-100 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center shrink-0
                                      group-hover:from-cyan-100 group-hover:to-blue-100 transition-colors duration-300">
                        <MapPin className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-blue-950">{sede.nombre}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{sede.direccion}</p>
                        <p className="text-xs text-gray-400">{sede.ciudad}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      ) : (
        /* Active region selected: show detail */
        <div className="space-y-3 animate-in slide-in-from-right-5 duration-300">
          {region.sedes
            .filter((s) => s.tipo === 'fisica')
            .map((sede, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-950">{sede.nombre}</p>
                    <p className="text-sm text-blue-700">{sede.ciudad}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{sede.direccion}, {sede.ciudad}</span>
                  </div>

                  {details?.telefono && (
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{details.telefono}</span>
                    </div>
                  )}

                  {details?.email && (
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{details.email}</span>
                    </div>
                  )}

                  {details?.horario && (
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{details.horario}</span>
                    </div>
                  )}
                </div>

                {/* Google Maps link */}
                {details?.googleMaps && (
                  <a
                    href={details.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm 
                               font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Cómo llegar
                  </a>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SedePanel;
