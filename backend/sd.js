let data = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const target = (value) => {
  for (var i = 0; i < data.length; i++) {
    for (var j = i; j < data.length; j++) {
      if (data[i] !== data[j]) {
        if (data[i] + data[j] == value) {
          console.log(`${data[i]} + ${data[j]}`);
        }
      }
    }
  }
};

// target(6);

let data2 = ["1", "*", "3", "4", "*", "6", "*", "8", "9", "*"];

const target2 = (value) => {
  let tampung = [];

  for (var i = 1; i <= value; i++) {
    if (i % 5 == 2 || i % 5 == 0) {
      tampung.push(`*`);
    } else {
      tampung.push(`${i}`);
    }
  }

  console.log(tampung);
};

// target2(20);

// STRUKTUR DATA

// 1. STACK

let warna = [];

const addWarna = (value, warna) => {
  warna.push(value);

  return warna;
};

const removeWarna = () => {
  warna.pop();

  return warna;
};

// 2. QUEUE

let nama = [];

const addNama = (value, nama) => {
  nama.push(value);

  return nama;
};

const removeNama = () => {
  nama.shift();

  return nama;
};
