import React from "react";
import { Routes, Route } from "react-router-dom";

import AuthRoute from "./routeMiddleware/AuthRoute";
import OnlyAdminRoute from "./routeMiddleware/OnlyAdminRoute";
import OnlyKasirRoute from "./routeMiddleware/OnlyKasirRoute";
import Dashboard from "../views/dashboard/Dashboard";
import Login from "../views/Login";
import User from "../views/admin/user/User";
import Transaksi from "../views/kasir/transaksi/Transaksi";
import TransaksiPending from "../views/kasir/transaksi/TransaksiPending";
import TransaksiPendingEdit from "../views/kasir/transaksi/TransaksiPendingEdit";
import Chart from "../views/chart/Chart";
import Wallet from "../views/wallet/Wallet";
import Setting1 from "../views/setting/Setting1";
import Setting2 from "../views/setting/Setting2";
import Register from "../views/Register";
import ForgotPassword from "../views/ForgotPassword";
import Barang from "../views/admin/barang/Barang";
import Dokter from "../views/admin/dokter/Dokter";
import Treatment from "../views/admin/treatment/Treatment";
import Pasien from "../views/admin/pasien/Pasien";
import Laporan from "../views/kasir/laporan/Laporan";
import UbahPassword from "../views/kasir/ubah_password/UbahPassword";

export default function Router() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <OnlyAdminRoute>
                <Dashboard />
              </OnlyAdminRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/user"
          element={
            <AuthRoute>
              <OnlyAdminRoute>
                <User />
              </OnlyAdminRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/barang"
          element={
            <AuthRoute>
              <OnlyAdminRoute>
                <Barang />
              </OnlyAdminRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/dokter"
          element={
            <AuthRoute>
              <OnlyAdminRoute>
                <Dokter />
              </OnlyAdminRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/pasien"
          element={
            <AuthRoute>
              <OnlyAdminRoute>
                <Pasien />
              </OnlyAdminRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/treatment"
          element={
            <AuthRoute>
              <OnlyAdminRoute>
                <Treatment />
              </OnlyAdminRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/transaksi"
          element={
            <AuthRoute>
              <OnlyKasirRoute>
                <Transaksi />
              </OnlyKasirRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/transaksi_pending"
          element={
            <AuthRoute>
              <TransaksiPending />
            </AuthRoute>
          }
        />
        <Route
          path="/transaksi/:kode_transaksi"
          element={
            <AuthRoute>
              <OnlyKasirRoute>
                <TransaksiPendingEdit />
              </OnlyKasirRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/laporan"
          element={
            <AuthRoute>
              <Laporan />
            </AuthRoute>
          }
        />
        <Route
          path="/ubah_password"
          element={
            <AuthRoute>
              <UbahPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/chart"
          element={
            <AuthRoute>
              <Chart />
            </AuthRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <AuthRoute>
              <Wallet />
            </AuthRoute>
          }
        />
        <Route
          path="/setting1"
          element={
            <AuthRoute>
              <Setting1 />
            </AuthRoute>
          }
        />
        <Route
          path="/setting2"
          element={
            <AuthRoute>
              <Setting2 />
            </AuthRoute>
          }
        />
      </Routes>
    </div>
  );
}
