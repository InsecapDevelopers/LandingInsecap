import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

const ContactCTA = () => {
  return (
    <section id="contacto" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-muted">
        <div className="absolute inset-0 opacity-5">
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Contacto
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Solicite su capacitación
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              ¿Alguna duda o consulta? ¿Desea una cotización? Le invitamos a
              llenar este formulario para que uno de nuestros líderes comerciales
              se contacte con usted lo más pronto posible.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href="mailto:contacto@insecap.cl" className="font-semibold text-foreground hover:text-secondary transition-colors">contacto@insecap.cl</a>
                </div>
              </div>

              {/* Sucursal Calama */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sucursal Calama</p>
                  <p className="text-sm text-muted-foreground">La Cascada 1513</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3.5 h-3.5 text-secondary" />
                    <a href="tel:+5552926431" className="text-sm text-muted-foreground hover:text-secondary transition-colors">+55 2 926431</a>
                  </div>
                </div>
              </div>

              {/* Sucursal Antofagasta */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sucursal Antofagasta</p>
                  <p className="text-sm text-muted-foreground">Copiapó 956</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3.5 h-3.5 text-secondary" />
                    <a href="tel:+5552948575" className="text-sm text-muted-foreground hover:text-secondary transition-colors">+55 2 948575</a>
                  </div>
                </div>
              </div>

              {/* Sucursal Santiago */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sucursal Santiago</p>
                  <p className="text-sm text-muted-foreground">Valenzuela Castillo 1063, Santiago</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3.5 h-3.5 text-secondary" />
                    <a href="tel:+56988198254" className="text-sm text-muted-foreground hover:text-secondary transition-colors">+56 9 8819 8254</a>
                  </div>
                </div>
              </div>

              {/* Sucursal Vallenar */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sucursal Vallenar</p>
                  <p className="text-sm text-muted-foreground">Río del Tránsito 1546</p>
                  <p className="text-sm text-muted-foreground">Villa Vista Alegre</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3.5 h-3.5 text-secondary" />
                    <a href="tel:+56935968585" className="text-sm text-muted-foreground hover:text-secondary transition-colors">+56 9 3596 8585</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full bg-white/5 py-12 border-b border-primary-foreground/10">
            <div className="container mx-auto px-4 text-center">
              <h4 className="font-bold text-2xl mb-8 text-secondary">Mantente en Contacto</h4>
              <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white">
                <iframe
                  src="https://tms.insecap.cl/Contacto/Contactar"
                  className="w-full h-[600px] border-none"
                  title="Contacto Insecap"
                  scrolling="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
