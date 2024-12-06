import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ProductPage from "./pages/ProductPage";
import PersonalDetails from "./pages/admin/PersonalDetails";
import { OtpVerify } from "./pages/OtpVerify";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} index />
        <Route path="/admin/verify" element={<OtpVerify />} index />
        <Route path="/admin/orders" element={<ProductPage />} index />
        <Route path="/admin/profile" element={<PersonalDetails />} index />
      </Routes>
    </BrowserRouter>
  );
}
