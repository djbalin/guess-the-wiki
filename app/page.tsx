import { cookies } from "next/headers";
import Dashboard from "@/components/game/Dashboard";

export default async function Index() {
  return <Dashboard />;
}
