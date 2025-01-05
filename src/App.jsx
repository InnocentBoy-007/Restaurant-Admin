import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignIn from "./pages/SignIn";
import OrderPage from "./pages/OrderPage";
import PersonalDetails from "./pages/admin/PersonalDetails";
import { OtpVerify } from "./pages/OtpVerify";
import Products from "./pages/productsManagement/Products";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} index />
        <Route path="/admin/signIn" element={<SignIn />} />
        <Route path="/admin/verify" element={<OtpVerify />} />
        <Route path="/admin/orders" element={<OrderPage />} />
        <Route path="/admin/profile" element={<PersonalDetails />} />
        <Route path="/admin/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}
