import { Navigate } from 'react-router-dom';
import B2bCourseCatalog from '@/components/B2bCourseCatalog';
import { isB2bCatalogEnabled } from '@/lib/featureFlags';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const B2bCourseCatalogPage = () => {
  const { localizedPath } = useLocalizedPath();

  if (!isB2bCatalogEnabled) {
    return <Navigate to={localizedPath('/cursos')} replace />;
  }

  return <B2bCourseCatalog />;
};

export default B2bCourseCatalogPage;
