import React from "react";
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import ScrollToTop from "./Components/shared/ScrollToTop"; // 👈

import {LandingPage} from "./pages/LandingPage"; 
import AcompañamientosPage from "./pages/AcompañamientosPage";
import PagoDatos from "./pages/PagoDatos";
import PasarelaPago from "./Components/pago/PasarelaPago";
import Gracias from "./Components/pago/Gracias";
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

// ✅ Wrapper raíz que monta ScrollToTop + MainLayout
function RootWithScroll() {
  return (
    <>
      <ScrollToTop />
      <MainLayout />
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
      { path: "proximamente", element:<ComingSoonPage/> },
      { path: "/editar-reserva/:id", element: <EditarReservaPage /> },
      { path: "tu-testimonio", element: <TuTestimonioPage /> },
      { path: "faqs", element: <FaqsPage /> },
      { path: "terminos", element: <TerminosPage /> },
      { path: "politica-privacidad", element: <PoliticaPrivacidadPage /> },
      { path: "aviso-legal", element: <AvisoLegalPage /> },
      { path: "cookies", element: <CookiesPage /> }
    ],
  },
]);

const App: React.FC = () => <RouterProvider router={router} />;
export default App;
