exports.harga_sanitation = (hargaValue) => {
  var harga = hargaValue.split(",");

  var harga_sanitation = "";
  var error = false;

  for (var i = 0; i < harga.length; i++) {
    const cekError = isNum(harga[i]);
    if (!cekError) {
      error = true;
    }

    const cekMinHarga = parseInt(harga[i]);

    if (harga.length > 1) {
      if (i > 0) {
        harga_sanitation += `,${cekMinHarga}`;
      } else {
        harga_sanitation += `${cekMinHarga}`;
      }
    } else {
      if (i > 0) {
        harga_sanitation += `,${cekMinHarga}`;
      } else {
        harga_sanitation += cekMinHarga;
      }
    }
  }

  return {
    harga_sanitation,
    error,
  };
};

exports.harga_sanitation_detail = (harga) => {
  var harga_split = harga.split(",");
  var harga_data = [];
  for (var i = 0; i < harga_split.length; i++) {
    harga_data.push({
      label: harga_split[i],
      value: harga_split[i],
    });
  }

  return harga_data;
};

const isNum = (value) => {
  return /^\d+$/.test(value);
};
