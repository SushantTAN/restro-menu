import { useRoutes } from 'react-router-dom';
import { routesConfig } from './routesConfig';

const AppRoutes = () => {
  const routes = useRoutes(routesConfig);
  return routes;
};

export default AppRoutes;
