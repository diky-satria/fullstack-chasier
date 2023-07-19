const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:8090", "https://kasir.dikysatria.net"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
      maxAge: parseInt(process.env.SESSION_EXPIRE),
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({ message: "welcome to app" });
});
const authRouter = require("./routes/AuthRoutes.js");
const userRouter = require("./routes/admin/UserRoutes.js");
const dashboardRouter = require("./routes/admin/DashboardRoutes.js");
const barangRouter = require("./routes/admin/BarangRoutes.js");
const dokterRouter = require("./routes/admin/DokterRoutes.js");
const pasienRouter = require("./routes/admin/PasienRoutes.js");
const treatmentRouter = require("./routes/admin/TreatmentRoutes.js");
const transaksiRouter = require("./routes/kasir/TransaksiRoutes.js");
const transaksiPendingRouter = require("./routes/kasir/TransaksiPendingRoutes.js");
const laporanRouter = require("./routes/kasir/LaporanRoutes.js");
const userSettingRouter = require("./routes/kasir/UserSettingRoutes.js");
app.use(authRouter);
app.use(userRouter);
app.use(dashboardRouter);
app.use(barangRouter);
app.use(dokterRouter);
app.use(pasienRouter);
app.use(treatmentRouter);
app.use(transaksiRouter);
app.use(transaksiPendingRouter);
app.use(laporanRouter);
app.use(userSettingRouter);

const PORT = process.env.PORT || 3090;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
