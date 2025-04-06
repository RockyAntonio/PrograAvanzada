import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchHabits } from "../store/habitsSlice";
import { getToken } from "../utils/auth";
import HabitList from "../components/HabitList";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error } = useSelector((state) => state.habits);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    dispatch(fetchHabits(token));
  }, [token, dispatch, router]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Mis Hábitos</h1>

      {status === "loading" && <p>Cargando hábitos...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}

      <HabitList />
    </div>
  );
}
