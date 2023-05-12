import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OnlyAdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  return user.role === "admin" ? children : <Navigate to="/transaksi" />;
}
