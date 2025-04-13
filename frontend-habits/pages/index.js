import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Cargar dinámicamente el componente con SSR desactivado
const HomeContent = dynamic(() => import("../components/HomeContent"), { ssr: false });

export default function Home() {
  return <HomeContent />;
}
