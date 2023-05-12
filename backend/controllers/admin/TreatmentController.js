const { sequelize } = require("../../models/index.js");
const { QueryTypes } = require("sequelize");
const Models = require("../../models/index.js");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const hargaTreatment = require("../../helpers/hargaTreatment");

exports.getTreatment = async (req, res) => {
  var treatment_query = await sequelize.query(
    `SELECT * FROM treatments ORDER BY createdAt DESC`,
    { type: QueryTypes.SELECT }
  );

  return res.json({
    message: "Semua treatment",
    data: treatment_query,
  });
};

exports.getTreatmentById = async (req, res) => {
  const { id } = req.params;
  var treatment_query = await sequelize.query(
    `SELECT * FROM treatments WHERE id = ${id}`,
    { type: QueryTypes.SELECT }
  );

  var harga_sanitation = hargaTreatment.harga_sanitation_detail(
    treatment_query[0].harga
  );

  var data = {
    id: treatment_query[0].id,
    nama: treatment_query[0].nama,
    harga: harga_sanitation,
    gambar: treatment_query[0].gambar,
    timestamp: treatment_query[0].timestamp,
    createdAt: treatment_query[0].createdAt,
    updatedAt: treatment_query[0].updatedAt,
  };

  return res.json({
    message: "Detail treatment",
    data: data,
  });
};

exports.addTreatment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      const { nama_tambah, harga_tambah, gambar_tambah } = req.body;

      if (harga_tambah.length <= 0) {
        return res.status(422).json({
          errors: {
            msg: "Harga harus di isi",
            param: "harga_tambah",
          },
        });
      }

      const harga_sanitation = hargaTreatment.harga_sanitation(harga_tambah);

      if (harga_sanitation.error === true) {
        return res.status(422).json({
          errors: {
            msg: "Harga harus angka, tanpa titik, tanpa koma, dan minimal 0",
            param: "harga_tambah",
          },
        });
      }

      if (req.files !== null) {
        var file = req.files.gambar_tambah;
        var fileSize = file.size;
        var extension = path.extname(file.name);
        var time = new Date().getTime();
        var fileName = time + "-" + file.md5 + extension;
        var allowedType = [".jpg", ".png", ".jpeg", ".JPG", ".PNG", ".JPEG"];

        if (!allowedType.includes(extension))
          return res.status(422).json({
            errors: {
              value: "",
              msg: "Format gambar harus .jpg/.jpeg/.png",
              param: "gambar_tambah",
              location: "body",
            },
          });

        if (fileSize > 2000000)
          return res.status(422).json({
            errors: {
              value: "",
              msg: "Ukuran gambar maksimal 2 MB",
              param: "gambar_tambah",
              location: "body",
            },
          });

        file.mv(`./public/gambar/treatment/${fileName}`, async (err) => {
          if (err) return res.status(500).json({ message: err.message });

          await Models.treatments.create({
            nama: nama_tambah,
            harga: harga_sanitation.harga_sanitation,
            gambar: fileName,
            timestamp: new Date().getTime() / 1000,
          });

          res.status(200).json({
            message: "Treatment berhasil ditambahkan",
          });
        });
      } else {
        await Models.treatments.create({
          nama: nama_tambah,
          harga: harga_sanitation.harga_sanitation,
          timestamp: new Date().getTime() / 1000,
        });

        res.status(200).json({
          message: "Treatment berhasil ditambahkan",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.editTreatment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      const { nama_lama_edit, nama_edit, harga_edit, gambar_edit } = req.body;
      const { id } = req.params;

      console.log("\n");
      console.log("\n");
      console.log(req.body);
      console.log("\n");
      console.log("\n");

      if (harga_edit.length <= 0) {
        return res.status(422).json({
          errors: {
            msg: "Harga harus di isi",
            param: "harga_edit",
          },
        });
      }

      const harga_sanitation = hargaTreatment.harga_sanitation(harga_edit);

      if (harga_sanitation.error === true) {
        return res.status(422).json({
          errors: {
            msg: "Harga harus angka, tanpa titik, tanpa koma, dan minimal 0",
            param: "harga_edit",
          },
        });
      }

      const treatment = await sequelize.query(
        `SELECT * FROM treatments WHERE id = ${id}`,
        { type: QueryTypes.SELECT }
      );

      if (treatment.length <= 0)
        return res.status(404).json({ message: "data tidak ditemukan" });

      if (req.files !== null) {
        var file = req.files.gambar_edit;
        var fileSize = file.size;
        var extension = path.extname(file.name);
        var time = new Date().getTime();
        var fileName = time + "-" + file.md5 + extension;
        var allowedType = [".jpg", ".png", ".jpeg", ".JPG", ".PNG", ".JPEG"];

        if (!allowedType.includes(extension))
          return res.status(422).json({
            errors: {
              value: "",
              msg: "Format gambar harus .jpg/.jpeg/.png",
              param: "gambar_edit",
              location: "body",
            },
          });

        if (fileSize > 2000000)
          return res.status(422).json({
            errors: {
              value: "",
              msg: "Ukuran gambar maksimal 2 MB",
              param: "gambar_edit",
              location: "body",
            },
          });

        if (treatment[0].gambar !== null) {
          // hapus gambar lama
          var url_hapus = `./public/gambar/treatment/${treatment[0].gambar}`;
          fs.unlinkSync(url_hapus);
        }

        file.mv(`./public/gambar/treatment/${fileName}`, async (err) => {
          if (err) return res.status(500).json({ message: err.message });

          await Models.treatments.update(
            {
              nama: nama_edit,
              harga: harga_sanitation.harga_sanitation,
              gambar: fileName,
            },
            {
              where: {
                id: id,
              },
            }
          );

          res.status(200).json({
            message: "Treatment berhasil di edit",
          });
        });
      } else {
        await Models.treatments.update(
          {
            nama: nama_edit,
            harga: harga_sanitation.harga_sanitation,
          },
          {
            where: {
              id: id,
            },
          }
        );

        res.status(200).json({
          message: "Treatment berhasil di edit",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.destroyTreatment = async (req, res) => {
  try {
    const { id } = req.params;

    const treatment = await sequelize.query(
      `SELECT * FROM treatments WHERE id = ${id}`,
      { type: QueryTypes.SELECT }
    );

    if (treatment.length <= 0)
      return res.status(404).json({ message: "data tidak ditemukan" });

    if (treatment[0].gambar !== null) {
      // hapus gambar
      var url = `./public/gambar/treatment/${treatment[0].gambar}`;
      fs.unlinkSync(url);
    }

    // hapus data di DB
    await Models.treatments.destroy({
      where: { id: id },
    });

    res.status(200).json({
      message: "Treatment berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.destroyImage = async (req, res) => {
  try {
    const { id } = req.params;

    const treatment = await sequelize.query(
      `SELECT * FROM treatments WHERE id = ${id}`,
      { type: QueryTypes.SELECT }
    );

    if (treatment.length <= 0)
      return res.status(404).json({ message: "data tidak ditemukan" });

    if (treatment[0].gambar !== null) {
      // hapus gambar
      var url = `./public/gambar/treatment/${treatment[0].gambar}`;
      fs.unlinkSync(url);
    }

    // update gambar di DB
    await Models.treatments.update(
      {
        gambar: null,
      },
      {
        where: { id: id },
      }
    );

    res.status(200).json({
      message: "Gambar berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
