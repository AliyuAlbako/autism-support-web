import type { JSX } from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

export default function App(): JSX.Element {
  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
}