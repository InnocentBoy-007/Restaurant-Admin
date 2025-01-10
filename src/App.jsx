import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp"
import OrderPage from "./pages/OrderPage";
import PersonalDetails from "./pages/admin/PersonalDetails";
import { OtpVerify } from "./pages/OtpVerify";
import Products from "./pages/productsManagement/Products";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} index/>
        <Route path="/admin/signup" element={<SignUp />}/>
        <Route path="/admin/verify" element={<OtpVerify />} />
        <Route path="/admin/orders" element={<OrderPage />} />
        <Route path="/admin/profile" element={<PersonalDetails />} />
        <Route path="/admin/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}
