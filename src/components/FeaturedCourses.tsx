import { Clock, Users, Monitor, MapPin, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Course {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  duration: string;
  students: number;
  modality: 'Online' | 'Presencial' | 'Híbrido';
  sence: boolean;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Operación Segura de Grúa Horquilla',
    category: 'Minería',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop',
    price: 150000,
    originalPrice: 180000,
    duration: '16 horas',
    students: 234,
    modality: 'Presencial',
    sence: true,
  },
  {
    id: '2',
    title: 'Excel Avanzado para Empresas',
    category: 'Informática',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    price: 89000,
    duration: '24 horas',
    students: 512,
    modality: 'Online',
    sence: true,
  },
  {
    id: '3',
    title: 'Primeros Auxilios y RCP',
    category: 'Salud',
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&h=250&fit=crop',
    price: 75000,
    duration: '8 horas',
    students: 876,
    modality: 'Presencial',
    sence: true,
  },
  {
    id: '4',
    title: 'Trabajo en Altura Física',
    category: 'Seguridad',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop',
    price: 120000,
    duration: '16 horas',
    students: 345,
    modality: 'Presencial',
    sence: true,
  },
  {
    id: '5',
    title: 'Administración de Proyectos',
    category: 'Administración',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    price: 180000,
    originalPrice: 220000,
    duration: '40 horas',
    students: 198,
    modality: 'Híbrido',
    sence: true,
  },
  {
    id: '6',
    title: 'Conducción Defensiva',
    category: 'Transporte',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=250&fit=crop',
    price: 95000,
    duration: '12 horas',
    students: 432,
    modality: 'Presencial',
    sence: true,
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price);
};

const CourseCard = ({ course }: { course: Course }) => {
  const modalityColors = {
    Online: 'bg-insecap-cyan text-secondary-foreground',
    Presencial: 'bg-insecap-blue text-primary-foreground',
    Híbrido: 'bg-insecap-cyan text-accent-foreground',
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={modalityColors[course.modality]}>
            {course.modality === 'Online' && <Monitor className="w-3 h-3 mr-1" />}
            {course.modality === 'Presencial' && <MapPin className="w-3 h-3 mr-1" />}
            {course.modality}
          </Badge>
          {course.sence && (
            <Badge className="bg-green-500 text-white">SENCE</Badge>
          )}
        </div>
        {course.originalPrice && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
            -{Math.round((1 - course.price / course.originalPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="text-secondary text-xs font-medium uppercase tracking-wider">
          {course.category}
        </span>
        <h3 className="font-semibold text-foreground mt-1 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.students}
          </span>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            {course.originalPrice && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                {formatPrice(course.originalPrice)}
              </span>
            )}
            <span className="text-xl font-bold text-primary">
              {formatPrice(course.price)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hover:bg-muted">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" className="bg-insecap-blue hover:bg-insecap-blue/90 text-white shadow-cta">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Añadir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedCourses = () => {
  return (
    <section id="cursos" className="py-16 lg:py-24 bg-muted">
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Catálogo de Cursos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Cursos Destacados
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Los cursos más solicitados por nuestros alumnos, todos certificados SENCE.
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Ver todos los cursos
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
