import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, SignupPage } from "../features/auth";
import { HomePage } from "../features/landing";
import { PortalPage } from "../features/portal";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/portal" element={<PortalPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
