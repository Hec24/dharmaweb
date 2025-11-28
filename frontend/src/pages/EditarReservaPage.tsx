import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import GenericNav from "../components/shared/GenericNav";
import ReservaWizard from "../components/reservas/ReservaWizard";
import { Helmet} from "react-helmet-async"

const HERO_IMG = "/img/Backgrounds/background5.jpg"; // ajusta la ruta si quieres

export default function EditarReservaPage() {
  const { id: reservaId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleClose = () => {
    // Si el usuario cierra con la X, decidir destino según exista checkout_reserva_ids
    const hasCheckout = !!sessionStorage.getItem("checkout_reserva_ids");
    if (reservaId) {
      navigate(hasCheckout ? `/pagoPasarela/${reservaId}` : `/pagoDatos/${reservaId}`, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      
      {/* NAV como en el resto: header absolute top-0, sin offsets extra */}
      <header className="absolute inset-x-0 top-0 z-40">
        <GenericNav
          title="Dharma en Ruta"
          logoSrc="/img/Logos/Logos-08.png"
          variant="transparent"
          mode="logoOnly"
          containerWidth="120rem"
          barWidth="110rem"
          innerPx="px-[min(6vw,3rem)]"
          barHeight="h-20"
        />
      </header>

      {/* Fondo a pantalla completa */}
      <main className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>

        {/* Capa vacía para mantener altura (no mostramos títulos/contenido extra) */}
        <div className="relative min-h-screen" />

        {/* Modal del wizard (sobre el fondo) */}
        <ReservaWizard
          open={true}
          onClose={handleClose}
          preSelectedProfesor={null}
          autoAdvanceFromStep0={false}
        />
      </main>
    </>
  );
}
