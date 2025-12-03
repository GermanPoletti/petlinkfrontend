import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LandingPage } from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Forgot from '@/pages/Forgot';
import Inicio from '@/pages/Inicio';
import './App.css';
import { NavBar } from '@/components/UI/NavBar';
import Ofertas from '@/pages/Ofertas';
import MyPosts from '@/pages/MyPosts';
import Perfil from '@/pages/Perfil';
import UserConfig from '@/pages/UserConfig';
import CrearOferta from '@/pages/CrearOferta';
import CrearPropuesta from '@/pages/CrearPropuesta';
import Propuestas from '@/pages/Propuestas';
import PropuestaAmpliada from '@/pages/PropuestaAmpliada';
import OfertaAmpliada from '@/pages/OfertaAmpliada';
import MiPublicacionAmpliada from '@/pages/MiPublicacionAmpliada';
import ModificarPublicacion from '@/pages/ModificarPublicacion';
import BackOfficeDashboard from '@/pages/BackOffice/Dashboard';
import BackOfficeUsuarios from '@/pages/BackOffice/Usuarios';
import BackOfficeReportes from '@/pages/BackOffice/Reportes';
import BackOfficeModeradores from '@/pages/BackOffice/Moderadores';
import EditarPerfil from '@/pages/EditarPerfil';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Routes>
          <Route path="/NavBar" element={<NavBar />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/propuestas" element={<Propuestas />} />
          <Route path="/propuesta-ampliada/:id" element={<PropuestaAmpliada />} />
          <Route path="/oferta-ampliada/:id" element={<OfertaAmpliada />} />
          <Route path="/mi-publicacion-ampliada/:id" element={<MiPublicacionAmpliada />} />
          <Route path="/modificar-publicacion" element={<ModificarPublicacion />} />
          <Route path="/mis-publicaciones" element={<MyPosts />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracion" element={<UserConfig />} />
          <Route path="/crear-oferta" element={<CrearOferta />} />
          <Route path="/crear-propuesta" element={<CrearPropuesta />} />
          <Route path="/back-office/dashboard" element={<BackOfficeDashboard />} />
          <Route path="/back-office/usuarios" element={<BackOfficeUsuarios />} />
          <Route path="/back-office/reportes" element={<BackOfficeReportes />} />
          <Route path="/back-office/moderadores" element={<BackOfficeModeradores />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
