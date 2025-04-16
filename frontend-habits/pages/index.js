import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Cargar dinámicamente el componente con SSR desactivado
const HomeContent = dynamic(() => import("../components/HomeContent"), { ssr: false });

export default function Home() {
  useEffect(() => {
    console.log("HOME PAGE - Renderizado en cliente");
  }, []);

  return (
    <>
      <div className="text-center mt-4 text-red-600 font-bold">Probando Index.js en Vercel 🚀</div>
      <HomeContent />
    </>
  );
}
