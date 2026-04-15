import { Navigate } from 'react-router-dom';
import B2bCourseDetail from '@/components/B2bCourseDetail';
import { isB2bCatalogEnabled } from '@/lib/featureFlags';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const B2bCourseDetailPage = () => {
  const { localizedPath } = useLocalizedPath();

  if (!isB2bCatalogEnabled) {
    return <Navigate to={localizedPath('/cursos')} replace />;
  }

  return <B2bCourseDetail />;
};

export default B2bCourseDetailPage;
