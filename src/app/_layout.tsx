import usePedometer from "@/hooks/usePedometer";
import "../global.css";
import { Slot } from "expo-router";

export default function Layout() {

  usePedometer();

  return <Slot />;
}
