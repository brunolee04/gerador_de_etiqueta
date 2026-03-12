import { Routes, Route } from "react-router-dom";

import QrCode from "./QrCode";
import PrintComponent from "./Print";

export default function MainRoutes() {
  return (
    <Routes basename="/">
      <Route path="/" element={<PrintComponent />} />
      <Route path="/qrcode" element={<QrCode />} />
    </Routes>
  );
}
