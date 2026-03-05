import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Mail, Phone, MapPin, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo a la brevedad.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <PageHero 
          title="Contáctanos"
          subtitle="Estamos a tu servicio"
          breadcrumbs={[{ label: "Contacto" }]}
        />

        {/* Sedes Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-2 block">Nuestras Sedes</span>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-950">Nos encontramos en las siguientes regiones</h2>
            </div>

            <div className="max-w-6xl mx-auto mb-20">
              <img 
                src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/nosotros_cedes.svg?v=1769433643" 
                alt="Mapa de sedes Insecap" 
                className="w-full h-auto"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Sucursal Calama */}
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                  <MapPin className="w-8 h-8 text-white -rotate-3" />
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-4">Sucursal Calama</h3>
                <div className="space-y-2 text-gray-600">
                  <p>La cascada 1513</p>
                  <p className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    +56 9 7887 6152
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    +55 2 926431
                  </p>
                </div>
              </div>

              {/* Sucursal Antofagasta */}
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                  <MapPin className="w-8 h-8 text-white -rotate-3" />
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-4">Sucursal Antofagasta</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Copiapó 956</p>
                  <p className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    +55 2 948575
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    +56 9 6125 2832
                  </p>
                </div>
              </div>

              {/* Escríbenos */}
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                  <Mail className="w-8 h-8 text-white -rotate-3" />
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-4">Escríbenos</h3>
                <p className="text-gray-600 mb-2">Si tienes alguna consulta no dudes en escribirnos:</p>
                <a href="mailto:contacto@insecap.cl" className="text-blue-600 font-semibold hover:underline">
                  contacto@insecap.cl
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
