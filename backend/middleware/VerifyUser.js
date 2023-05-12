const { sequelize } = require("../models/index.js");
const { QueryTypes } = require("sequelize");

exports.VerifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  } else {
    const user = await sequelize.query(
      `SELECT * FROM users WHERE id = ${req.session.userId}`,
      { type: QueryTypes.SELECT }
    );

    req.userId = user[0].id;
    req.role = user[0].role;

    next();
  }
};

exports.VerifyRole = async (req, res, next) => {
  const user = await sequelize.query(
    `SELECT * FROM users WHERE id = ${req.session.userId}`,
    { type: QueryTypes.SELECT }
  );

  if (user[0].role !== "admin") {
    return res.status(403).json({
      msg: "Admin only",
    });
  } else {
    next();
  }
};
