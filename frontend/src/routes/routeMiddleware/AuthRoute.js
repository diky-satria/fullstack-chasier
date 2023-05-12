import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../../views/layout/Layout";

export default function AuthRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  return user ? <Layout>{children}</Layout> : <Navigate to="/" />;
}
