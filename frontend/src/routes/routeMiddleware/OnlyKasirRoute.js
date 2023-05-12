import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OnlyKasirRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  return user.role === "kasir" ? children : <Navigate to="/dashboard" />;
}
