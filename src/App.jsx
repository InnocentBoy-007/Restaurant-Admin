import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { OtpVerify } from "./pages/OtpVerify";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} index />
        <Route path="/otpverify" element={<OtpVerify />} index />
      </Routes>
    </BrowserRouter>
  );
}
