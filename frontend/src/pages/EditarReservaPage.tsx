// src/pages/EditarReservaPage.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import GenericNav from "../Components/shared/GenericNav";
import ReservaWizard from "../Components/reservas/ReservaWizard";

const HERO_IMG = "/img/Backgrounds/background5.jpg"; // ajusta la ruta si quieres

export default function EditarReservaPage() {
  const { id: reservaId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleClose = () => {
    if (reservaId) navigate(`/pagoDatos/${reservaId}`);
    else navigate(-1);
  };

  return (
    <>
      {/* NAV como en el resto: header absolute top-0, sin offsets extra */}
      <header className="absolute inset-x-0 top-0 z-40">
        <GenericNav
          title="Dharma En Ruta"
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
          {/* Si quieres un velo leve, descomenta: */}
          {/* <div className="absolute inset-0 bg-black/10" /> */}
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
