import React, { lazy, Suspense } from "react";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import ScrollToTop from "./components/shared/ScrollToTop";

// Lazy load all pages for code splitting
const LandingPage = lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })));
const AcompañamientosPage = lazy(() => import("./pages/AcompañamientosPage"));
const PagoDatos = lazy(() => import("./pages/PagoDatos"));
const PasarelaPago = lazy(() => import("./components/pago/PasarelaPago"));
const Gracias = lazy(() => import("./components/pago/Gracias"));
const AreaPage = lazy(() => import("./pages/AreaPage"));
const CursosPage = lazy(() => import("./pages/CursosPage"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoonPage"));
const EditarReservaPage = lazy(() => import("./pages/EditarReservaPage"));
const TuTestimonioPage = lazy(() => import("./pages/TuTestimonioPage"));
const FaqsPage = lazy(() => import("./pages/FaqsPage"));
const TerminosPage = lazy(() => import("./pages/TerminosPage"));
const PoliticaPrivacidadPage = lazy(() => import("./pages/PoliticaPrivacidadPage"));
const AvisoLegalPage = lazy(() => import("./pages/AvisoLegalPage"));
const CookiesPage = lazy(() => import("./pages/CookiesPage"));
const OrigenPage = lazy(() => import("./pages/OrigenPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TestimoniosPage = lazy(() => import("./pages/TestimoniosPage"));
const EquipoPage = lazy(() => import("./pages/EquipoPage"));
const MembershipRegisterPage = lazy(() => import("./pages/MembershipRegisterPage"));
const MembershipLoginPage = lazy(() => import("./pages/MembershipLoginPage"));
const QueIncluyePage = lazy(() => import("./pages/QueIncluyePage"));
const ListaEsperaPage = lazy(() => import("./pages/ListaEsperaPage"));
const TestRuedaVidaPage = lazy(() => import("./pages/TestRuedaVidaPage"));
const TestConfirmacionPage = lazy(() => import("./pages/TestConfirmacionPage"));

// MVP pages
const MVPPurchasePage = lazy(() => import("./pages/MVPPurchasePage"));
const MVPSuccessPage = lazy(() => import("./pages/MVPSuccessPage"));
const MVPCreateAccountPage = lazy(() => import("./pages/MVPCreateAccountPage"));

// Dashboard pages
const DashboardInicio = lazy(() => import("./pages/dashboard/DashboardInicio"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout").then(m => ({ default: m.DashboardLayout })));
const ContenidosPage = lazy(() => import("./pages/dashboard/ContenidosPage"));
const VideoPlayerPage = lazy(() => import("./pages/dashboard/VideoPlayerPage"));
const MisReservasPage = lazy(() => import("./pages/dashboard/MisReservasPage"));
const DirectoDetailPage = lazy(() => import("./pages/dashboard/DirectoDetailPage"));
const ComunidadPage = lazy(() => import("./pages/dashboard/ComunidadPage"));
const PostDetailPage = lazy(() => import("./pages/dashboard/PostDetailPage"));
const PerfilPage = lazy(() => import("./pages/dashboard/PerfilPage"));
const DirectosPage = lazy(() => import("./pages/dashboard/DirectosPage"));

// Keep these as regular imports (small, needed immediately)
import PrewarmBackend from "./components/PrewarmBackend";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-linen">
    <div className="text-center">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-asparragus border-r-transparent"></div>
      <p className="mt-4 text-stone-600 font-degular">Cargando...</p>
    </div>
  </div>
);

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

      // MVP Routes
      { path: "/mvp", element: <MVPPurchasePage /> },
      { path: "/mvp/success", element: <MVPSuccessPage /> },
      { path: "/mvp/create-account", element: <MVPCreateAccountPage /> },
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
      { path: "directos/:id", element: <DirectoDetailPage /> },
      { path: "comunidad", element: <ComunidadPage /> },
      { path: "comunidad/:postId", element: <PostDetailPage /> },
      { path: "reservas", element: <MisReservasPage /> },
      { path: "directos", element: <DirectosPage /> },
      { path: "directos/:id", element: <DirectoDetailPage /> },
      { path: "perfil", element: <PerfilPage /> },
    ],
  },
]);

const App: React.FC = () => (
  <AuthProvider>
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  </AuthProvider>
);

export default App;
