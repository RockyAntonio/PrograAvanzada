"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits } from "@/store/habitsSlice";
import { RootState } from "@/store/store";
import Image from "next/image";

export default function Home() {
  const dispatch = useDispatch();
  const habits = useSelector((state: RootState) => state.habits.habits);

  useEffect(() => {
    dispatch(fetchHabits() as any);
  }, [dispatch]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-xl font-bold">Lista de Hábitos</h1>
        <ul className="list-disc list-inside">
          {habits.length > 0 ? (
            habits.map((habit: any) => <li key={habit.id}>{habit.name}</li>)
          ) : (
            <li>No hay hábitos disponibles</li>
          )}
        </ul>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
          Documentación de Next.js
        </a>
      </footer>
    </div>
  );
}
