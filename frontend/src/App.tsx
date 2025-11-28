import React from "react";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import ScrollToTop from "./components/shared/ScrollToTop";

import { LandingPage } from "./pages/LandingPage";
import AcompañamientosPage from "./pages/AcompañamientosPage";
import PagoDatos from "./pages/PagoDatos";
import PasarelaPago from "./components/pago/PasarelaPago";
import Gracias from "./components/pago/Gracias";
import AreaPage from "./pages/AreaPage";
import CursosPage from "./pages/CursosPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import EditarReservaPage from "./pages/EditarReservaPage";
import TuTestimonioPage from "./pages/TuTestimonioPage";
import FaqsPage from "./pages/FaqsPage";
import TerminosPage from "./pages/TerminosPage";
import PoliticaPrivacidadPage from "./pages/PoliticaPrivacidadPage";
import AvisoLegalPage from "./pages/AvisoLegalPage";
import CookiesPage from "./pages/CookiesPage";
import OrigenPage from "./pages/OrigenPage";
import PrewarmBackend from "./components/PrewarmBackend";
import ContactPage from "./pages/ContactPage"
import TestimoniosPage from "./pages/TestimoniosPage";
import EquipoPage from "./pages/EquipoPage";
import MembershipRegisterPage from "./pages/MembershipRegisterPage";
import MembershipLoginPage from "./pages/MembershipLoginPage";
import QueIncluyePage from "./pages/QueIncluyePage";
import ListaEsperaPage from "./pages/ListaEsperaPage";
import TestRuedaVidaPage from "./pages/TestRuedaVidaPage";
import TestConfirmacionPage from "./pages/TestConfirmacionPage";
import DashboardInicio from "./pages/dashboard/DashboardInicio";
import { DashboardLayout } from "./layouts/DashboardLayout";
import ContenidosPage from "./pages/dashboard/ContenidosPage";
import VideoPlayerPage from "./pages/dashboard/VideoPlayerPage";
import MisReservasPage from "./pages/dashboard/MisReservasPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";


// ✅ Wrapper raíz que monta ScrollToTop + MainLayout
function RootWithScroll() {
  return (
    <>
      <ScrollToTop />
      <MainLayout />
      <PrewarmBackend />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootWithScroll />, // 👈 en vez de <MainLayout/>
    children: [
      { index: true, element: <LandingPage /> },
      { path: "acompanamientos", element: <AcompañamientosPage /> },
      { path: "pagoDatos/:id", element: <PagoDatos carrito={[]} /> },
      { path: "pagoPasarela/:id", element: <PasarelaPago /> },
      { path: "gracias", element: <Gracias /> },
      { path: "areas/:slug", element: <AreaPage /> },
      { path: "cursos", element: <CursosPage /> },
      { path: "proximamente", element: <ComingSoonPage /> },
      { path: "/editar-reserva/:id", element: <EditarReservaPage /> },
      { path: "tu-testimonio", element: <TuTestimonioPage /> },
      { path: "faqs", element: <FaqsPage /> },
      { path: "terminos", element: <TerminosPage /> },
      { path: "politica-privacidad", element: <PoliticaPrivacidadPage /> },
      { path: "aviso-legal", element: <AvisoLegalPage /> },
      { path: "cookies", element: <CookiesPage /> },
      { path: "origen", element: <OrigenPage /> },
      { path: "contacto", element: <ContactPage /> },
      { path: "testimonios", element: <TestimoniosPage /> },
      { path: "equipo", element: <EquipoPage /> },
      { path: "registro", element: <MembershipRegisterPage /> },
      { path: "login", element: <MembershipLoginPage /> },
      { path: "que-incluye", element: <QueIncluyePage /> },
      { path: "lista-espera", element: <ListaEsperaPage /> },
      { path: "test-rueda-vida", element: <TestRuedaVidaPage /> },
      { path: "test-confirmacion", element: <TestConfirmacionPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardInicio /> },
      { path: "contenidos", element: <ContenidosPage /> },
      { path: "contenidos/:id", element: <VideoPlayerPage /> },
      { path: "reservas", element: <MisReservasPage /> },
      { path: "perfil", element: <div className="p-8">Mi Perfil - Próximamente</div> },
    ],
  },
]);

const App: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
