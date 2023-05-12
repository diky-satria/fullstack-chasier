import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import axios from "../../../interceptor/axios";
import logo from "../../../img/doctor.png";
import logo_adadental from "../../../img/new-logo.png";

// react icon
import { AiOutlineAlignRight, AiFillCheckCircle } from "react-icons/ai";
import {
  BsFillHandThumbsUpFill,
  BsFillHandThumbsDownFill,
} from "react-icons/bs";

import {
  Select,
  Modal,
  Form,
  Input,
  Button,
  Space,
  Dropdown,
  Radio,
} from "antd";
import {
  formatNumber,
  formatNumberNoRp,
  // getTheFirstLetter,
  formatDateHuman,
  transaksiPasienSelected,
} from "../../../helpers";
import InfiniteScroll from "react-infinite-scroll-component";
import toast from "react-hot-toast";
import ReactToPrint from "react-to-print";
import { BsFillTrashFill } from "react-icons/bs";

export default function Transaksi() {
  const ref = useRef();
  const [treatment, setTreatment] = useState([]);

  const [rangeModal, setRangeModal] = useState("");
  const [idRangeModal, setIdRangeModal] = useState("");
  const [namaRangeModal, setNamaRangeModal] = useState("");
  const [hargaRangeModal, setHargaRangeModal] = useState([]);
  const [qtyModal, setQtyModal] = useState(1); //----------------------
  const [diskonModal, setDiskonModal] = useState(0); //-----------------
  const [noteModal, setNoteModal] = useState(""); //--------------------
  const [kodeRangeModal, setKodeRangeModal] = useState([]);

  const [limit, setLimit] = useState(16);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [nama, setName] = useState("");
  const [harga] = useState("");

  const [pasien, setPasien] = useState([]);
  const [dokter, setDokter] = useState([]);

  const [dokterId, setDokterId] = useState("");
  const [dokterNama, setDokterNama] = useState("");

  const [pasienNama, setPasienNama] = useState("");
  const [pasienTelepon, setPasienTelepon] = useState("");
  const [pasienIdKeranjang, setPasienIdKeranjang] = useState("");
  const [pasienNamaKeranjang, setPasienNamaKeranjang] = useState("");

  const [kode, setKode] = useState("");
  const [time, setTime] = useState("");

  const [listTreatmentSelected, setListTreatmentSelected] = useState([]);

  const [openModalRangeHarga, setOpenModalRangeHarga] = useState(false);
  const [openModalEditPerTreatment, setOpenModalEditPerTreatment] =
    useState(false);
  const [openModalDiskonTransaksi, setOpenModalDiskonTransaksi] =
    useState(false);
  const [openModalHapusTransaksi, setOpenModalHapusTransaksi] = useState(false);
  const [openModalPasien, setOpenModalPasien] = useState(false);
  const [openModalBayar, setOpenModalBayar] = useState(false);
  const [openModalPrint, setOpenModalPrint] = useState(false);

  const [idPerTreatment, setIdPerTreatment] = useState("");
  const [namaPerTreatment, setNamaPerTreatment] = useState("");
  const [hargaPerTreatment, setHargaPerTreatment] = useState("");
  const [qtyPerTreatment, setQtyPerTreatment] = useState("");
  const [diskonPerTreatment, setDiskonPerTreatment] = useState("");
  const [notePerTreatment, setNotePerTreatment] = useState("");

  const [diskonTransaksi, setDiskonTransaksi] = useState(0);

  const [subTotal, setSubTotal] = useState(0);
  const [diskon, setDiskon] = useState(0);
  const [diskonHarga, setDiskonHarga] = useState(0);
  const [ppn] = useState(11);
  const [ppnHarga, setPpnHarga] = useState(0);
  const [total, setTotal] = useState(0);

  const [errors, setErrors] = useState([]);

  const [loadingButtonMasukanKeKeranjang, setLoadingButtonMasukanKeKeranjang] =
    useState(false);
  const [loadingButtonKonfirmasi, setLoadingButtonKonfirmasi] = useState(false);
  const [loadingButtonKonfirmasiPasien, setLoadingButtonKonfirmasiPasien] =
    useState(false);
  const [loadingButtonYaLanjutkan, setLoadingButtonYaLanjutkan] =
    useState(false);
  const [
    loadingButtonKonfirmasiPembayaran,
    setLoadingButtonKonfirmasiPembayaran,
  ] = useState(false);

  const [tabKey, setTabKey] = useState(1);
  const [tabKeyBayar, setTabKeyBayar] = useState(1);

  const [nominalLama, setNominalLama] = useState(0);
  const [nominal, setNominal] = useState("");
  const [kembalian, setKembalian] = useState("-");

  const [namaKasirStruk, setNamaKasirStruk] = useState("");
  const [nominalStruk, setNominalStruk] = useState(0);
  const [kembalianStruk, setKembalianStruk] = useState(0);
  const [metodePembayaranIdStruk, setMetodePembayaranIdStruk] = useState(0);

  useEffect(() => {
    getKodeDanTime();
    getPasien();
    getDokter();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getTransaksi();

    // eslint-disable-next-line
  }, [offset, nama, harga]);

  const getTransaksi = async () => {
    let response = await axios.get(
      `/transaksi?offset=${offset}&limit=${limit}&nama=${nama}&harga=${harga}`
    );

    var newTreatment = response.data.data_treatment;
    setTreatment([...treatment, ...newTreatment]);
    setHasMore(response.data.hasMore);
  };

  const getKodeDanTime = async () => {
    let response = await axios.get(`/transaksi/kode_dan_time`);

    setKode(response.data.kode);
    setTime(response.data.time);
  };

  const getPasien = async () => {
    let response = await axios.get("/transaksi/pasien");
    setPasien(response.data.data_pasien);
  };

  const getDokter = async () => {
    let response = await axios.get("/transaksi/dokter");
    setDokter(response.data.data_dokter);
  };

  const getListTreatmentSelected = async (kode) => {
    let response = await axios.get(`/transaksi/list_treatment/${kode}`);

    var res = response.data.data_transaksi_treatment;
    setListTreatmentSelected(res);

    // hitung sub_total
    var sub_total_2 = 0;
    for (var i = 0; i < res.length; i++) {
      sub_total_2 += res[i].total_harga;
    }
    setSubTotal(sub_total_2);

    // diskon
    setDiskon(response.data.data_transaksi.diskon);
    setDiskonHarga(response.data.data_transaksi.diskon_harga);

    // hitung ppn
    var ppn_harga = Math.floor((sub_total_2 * ppn) / 100); //---------------------------------
    setPpnHarga(ppn_harga);

    // hitung total
    var total =
      sub_total_2 + ppn_harga - response.data.data_transaksi.diskon_harga;
    setTotal(total);

    // masukan data untuk kebutuhan state struk
    if (res.length > 0) {
      setNamaKasirStruk(response.data.data_transaksi.nama_kasir);

      if (response.data.data_transaksi.metode_pembayaran_id !== null) {
        setMetodePembayaranIdStruk(
          response.data.data_transaksi.metode_pembayaran_id
        );
      }
      if (response.data.data_transaksi.nominal !== null) {
        setNominalStruk(response.data.data_transaksi.nominal);
      }
      if (response.data.data_transaksi.kembalian !== null) {
        setKembalianStruk(response.data.data_transaksi.kembalian);
      }
    }

    setTimeout(() => {
      var objDiv = document.getElementById("product-list-selected");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 100);
  };

  const sidebarRightShow = () => {
    var sidebarRight = document.querySelector(".c-sidebar-right");

    if (sidebarRight.classList.contains("show")) {
      sidebarRight.classList.remove("show");
    } else {
      sidebarRight.classList.add("show");
    }
  };

  const clickCurrentCard = (e) => {
    var allCard = document.getElementsByClassName("card");
    for (var i = 0; i < allCard.length; i++) {
      allCard[i].classList.remove("active");
    }

    e.currentTarget.classList.add("active");
  };

  const openModalEditPerTreat = (id, nama, harga_satuan, qty, diskon, note) => {
    setErrors([]);

    setIdPerTreatment(id);
    setNamaPerTreatment(nama);
    setHargaPerTreatment(formatNumberNoRp(harga_satuan));
    setQtyPerTreatment(qty);
    setDiskonPerTreatment(diskon);
    setNotePerTreatment(note);

    setOpenModalEditPerTreatment(true);
  };

  const closeModalEditPerTreat = () => {
    setOpenModalEditPerTreatment(false);
  };

  const fetchMore = () => {
    setOffset(offset + 16);
  };

  const openModalRangeHar = (id, nama, harga, kode) => {
    setOpenModalRangeHarga(true);

    setIdRangeModal(id);
    setNamaRangeModal(nama);
    setHargaRangeModal(harga);
    setKodeRangeModal(kode);
  };

  const closeModalRangeHar = () => {
    setOpenModalRangeHarga(false);

    setIdRangeModal("");
    setKodeRangeModal("");
    setNamaRangeModal("");
    setHargaRangeModal([]);
    setQtyModal(1);
    setDiskonModal(0);
    setNoteModal("");
  };

  const masukanKeKeranjang = async (id, nama, kode, qty, diskon, note) => {
    setLoadingButtonMasukanKeKeranjang(true);
    setErrors([]);

    try {
      let response = await axios.post(
        `/transaksi/pilih_treatment/${kode}/${diskonTransaksi}`,
        {
          id: id,
          nama: nama,
          harga: rangeModal,
          qty: qty,
          diskon: diskon,
          note: note,
        }
      );

      getListTreatmentSelected(kode);
      setLoadingButtonMasukanKeKeranjang(false);
      closeModalRangeHar();

      toast.success(response.data.message, {
        position: "top-center",
        duration: 2000,
        iconTheme: {
          primary: "#1bff1f",
          secondary: "#000000",
        },
        style: {
          borderRadius: "10px",
          background: "#1bff23",
          color: "#000000",
        },
      });
    } catch (e) {
      setLoadingButtonMasukanKeKeranjang(false);
      setErrors(e.response.data.errors);
    }
  };

  const selectTreatment = async (id, nama, harga, kode) => {
    setErrors([]);
    setRangeModal("");
    openModalRangeHar(id, nama, harga, kode);
  };

  const items = [
    {
      key: "1",
      label: <span onClick={() => openModalDiskonTrans(diskon)}>Diskon</span>,
    },
  ];

  const konfirmasiPerTreatment = async (id, kode) => {
    setLoadingButtonKonfirmasi(true);
    setErrors([]);

    try {
      var hargaPerTreatmentReplace = hargaPerTreatment.replaceAll(",", "");
      let response = await axios.patch(
        `/transaksi/editPerTreatment/${id}/${kode}/${diskonTransaksi}`,
        {
          nama_per_treatment: namaPerTreatment,
          qty_per_treatment: qtyPerTreatment,
          harga_per_treatment: hargaPerTreatmentReplace,
          diskon_per_treatment: diskonPerTreatment,
          note_per_treatment: notePerTreatment,
        }
      );

      getListTreatmentSelected(kode);

      setLoadingButtonKonfirmasi(false);
      closeModalEditPerTreat();

      toast.success(response.data.message, {
        position: "top-center",
        duration: 2000,
        iconTheme: {
          primary: "#1bff1f",
          secondary: "#000000",
        },
        style: {
          borderRadius: "10px",
          background: "#1bff23",
          color: "#000000",
        },
      });
    } catch (e) {
      setLoadingButtonKonfirmasi(false);
      setErrors(e.response.data.errors);
    }
  };

  const hapusPerTreatment = async (id, nama, kode) => {
    try {
      let response = await axios.delete(
        `/transaksi/hapusPerTreatment/${id}/${nama}/${kode}/${diskonTransaksi}`
      );

      if (response.data.reload === true) {
        getKodeDanTime();
        getDokter();
        setDokterId("");
        setPasienNamaKeranjang("");
        setPasienIdKeranjang("");
      }

      getListTreatmentSelected(kode);
      closeModalEditPerTreat();

      toast.success(response.data.message, {
        position: "top-center",
        duration: 2000,
        iconTheme: {
          primary: "#1bff1f",
          secondary: "#000000",
        },
        style: {
          borderRadius: "10px",
          background: "#1bff23",
          color: "#000000",
        },
      });
    } catch (e) {
      toast.error("Server error", {
        position: "top-center",
        iconTheme: {
          primary: "#ff5959",
          secondary: "#fff",
        },
        style: {
          borderRadius: "10px",
          background: "#ff3131",
          color: "#fff",
        },
      });
    }
  };

  const openModalDiskonTrans = (diskon) => {
    setErrors([]);
    setDiskonTransaksi(diskon);
    setOpenModalDiskonTransaksi(true);
  };

  const closeModalDiskonTrans = () => {
    setOpenModalDiskonTransaksi(false);
  };

  const konfirmasiDiskonTransaksi = async (kode) => {
    setLoadingButtonKonfirmasi(true);
    setErrors([]);

    try {
      var sub_total = 0;
      for (var i = 0; i < listTreatmentSelected.length; i++) {
        sub_total += listTreatmentSelected[i].total_harga;
      }

      let response = await axios.patch(
        `/transaksi/diskon_transaksi/${kode}/${sub_total}`,
        {
          diskon_transaksi: diskonTransaksi,
        }
      );

      getListTreatmentSelected(kode);

      setLoadingButtonKonfirmasi(false);
      closeModalDiskonTrans();

      toast.success(response.data.message, {
        position: "top-center",
        duration: 2000,
        iconTheme: {
          primary: "#1bff1f",
          secondary: "#000000",
        },
        style: {
          borderRadius: "10px",
          background: "#1bff23",
          color: "#000000",
        },
      });
    } catch (e) {
      setLoadingButtonKonfirmasi(false);
      setErrors(e.response.data.errors);
    }
  };

  const openModalHapusTrans = (kode) => {
    setErrors([]);
    setKode(kode);
    setOpenModalHapusTransaksi(true);
  };

  const closeModalHapusTrans = () => {
    setOpenModalHapusTransaksi(false);
  };

  const hapusTransaksi = async (kode_trans) => {
    setLoadingButtonYaLanjutkan(true);
    setDokter([]);

    try {
      let response = await axios.delete(`/transaksi/${kode_trans}`);

      getKodeDanTime();
      getDokter();
      closeModalHapusTrans();

      setPasienIdKeranjang("");
      setPasienNamaKeranjang("");
      setDokterId("");
      getListTreatmentSelected(kode);

      setLoadingButtonYaLanjutkan(false);
      toast.success(response.data.message, {
        position: "top-center",
        duration: 2000,
        iconTheme: {
          primary: "#1bff1f",
          secondary: "#000000",
        },
        style: {
          borderRadius: "10px",
          background: "#1bff23",
          color: "#000000",
        },
      });
    } catch (e) {
      setLoadingButtonYaLanjutkan(false);
      toast.error("Server error", {
        position: "top-center",
        iconTheme: {
          primary: "#ff5959",
          secondary: "#fff",
        },
        style: {
          borderRadius: "10px",
          background: "#ff3131",
          color: "#fff",
        },
      });
    }
  };

  const openModalPas = () => {
    setErrors([]);
    setOpenModalPasien(true);
  };

  const closeModalPas = () => {
    setPasienNama("");
    setPasienTelepon("");
    setOpenModalPasien(false);
  };

  const onChangeTab = (e) => {
    setTabKey(e.target.value);
  };

  const ambilStatePasien = (e) => {
    setPasienIdKeranjang(e);
  };

  const konfirmasiPasien = async () => {
    setErrors([]);
    setLoadingButtonKonfirmasiPasien(true);

    if (parseInt(tabKey) === 1) {
      try {
        let response = await axios.patch(`/transaksi/pasien_lama`, {
          pasien_id: pasienIdKeranjang,
        });

        var pasien_selected = transaksiPasienSelected(
          pasien,
          pasienIdKeranjang
        );

        var split = pasien_selected[0].label.split(" - ");
        var id = pasien_selected[0].value;
        var nama = split[1];

        setLoadingButtonKonfirmasiPasien(false);

        closeModalPas();
        setPasienIdKeranjang(id);
        setPasienNamaKeranjang(nama);

        toast.success(response.data.message, {
          position: "top-center",
          duration: 2000,
          iconTheme: {
            primary: "#1bff1f",
            secondary: "#000000",
          },
          style: {
            borderRadius: "10px",
            background: "#1bff23",
            color: "#000000",
          },
        });
      } catch (e) {
        setLoadingButtonKonfirmasiPasien(false);
        setErrors(e.response.data.errors);
      }
    }

    if (parseInt(tabKey) === 2) {
      try {
        let response = await axios.post(`/transaksi/pasien_baru`, {
          telepon_pasien: pasienTelepon,
          nama_pasien: pasienNama,
        });

        setLoadingButtonKonfirmasiPasien(false);
        closeModalPas();
        getPasien();
        setPasienIdKeranjang(response.data.data.id);
        setPasienNamaKeranjang(response.data.data.nama);

        toast.success(response.data.message, {
          position: "top-center",
          duration: 2000,
          iconTheme: {
            primary: "#1bff1f",
            secondary: "#000000",
          },
          style: {
            borderRadius: "10px",
            background: "#1bff23",
            color: "#000000",
          },
        });
      } catch (e) {
        setLoadingButtonKonfirmasiPasien(false);
        setErrors(e.response.data.errors);
      }
    }
  };

  const ambilStateDokter = (e) => {
    // ambil data id dan nama dokter untuk kebutuhan state
    var pasien_selected = transaksiPasienSelected(dokter, e);

    var id = pasien_selected[0].value;
    var nama = pasien_selected[0].label;

    setDokterId(id);
    setDokterNama(nama);
  };

  const onChangeTabBayar = (e) => {
    setTabKeyBayar(e.target.value);
  };

  const openModalBay = () => {
    if (pasienNamaKeranjang === "") {
      toast.error("Pasien harus dipilih atau di isi", {
        position: "top-center",
        duration: 2000,
        iconTheme: {
          primary: "#ff5959",
          secondary: "#fff",
        },
        style: {
          borderRadius: "10px",
          background: "#ff3131",
          color: "#fff",
        },
      });
    }
    if (dokterId === "") {
      toast.error("Dokter harus dipilih", {
        position: "top-center",
        duration: 2000,
        iconTheme: {
          primary: "#ff5959",
          secondary: "#fff",
        },
        style: {
          borderRadius: "10px",
          background: "#ff3131",
          color: "#fff",
        },
      });
    }
    if (pasienIdKeranjang !== "" && dokterId !== "") {
      setErrors([]);
      setNominalLama(total);
      setNominal("");
      setKembalian("-");
      setOpenModalBayar(true);
    }
  };

  const closeModalBay = () => {
    setOpenModalBayar(false);
  };

  const konfirmasiPembayaran = async (kode) => {
    setErrors([]);
    setLoadingButtonKonfirmasiPembayaran(true);

    if (parseInt(tabKeyBayar) === 1) {
      try {
        let response = await axios.patch(
          `/transaksi/konfirmasi_pembayaran_cash/${kode}`,
          {
            pasien_id: pasienIdKeranjang,
            dokter_id: dokterId,
            metode_pembayaran: 1,
            qty: listTreatmentSelected.length,
            diskon: diskon,
            diskon_harga: diskonHarga,
            ppn: ppn,
            ppn_harga: ppnHarga,
            sub_total_harga: subTotal,
            total_harga: total,
            nominal_lama: nominalLama,
            nominal: nominal.replaceAll(",", ""),
            kembalian: kembalian,
          }
        );

        setLoadingButtonKonfirmasiPembayaran(false);

        toast.success(response.data.message, {
          position: "top-center",
          duration: 2000,
          iconTheme: {
            primary: "#1bff1f",
            secondary: "#000000",
          },
          style: {
            borderRadius: "10px",
            background: "#1bff23",
            color: "#000000",
          },
        });

        closeModalBay();
        getListTreatmentSelected(kode);
        openModalPr();
      } catch (e) {
        setLoadingButtonKonfirmasiPembayaran(false);
        setErrors(e.response.data.errors);
      }
    }
    if (parseInt(tabKeyBayar) === 2) {
      try {
        let response = await axios.patch(
          `/transaksi/konfirmasi_pembayaran_bca/${kode}`,
          {
            pasien_id: pasienIdKeranjang,
            dokter_id: dokterId,
            metode_pembayaran: 2,
            qty: listTreatmentSelected.length,
            diskon: diskon,
            diskon_harga: diskonHarga,
            ppn: ppn,
            ppn_harga: ppnHarga,
            sub_total_harga: subTotal,
            total_harga: total,
            nominal_lama: nominalLama,
            nominal: total,
            kembalian: 0,
          }
        );

        setLoadingButtonKonfirmasiPembayaran(false);

        toast.success(response.data.message, {
          position: "top-center",
          duration: 2000,
          iconTheme: {
            primary: "#1bff1f",
            secondary: "#000000",
          },
          style: {
            borderRadius: "10px",
            background: "#1bff23",
            color: "#000000",
          },
        });

        closeModalBay();
        getListTreatmentSelected(kode);
        openModalPr();
      } catch (e) {
        console.log(e.response);
      }
    }
    if (parseInt(tabKeyBayar) === 3) {
      try {
        let response = await axios.patch(
          `/transaksi/konfirmasi_pembayaran_non_bca/${kode}`,
          {
            pasien_id: pasienIdKeranjang,
            dokter_id: dokterId,
            metode_pembayaran: 3,
            qty: listTreatmentSelected.length,
            diskon: diskon,
            diskon_harga: diskonHarga,
            ppn: ppn,
            ppn_harga: ppnHarga,
            sub_total_harga: subTotal,
            total_harga: total,
            nominal_lama: nominalLama,
            nominal: total,
            kembalian: 0,
          }
        );

        setLoadingButtonKonfirmasiPembayaran(false);

        toast.success(response.data.message, {
          position: "top-center",
          duration: 2000,
          iconTheme: {
            primary: "#1bff1f",
            secondary: "#000000",
          },
          style: {
            borderRadius: "10px",
            background: "#1bff23",
            color: "#000000",
          },
        });

        closeModalBay();
        getListTreatmentSelected(kode);
        openModalPr();
      } catch (e) {
        console.log(e.response);
      }
    }
    if (parseInt(tabKeyBayar) === 4) {
      try {
        let response = await axios.patch(
          `/transaksi/konfirmasi_pembayaran_transfer/${kode}`,
          {
            pasien_id: pasienIdKeranjang,
            dokter_id: dokterId,
            metode_pembayaran: 4,
            qty: listTreatmentSelected.length,
            diskon: diskon,
            diskon_harga: diskonHarga,
            ppn: ppn,
            ppn_harga: ppnHarga,
            sub_total_harga: subTotal,
            total_harga: total,
            nominal_lama: nominalLama,
            nominal: total,
            kembalian: 0,
          }
        );

        setLoadingButtonKonfirmasiPembayaran(false);

        toast.success(response.data.message, {
          position: "top-center",
          duration: 2000,
          iconTheme: {
            primary: "#1bff1f",
            secondary: "#000000",
          },
          style: {
            borderRadius: "10px",
            background: "#1bff23",
            color: "#000000",
          },
        });

        closeModalBay();
        getListTreatmentSelected(kode);
        openModalPr();
      } catch (e) {
        console.log(e.response);
      }
    }
  };

  const openModalPr = () => {
    setOpenModalPrint(true);
  };

  const closeModalPr = () => {
    setOpenModalPrint(false);
  };

  const transaksiLagi = () => {
    setListTreatmentSelected([]);
    setPasien([]);
    setDokter([]);
    setDokterId("");
    setDokterNama("");
    setPasienNama("");
    setPasienTelepon("");
    setPasienIdKeranjang("");
    setPasienNamaKeranjang("");
    setKode("");
    setTime("");
    setDiskonTransaksi(0);
    setSubTotal(0);
    setDiskon(0);
    setDiskonHarga(0);
    setPpnHarga(0);
    setTotal(0);
    setTabKey(1);
    setTabKeyBayar(1);
    setNominalLama(0);
    setNominal("");
    setKembalian("-");
    setNamaKasirStruk("");
    setNominalStruk(0);
    setKembalianStruk(0);
    setMetodePembayaranIdStruk(0);

    getKodeDanTime();
    getPasien();
    getDokter();
    closeModalPr();

    toast.success("Transaksi selesai", {
      position: "top-center",
      duration: 2000,
      iconTheme: {
        primary: "#1bff1f",
        secondary: "#000000",
      },
      style: {
        borderRadius: "10px",
        background: "#1bff23",
        color: "#000000",
      },
    });
  };

  const onChangeRange = (e) => {
    setRangeModal(e.target.value);
  };

  return (
    <Div className="c-content">
      <div className="c-content-list">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col mb-2">
                <Input
                  placeholder="Cari nama treatment"
                  width={100}
                  onChange={(e) => {
                    setName(e.target.value);
                    setTreatment([]);
                    setLimit(16);
                    setOffset(0);
                    return;
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {treatment.length > 0 ? (
            <div id="scrollableDiv" className="row-list">
              <InfiniteScroll
                dataLength={treatment.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={<h5 style={{ textAlign: "center" }}>Loading...</h5>}
                scrollableTarget="scrollableDiv"
                style={{
                  overflow: "none",
                }}
              >
                <div className="row">
                  {treatment.map((t, index) => {
                    return (
                      <div
                        className="col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-4"
                        key={index}
                        onClick={() =>
                          selectTreatment(t.id, t.nama, t.harga, kode)
                        }
                      >
                        <div
                          className="card card-treatment"
                          width={100}
                          onClick={(e) => clickCurrentCard(e)}
                        >
                          {/* <div
                            className="c-image"
                            width={100}
                            height={90}
                            style={
                              t.gambar !== null
                                ? { backgroundColor: "white" }
                                : {
                                    backgroundColor: `hsla(${
                                      Math.random() * 360
                                    }, 100%, 50%, 1)`,
                                  }
                            }
                          >
                            {t.gambar !== null ? (
                              <img
                                src={
                                  process.env.REACT_APP_URL_API +
                                  "/gambar/treatment/" +
                                  t.gambar
                                }
                                alt="gambar"
                              />
                            ) : (
                              <div
                                style={{
                                  height: "110px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <h1
                                  style={{
                                    fontWeight: "bold",
                                  }}
                                >
                                  {getTheFirstLetter(t.nama)}
                                </h1>
                              </div>
                            )}
                          </div> */}
                          <div className="c-price-container py-2">
                            <span
                              className="c-price"
                              style={{
                                width: "100%",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "20px",
                                  lineHeight: "20px",
                                  margin: "5px 0",
                                  textAlign: "center",
                                  fontWeight: "500",
                                }}
                              >
                                {t.nama}
                              </p>
                              <div
                                style={{
                                  fontSize: "13px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  margin: "15px 0 25px 0",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "14px",
                                  }}
                                >
                                  {formatNumber(t.harga[0].value)}
                                </div>
                                {t.harga.length > 1 ? (
                                  <div
                                    className="badge badge-pill badge-secondary"
                                    style={{
                                      backgroundColor: "#12b0a2",
                                    }}
                                  >
                                    Range
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </span>
                            <span>
                              <AiFillCheckCircle className="c-price-icon" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </InfiniteScroll>
            </div>
          ) : (
            <div className="col">
              <div
                style={{
                  height: "77vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="text-center">
                  <img src={logo} alt="Data tidak tersedia" width="100" />
                  <h6 className="mt-2">Treatment tidak tersedia</h6>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="c-sidebar-right">
        <div className="c-sidebar-right-header">
          <div className="row">
            <div className="col">
              <input type="hidden" value={pasienIdKeranjang} />
              <Input
                type="text"
                placeholder="Pasien"
                width={100}
                value={pasienNamaKeranjang}
                readOnly
                onClick={() => openModalPas()}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
            <div className="col">
              <Select
                showSearch
                width={100}
                className="c-ant-select"
                placeholder="Cari dokter"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input.toUpperCase())
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                // allowClear
                value={dokterId === "" ? null : dokterId}
                onChange={(e) => ambilStateDokter(e)}
                options={dokter}
              />
            </div>
          </div>
        </div>
        <div className="c-sidebar-right-body py-4">
          <div className="no-transaksi mb-3">
            <div
              className="id"
              style={{
                fontSize: "13px",
              }}
            >
              Kode: <b style={{ fontSize: "13px" }}>{kode}</b>
            </div>
            <div
              className="date"
              style={{
                fontSize: "13px",
              }}
            >
              Tgl: {formatDateHuman(time)}
            </div>
          </div>
          <div className="product-list-selected" id="product-list-selected">
            {listTreatmentSelected.length > 0 ? (
              <table
                className="table"
                width={100}
                style={{
                  marginBottom: "50px",
                }}
              >
                <tbody>
                  {listTreatmentSelected.map((ls, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            width: "10%",
                            paddingLeft: 0,
                            paddingRight: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                padding: "0 5px 0 3px",
                              }}
                            >
                              <BsFillTrashFill
                                style={{ color: "red" }}
                                onClick={() => {
                                  setOpenModalEditPerTreatment(false);
                                  hapusPerTreatment(ls.id, ls.nama, kode);
                                }}
                              />
                            </div>
                            <div
                              className="product-list-selected-count"
                              style={{
                                fontSize: "13px",
                              }}
                            >
                              {ls.qty}
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: 0,
                          }}
                          onClick={() =>
                            openModalEditPerTreat(
                              ls.id,
                              ls.nama,
                              ls.harga_satuan,
                              ls.qty,
                              ls.diskon,
                              ls.note
                            )
                          }
                        >
                          <table
                            style={{
                              width: "100%",
                            }}
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    paddingBottom: 0,
                                    paddingRight: 0,
                                    fontSize: "13px",
                                    border: "1px solid transparent",
                                  }}
                                >
                                  {ls.nama}
                                </td>
                                <td
                                  style={{
                                    paddingBottom: 0,
                                    paddingRight: "5px",
                                    float: "right",
                                    fontSize: "13px",
                                    border: "1px solid transparent",
                                  }}
                                >
                                  {formatNumberNoRp(ls.harga_satuan)}
                                </td>
                              </tr>

                              {ls.diskon_harga !== 0 ? (
                                <tr>
                                  <td
                                    style={{
                                      paddingTop: 0,
                                      paddingBottom: 0,
                                      paddingRight: 0,
                                      fontSize: "13px",
                                      border: "1px solid transparent",
                                      color: "#12B0A2",
                                    }}
                                  >
                                    {ls.diskon !== 0
                                      ? `Diskon ${ls.diskon}%`
                                      : ""}
                                  </td>
                                  <td
                                    style={{
                                      paddingTop: 0,
                                      paddingBottom: 0,
                                      paddingRight: "5px",
                                      float: "right",
                                      fontSize: "13px",
                                      border: "1px solid transparent",
                                      color: "#12B0A2",
                                    }}
                                  >
                                    -{formatNumberNoRp(ls.diskon_harga)}
                                  </td>
                                </tr>
                              ) : (
                                ""
                              )}
                              {ls.note ? (
                                <tr>
                                  <td
                                    style={{
                                      paddingBottom: "5px",
                                      paddingTop: "5px",
                                      paddingRight: 0,
                                      fontSize: "11px",
                                      border: "1px solid transparent",
                                      color: "#ff0000",
                                    }}
                                  >
                                    <b style={{ fontSize: "11px" }}>Note :</b>{" "}
                                    {ls.note}
                                  </td>
                                  <td
                                    style={{
                                      paddingBottom: 0,
                                      paddingRight: "5px",
                                      float: "right",
                                      fontSize: "13px",
                                      border: "1px solid transparent",
                                    }}
                                  ></td>
                                </tr>
                              ) : (
                                ""
                              )}
                              <tr>
                                <td></td>
                                <td
                                  colSpan={2}
                                  style={{
                                    paddingTop: 0,
                                    paddingBottom: "5px",
                                    paddingRight: "5px",
                                    float: "right",
                                    fontSize: "13px",
                                    border: "1px solid transparent",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {formatNumberNoRp(ls.total_harga)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="text-center">
                  <img
                    src={logo}
                    alt="Belum ada treatment dipilih"
                    width={55}
                  />
                  <h6
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Keranjang kosong!
                  </h6>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="c-price-total">
          <table className="table table-borderless table-sm mb-2">
            <thead>
              <tr>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  SubTotal
                </td>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  {formatNumberNoRp(subTotal)}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  PPN ({ppn}%)
                </td>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  {formatNumberNoRp(ppnHarga)}
                </td>
              </tr>
              <tr className="c-diskon-transaksi">
                <td
                  align="right"
                  style={{ fontSize: "13px", padding: "2px", color: "#12B0A2" }}
                >
                  {diskon !== 0 ? `Diskon (${diskon}%)` : ""}
                </td>
                <td
                  align="right"
                  style={{ fontSize: "13px", padding: "2px", color: "#12B0A2" }}
                >
                  {diskonHarga !== 0 ? `-${formatNumberNoRp(diskonHarga)}` : ""}
                </td>
              </tr>

              <tr>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  <b>TOTAL</b>
                </td>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  <b>{formatNumberNoRp(total)}</b>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="c-icon-tambahan">
            {listTreatmentSelected.length > 0 ? (
              <Dropdown
                menu={{
                  items,
                }}
                placement="top"
                arrow
              >
                <BsFillHandThumbsUpFill
                  style={{
                    color: "#12B0A2",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                />
              </Dropdown>
            ) : (
              <BsFillHandThumbsDownFill
                style={{
                  color: "#FF4D4F",
                  fontSize: "16px",
                  cursor: "not-allowed",
                }}
              />
            )}
          </div>
        </div>
        <div className="c-sidebar-right-footer">
          <Button
            type="primary"
            danger
            style={{
              borderRadius: "15px",
              padding: "5px 40px",
              boxShadow: "none",
              backgroundColor: "#FF4D4F",
              border: "1px solid #FF4D4F",
              color: "white",
            }}
            onClick={() => openModalHapusTrans(kode)}
            disabled={listTreatmentSelected.length > 0 ? false : true}
          >
            HAPUS
          </Button>

          <Button
            type="primary"
            danger
            style={{
              borderRadius: "15px",
              padding: "5px 40px",
              boxShadow: "none",
              backgroundColor: "#12B0A2",
              border: "1px solid #12B0A2",
              color: "white",
            }}
            onClick={() => openModalBay()}
            disabled={listTreatmentSelected.length > 0 ? false : true}
          >
            BAYAR
          </Button>
        </div>

        <div
          className="c-sidebar-right-humbergur"
          onClick={() => sidebarRightShow()}
        >
          <AiOutlineAlignRight
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {/* --------------------------------- */}
      <Modal
        title={<h4>{namaRangeModal}</h4>}
        open={openModalRangeHarga}
        onCancel={() => closeModalRangeHar()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button
                style={{
                  borderRadius: "15px",
                }}
                onClick={() => closeModalRangeHar()}
              >
                Kembali
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#12B0A2",
                  border: "1px solid #12B0A2",
                  borderRadius: "15px",
                }}
                onClick={() =>
                  masukanKeKeranjang(
                    idRangeModal,
                    namaRangeModal,
                    kodeRangeModal,
                    qtyModal, //-----------------------------------
                    diskonModal, //-------------------------------
                    noteModal //-----------------------------
                  )
                }
                loading={loadingButtonMasukanKeKeranjang}
              >
                Masukan ke keranjang
              </Button>
            </Space>
          </Space>,
        ]}
      >
        <div className="form-group row pt-4">
          <label className="col-sm-2 col-form-label pt-0 pb-0">
            <b>Harga</b>
          </label>
          <div className="col-sm-10">
            <Radio.Group onChange={onChangeRange} value={rangeModal}>
              {hargaRangeModal.map((hrm, index) => {
                return (
                  <Radio key={index} value={hrm.value}>
                    {formatNumber(hrm.value)}
                  </Radio>
                );
              })}
            </Radio.Group>
            {errors.param === "harga" ? (
              <small className="form-text" style={{ color: "red" }}>
                {errors.msg}
              </small>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">
            <b>Qty</b>
          </label>
          <div
            className="col-sm-10"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <Button
                type="primary"
                danger
                style={{
                  fontWeight: "bold",
                }}
                disabled={qtyModal <= 1 ? true : false}
                onClick={() => setQtyModal(qtyModal - 1)}
              >
                -
              </Button>
            </span>
            <span
              style={{
                width: "100%",
                padding: "0 7px",
              }}
            >
              <Form.Item
                validateStatus={errors.param === "qty" ? "error" : ""}
                help={errors.param === "qty" ? errors.msg : ""}
                style={{ marginBottom: 0 }}
              >
                <Input
                  disabled
                  value={qtyModal}
                  style={{ color: "black" }}
                  onChange={(e) => setQtyModal(e.target.value)}
                />
              </Form.Item>
            </span>
            <span>
              <Button
                type="primary"
                style={{
                  fontWeight: "bold",
                }}
                onClick={() => setQtyModal(qtyModal + 1)}
              >
                +
              </Button>
            </span>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">
            <b>Diskon</b>
          </label>
          <div
            className="col-sm-10"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "100%",
                paddingRight: "7px",
              }}
            >
              <Form.Item
                validateStatus={errors.param === "diskon" ? "error" : ""}
                help={errors.param === "diskon" ? errors.msg : ""}
                style={{ marginBottom: 0 }}
              >
                <Input
                  value={diskonModal}
                  style={{ color: "black" }}
                  onChange={(e) => setDiskonModal(e.target.value)}
                />
              </Form.Item>
            </span>
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              %
            </span>
          </div>
        </div>
        <div className="form-group row pb-4">
          <label className="col-sm-2 col-form-label">
            <b>Note</b>
          </label>
          <div
            className="col-sm-10"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "100%",
              }}
            >
              <Form.Item
                // validateStatus={
                //   errors.param === "diskon_per_treatment" ? "error" : ""
                // }
                // help={errors.param === "diskon_per_treatment" ? errors.msg : ""}
                style={{ marginBottom: 0 }}
              >
                <Input
                  value={noteModal}
                  style={{ color: "black" }}
                  onChange={(e) => setNoteModal(e.target.value)}
                />
              </Form.Item>
            </span>
          </div>
        </div>
      </Modal>
      {/* ---------------------------------- */}

      <Modal
        title={<h5>{namaPerTreatment}</h5>}
        open={openModalEditPerTreatment}
        onCancel={() => closeModalEditPerTreat()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#12B0A2",
                  border: "1px solid #12B0A2",
                  borderRadius: "15px",
                }}
                onClick={() => konfirmasiPerTreatment(idPerTreatment, kode)}
                loading={loadingButtonKonfirmasi}
              >
                Konfirmasi
              </Button>
            </Space>
          </Space>,
        ]}
      >
        <div className="pt-4 pb-2">
          <input type="hidden" value={idPerTreatment} />
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              <b>Harga</b>
            </label>
            <div
              className="col-sm-10"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: "30px",
                }}
              >
                Rp.
              </span>
              <span
                style={{
                  width: "100%",
                }}
              >
                <Form.Item
                  validateStatus={
                    errors.param === "harga_per_treatment" ? "error" : ""
                  }
                  help={
                    errors.param === "harga_per_treatment" ? errors.msg : ""
                  }
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    disabled
                    value={hargaPerTreatment}
                    style={{ color: "black" }}
                  />
                </Form.Item>
              </span>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              <b>Qty</b>
            </label>
            <div
              className="col-sm-10"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                <Button
                  type="primary"
                  danger
                  style={{
                    fontWeight: "bold",
                  }}
                  disabled={qtyPerTreatment <= 1 ? true : false}
                  onClick={() => setQtyPerTreatment(qtyPerTreatment - 1)}
                >
                  -
                </Button>
              </span>
              <span
                style={{
                  width: "100%",
                  padding: "0 7px",
                }}
              >
                <Form.Item
                  validateStatus={
                    errors.param === "qty_per_treatment" ? "error" : ""
                  }
                  help={errors.param === "qty_per_treatment" ? errors.msg : ""}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    disabled
                    value={qtyPerTreatment}
                    style={{ color: "black" }}
                    onChange={(e) => setQtyPerTreatment(e.target.value)}
                  />
                </Form.Item>
              </span>
              <span>
                <Button
                  type="primary"
                  style={{
                    fontWeight: "bold",
                  }}
                  onClick={() => setQtyPerTreatment(qtyPerTreatment + 1)}
                >
                  +
                </Button>
              </span>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              <b>Diskon</b>
            </label>
            <div
              className="col-sm-10"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: "100%",
                  paddingRight: "7px",
                }}
              >
                <Form.Item
                  validateStatus={
                    errors.param === "diskon_per_treatment" ? "error" : ""
                  }
                  help={
                    errors.param === "diskon_per_treatment" ? errors.msg : ""
                  }
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    value={diskonPerTreatment}
                    style={{ color: "black" }}
                    onChange={(e) => setDiskonPerTreatment(e.target.value)}
                  />
                </Form.Item>
              </span>
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                %
              </span>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              <b>Note</b>
            </label>
            <div
              className="col-sm-10"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: "100%",
                }}
              >
                <Form.Item>
                  <Input
                    value={notePerTreatment}
                    style={{ color: "black" }}
                    onChange={(e) => setNotePerTreatment(e.target.value)}
                  />
                </Form.Item>
              </span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={<h5>Diskon Transaksi</h5>}
        open={openModalDiskonTransaksi}
        onCancel={() => closeModalDiskonTrans()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button
                style={{
                  borderRadius: "15px",
                }}
                onClick={() => closeModalDiskonTrans()}
              >
                Kembali
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#12B0A2",
                  border: "1px solid #12B0A2",
                  borderRadius: "15px",
                }}
                onClick={() => konfirmasiDiskonTransaksi(kode)}
                loading={loadingButtonKonfirmasi}
              >
                Konfirmasi
              </Button>
            </Space>
          </Space>,
        ]}
      >
        <div className="pt-4 pb-2">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              <b>Diskon</b>
            </label>
            <div
              className="col-sm-10"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: "100%",
                  paddingRight: "7px",
                }}
              >
                <Form.Item
                  validateStatus={
                    errors.param === "diskon_transaksi" ? "error" : ""
                  }
                  help={errors.param === "diskon_transaksi" ? errors.msg : ""}
                >
                  <Input
                    value={diskonTransaksi}
                    style={{ color: "black" }}
                    onChange={(e) => setDiskonTransaksi(e.target.value)}
                  />
                </Form.Item>
              </span>
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                %
              </span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={<h5>Apa kamu yakin?</h5>}
        open={openModalHapusTransaksi}
        onCancel={() => closeModalHapusTrans()}
        centered
        width={400}
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button
                style={{
                  borderRadius: "15px",
                }}
                onClick={() => closeModalHapusTrans()}
              >
                Tidak
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#12B0A2",
                  border: "1px solid #12B0A2",
                  borderRadius: "15px",
                }}
                onClick={() => hapusTransaksi(kode)}
                loading={loadingButtonYaLanjutkan}
              >
                Ya, lanjutkan
              </Button>
            </Space>
          </Space>,
        ]}
      >
        Ingin menghapus transaksi <b>{kode}</b> ?
      </Modal>

      <Modal
        title={<h5>Input Pasien</h5>}
        open={openModalPasien}
        onCancel={() => closeModalPas()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button
                style={{
                  borderRadius: "15px",
                }}
                onClick={() => closeModalPas()}
              >
                Kembali
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#12B0A2",
                  border: "1px solid #12B0A2",
                  borderRadius: "15px",
                }}
                onClick={() => konfirmasiPasien()}
                loading={loadingButtonKonfirmasiPasien}
              >
                Konfirmasi
              </Button>
            </Space>
          </Space>,
        ]}
      >
        <Radio.Group
          onChange={onChangeTab}
          value={tabKey}
          style={{
            display: "block",
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          <Radio value={1}>Pasien</Radio>
          <Radio value={2}>Pasien Baru</Radio>
        </Radio.Group>

        {tabKey === 1 ? (
          <div>
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              className="c-ant-select"
              placeholder="Cari pasien"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input.toUpperCase())
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              value={pasienIdKeranjang === "" ? null : pasienIdKeranjang}
              options={pasien}
              onChange={(e) => ambilStatePasien(e)}
            />
            {errors.param === "pasien_id" ? (
              <small
                className="form-text"
                style={{ color: "red", fontSize: "14px" }}
              >
                {errors.msg}
              </small>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        {tabKey === 2 ? (
          <div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">
                <b>Nama</b>
              </label>
              <div className="col-sm-10">
                <Form.Item
                  validateStatus={errors.param === "nama_pasien" ? "error" : ""}
                  help={errors.param === "nama_pasien" ? errors.msg : ""}
                >
                  <Input
                    value={pasienNama}
                    style={{ color: "black" }}
                    onChange={(e) => setPasienNama(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">
                <b>Telepon</b>
              </label>
              <div className="col-sm-10">
                <Form.Item
                  validateStatus={
                    errors.param === "telepon_pasien" ? "error" : ""
                  }
                  help={errors.param === "telepon_pasien" ? errors.msg : ""}
                >
                  <Input
                    value={pasienTelepon}
                    style={{ color: "black" }}
                    onChange={(e) => setPasienTelepon(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </Modal>

      <Modal
        title={<h5>Pembayaran</h5>}
        open={openModalBayar}
        onCancel={() => closeModalBay()}
        centered
        closable={false}
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button
                style={{
                  borderRadius: "15px",
                }}
                onClick={() => closeModalBay()}
              >
                Kembali
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#12B0A2",
                  border: "1px solid #12B0A2",
                  borderRadius: "15px",
                }}
                onClick={() => konfirmasiPembayaran(kode)}
                loading={loadingButtonKonfirmasiPembayaran}
              >
                Lanjutkan
              </Button>
            </Space>
          </Space>,
        ]}
      >
        <h3
          style={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Rp. {formatNumberNoRp(total)}
        </h3>
        <Radio.Group
          onChange={onChangeTabBayar}
          value={tabKeyBayar}
          style={{
            display: "block",
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          <Radio value={1}>Cash</Radio>
          <Radio value={2}>BCA</Radio>
          <Radio value={3}>Non BCA (3% Charge)</Radio>
          <Radio value={4}>Transfer</Radio>
        </Radio.Group>

        {tabKeyBayar === 1 ? (
          <div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">
                <b
                  style={{
                    float: "right",
                  }}
                >
                  Nominal
                </b>
              </label>
              <div className="col-sm-9">
                <input type="hidden" value={nominalLama} />
                <Input
                  style={{ color: "black" }}
                  onChange={(e) => {
                    var cek = e.target.value
                      .replaceAll(",", "")
                      .replaceAll(" ", "");

                    var kembalian = parseInt(cek) - parseInt(total);
                    if (e.target.value === "") {
                      setKembalian("-");
                    } else {
                      setKembalian(kembalian);
                    }

                    return setNominal(formatNumberNoRp(cek));
                  }}
                  value={nominal}
                />
                {errors.param === "nominal" ? (
                  <small
                    className="form-text"
                    style={{ color: "red", fontSize: "14px", float: "left" }}
                  >
                    {errors.msg}
                  </small>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">
                <b
                  style={{
                    float: "right",
                  }}
                >
                  Kembalian
                </b>
              </label>
              <div className="col-sm-9">
                <Input
                  style={{ color: "black" }}
                  value={formatNumberNoRp(kembalian)}
                  readOnly
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {tabKeyBayar === 2 ? <div style={{ textAlign: "center" }}>-</div> : ""}
        {tabKeyBayar === 3 ? (
          <h4 style={{ textAlign: "center" }}>
            {formatNumberNoRp(Math.floor((total * 3) / 100 + total))}
          </h4>
        ) : (
          ""
        )}
        {tabKeyBayar === 4 ? <div style={{ textAlign: "center" }}>-</div> : ""}
      </Modal>

      <Modal
        title={<h5>Kwitansi Pembayaran</h5>}
        open={openModalPrint}
        centered
        closable={false}
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <ReactToPrint
                trigger={() => {
                  return (
                    <Button
                      style={{
                        borderRadius: "15px",
                      }}
                    >
                      Print
                    </Button>
                  );
                }}
                content={() => ref.current}
                onBeforePrint={() =>
                  // (document.title = `${kode}-${pasienNamaKeranjang}`)
                  (document.title = `KWITANSI-${pasienNamaKeranjang}`)
                }
                onAfterPrint={() => (document.title = "adadental")}
                pageStyle={() => `
                                @media print {
                                    .available-print {
                                        display: block !important;
                                        font-size: 40px !important;
                                    }
                                    .available-header{
                                      display: flex !important;
                                      justify-content: space-between !important;
                                      font-size: 40px !important;
                                      height: 100px !important;
                                    }
                                    th,td{
                                      font-size: 30px !important;
                                    }
                                    .available-print-catatan {
                                        display: block !important;
                                        font-size: 25px !important;
                                        margin-top: 30px !important;
                                    }
                                    .not-available-print{
                                      display: none !important;
                                    }
                                }
                                @page { margin: 100px !important; }
                            `}
              />
              <Button
                type="primary"
                style={{
                  backgroundColor: "#12B0A2",
                  border: "1px solid #12B0A2",
                  borderRadius: "15px",
                }}
                onClick={() => transaksiLagi()}
              >
                Transaksi lagi
              </Button>
            </Space>
          </Space>,
        ]}
      >
        <div className="my-4" ref={ref}>
          <div
            className="row available-header"
            style={{ display: "none", marginBottom: "80px" }}
          >
            <div className="col">
              <img src={logo_adadental} alt="logo" width={150} />
            </div>
            <div className="col">
              <p style={{ fontSize: "30px", float: "right" }}>
                <span style={{ fontWeight: "bold", fontSize: "30px" }}>
                  ADA Dental
                </span>{" "}
                <br />
                +6285772282795
              </p>
            </div>
          </div>
          <h1 className="available-print mb-5" style={{ display: "none" }}>
            Kwitansi Pembayaran
          </h1>
          <table className="table table-sm table-borderless">
            <thead>
              <tr>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    width: "15%",
                  }}
                >
                  Kode
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    width: "5%",
                    textAlign: "center",
                  }}
                >
                  :
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                  }}
                >
                  {kode}
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    textAlign: "right",
                  }}
                >
                  Pasien
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    width: "5%",
                    textAlign: "center",
                  }}
                >
                  :
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    textAlign: "right",
                    width: "auto",
                  }}
                >
                  {pasienNamaKeranjang}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                  }}
                >
                  Tanggal
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  :
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                  }}
                >
                  {formatDateHuman(time)}
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    textAlign: "right",
                  }}
                >
                  Dokter
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  :
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    textAlign: "right",
                    width: "auto",
                  }}
                >
                  {dokterNama}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={4}
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    paddingBottom: "10px",
                    textAlign: "right",
                  }}
                >
                  Kasir
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    paddingBottom: "10px",
                    textAlign: "center",
                  }}
                >
                  :
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    paddingBottom: "10px",
                    textAlign: "right",
                  }}
                >
                  {namaKasirStruk}
                </td>
              </tr>
            </thead>
          </table>
          <hr
            style={{
              color: "#aeaeae",
              margin: 0,
            }}
          />
          <table
            className="table table-sm table-borderless"
            style={{
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "10%",
                  }}
                >
                  Qty
                </th>
                <th>Treatment</th>
                <th
                  style={{
                    textAlign: "right",
                    paddingRight: 0,
                  }}
                >
                  Harga
                </th>
              </tr>
            </thead>
            <tbody>
              {listTreatmentSelected.map((ls, index) => {
                return (
                  <tr key={index} style={{ borderTop: "1px solid #E5E5E5" }}>
                    <td
                      style={{
                        width: "5%",
                        paddingLeft: "5px",
                        paddingRight: 0,
                      }}
                    >
                      {ls.qty}
                    </td>
                    <td
                      style={{
                        padding: 0,
                      }}
                      colSpan={2}
                    >
                      <table
                        style={{
                          width: "100%",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                paddingBottom: 0,
                                paddingRight: 0,
                                fontSize: "13px",
                                border: "1px solid transparent",
                              }}
                            >
                              {ls.nama}
                            </td>
                            <td
                              style={{
                                paddingBottom: 0,
                                paddingRight: 0,
                                float: "right",
                                fontSize: "13px",
                                border: "1px solid transparent",
                              }}
                            >
                              {formatNumber(ls.harga_satuan)}
                            </td>
                          </tr>
                          {ls.diskon_harga !== 0 ? (
                            <tr>
                              <td
                                style={{
                                  paddingTop: 0,
                                  paddingBottom: 0,
                                  paddingRight: 0,
                                  fontSize: "13px",
                                  border: "1px solid transparent",
                                  color: "#12B0A2",
                                }}
                              >
                                {ls.diskon !== 0 ? `Diskon ${ls.diskon}%` : ""}
                              </td>
                              <td
                                style={{
                                  paddingTop: 0,
                                  paddingBottom: 0,
                                  paddingRight: 0,
                                  float: "right",
                                  fontSize: "13px",
                                  border: "1px solid transparent",
                                  color: "#12B0A2",
                                }}
                              >
                                Rp. -{formatNumberNoRp(ls.diskon_harga)}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}
                          {ls.note ? (
                            <tr
                              className="not-available-print"
                              style={{ display: "block" }}
                            >
                              <td
                                style={{
                                  paddingBottom: "5px",
                                  paddingTop: "5px",
                                  paddingRight: 0,
                                  fontSize: "11px",
                                  border: "1px solid transparent",
                                  color: "#ff0000",
                                }}
                              >
                                <b style={{ fontSize: "11px" }}>Note :</b>{" "}
                                {ls.note}
                              </td>
                              <td
                                style={{
                                  paddingBottom: 0,
                                  paddingRight: "5px",
                                  float: "right",
                                  fontSize: "13px",
                                  border: "1px solid transparent",
                                }}
                              ></td>
                            </tr>
                          ) : (
                            ""
                          )}
                          <tr>
                            <td></td>
                            <td
                              colSpan={2}
                              style={{
                                paddingTop: 0,
                                paddingBottom: "10px",
                                paddingRight: 0,
                                float: "right",
                                fontSize: "13px",
                                border: "1px solid transparent",
                                fontWeight: "bold",
                              }}
                            >
                              {formatNumber(ls.total_harga)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <hr
            style={{
              color: "#aeaeae",
              margin: "0 0 10px 0",
            }}
          />
          <table className="table table-borderless table-sm mb-2">
            <thead>
              <tr>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  SubTotal
                </td>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  {formatNumber(subTotal)}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  PPN ({ppn}%)
                </td>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  {formatNumber(ppnHarga)}
                </td>
              </tr>
              <tr className="c-diskon-transaksi">
                <td
                  align="right"
                  style={{ fontSize: "13px", padding: "2px", color: "#12B0A2" }}
                >
                  {diskon !== 0 ? `Diskon (${diskon}%)` : ""}
                </td>
                <td
                  align="right"
                  style={{ fontSize: "13px", padding: "2px", color: "#12B0A2" }}
                >
                  {diskonHarga !== 0
                    ? `Rp. -${formatNumberNoRp(diskonHarga)}`
                    : ""}
                </td>
              </tr>

              {metodePembayaranIdStruk === 3 ? (
                <tr>
                  <td
                    align="right"
                    style={{ fontSize: "13px", padding: "2px" }}
                  >
                    Non BCA
                  </td>
                  <td
                    align="right"
                    style={{ fontSize: "13px", padding: "2px" }}
                  >
                    {formatNumber(nominalStruk)}
                  </td>
                </tr>
              ) : (
                ""
              )}
              <tr>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  {metodePembayaranIdStruk === 1 ? `Cash` : ""}
                  {metodePembayaranIdStruk === 2 ? `BCA` : ""}
                  {metodePembayaranIdStruk === 3 ? `Non BCA (3% Charge)` : ""}
                  {metodePembayaranIdStruk === 4 ? `Transfer` : ""}
                </td>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  {metodePembayaranIdStruk === 3
                    ? `${formatNumber(Math.floor((nominalStruk * 3) / 100))}`
                    : `${formatNumber(nominalStruk)}`}
                </td>
              </tr>
              <tr>
                <td
                  align="right"
                  style={{
                    fontSize: "13px",
                    padding: "2px",
                    fontWeight: "bold",
                  }}
                >
                  TOTAL
                </td>
                <td
                  align="right"
                  style={{
                    fontSize: "13px",
                    padding: "2px",
                    fontWeight: "bold",
                  }}
                >
                  {/* {formatNumber(total)} */}
                  {metodePembayaranIdStruk === 3
                    ? formatNumber(Math.floor(total + (total * 3) / 100))
                    : formatNumber(total)}
                </td>
              </tr>
              <tr>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  Kembali
                </td>
                <td align="right" style={{ fontSize: "13px", padding: "2px" }}>
                  {formatNumber(kembalianStruk)}
                </td>
              </tr>
              {/* <tr>
                <td
                  align="right"
                  style={{
                    fontSize: "13px",
                    padding: "2px",
                    fontWeight: "bold",
                  }}
                >
                  TOTAL AKHIR
                </td>
                <td
                  align="right"
                  style={{
                    fontSize: "13px",
                    padding: "2px",
                    fontWeight: "bold",
                  }}
                >
                  {metodePembayaranIdStruk === 3
                    ? formatNumber(Math.floor(total + (total * 3) / 100))
                    : formatNumber(total)}
                </td>
              </tr> */}
            </tbody>
          </table>

          <p className="available-print-catatan" style={{ display: "none" }}>
            Catatan: <br />
            Transaksi yang telah dilakukan tidak dapat dibatalkan oleh pihak
            manapun
          </p>
        </div>
      </Modal>
    </Div>
  );
}

const Div = styled.div`
  .c-content-list {
    width: 100%;
  }
  .c-sidebar-right {
    width: 300px;
    height: 100vh;
    position: fixed;
    right: 0;
    top: 0;
    background-color: white;
    transform: translate(300px, 0);
    transition: all 0.5s;
    padding: 80px 10px 10px 10px;
  }
  .row-list {
    max-height: 77vh;
    overflow-y: scroll;
    padding: 10px 15px;
    width: 100%;
  }
  .row-list::-webkit-scrollbar {
    width: 5px;
    background-color: #d0fff4;
    border-radius: 5px;
  }
  .row-list::-webkit-scrollbar-thumb {
    background-color: #12b0a2;
    border-radius: 5px;
  }
  .no-transaksi {
    display: flex;
    justify-content: space-between;
  }
  .product-list-selected {
    height: calc(50vh - 10px);
    overflow-y: scroll;
  }
  .product-list-selected::-webkit-scrollbar {
    width: 5px;
    background-color: #d0fff4;
  }
  .product-list-selected::-webkit-scrollbar-thumb {
    background-color: #12b0a2;
    border-radius: 5px;
  }
  .product-list-selected-count {
    background-color: #ffc107;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-weight: bold;
  }
  .product-list-selected .table tr:hover {
    background-color: #d0fff4;
    cursor: pointer;
  }
  .c-sidebar-right.show {
    transform: translate(0, 0) !important;
  }
  .c-sidebar-right-humbergur {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: #12b0a2;
    position: absolute;
    left: -55px;
    bottom: 15px;
  }
  .c-price-total {
    position: absolute;
    height: 18vh;
    bottom: 40px;
    left: 0;
    right: 0;
    padding: 5px 10px 0 0;
    border-top: 1px solid rgb(226, 226, 226);
    background-color: white;
  }
  .c-icon-tambahan {
    position: absolute;
    top: 5px;
    left: 5px;
    height: 20px;
    width: 20px;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .c-sidebar-right-footer {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 10px;
    display: flex;
    justify-content: space-around;
    background-color: white;
  }
  .card-treatment {
    background-color: white;
    box-shadow: 1px 1px 5px #cecece;
    transform: scale(1);
    transition: all 0.5s !important;
    height: 100%;
  }
  .card-treatment:hover {
    cursor: pointer;
    transform: scale(1);
    box-shadow: 1px 1px 20px #ababab;
  }
  .card-treatment:hover .c-price-icon {
    transform: scale(1);
  }
  .card-treatment.active {
    transform: scale(1);
    box-shadow: 1px 1px 20px #ababab;
  }
  .card-treatment.active .c-price-icon {
    transform: scale(1);
  }
  .c-image {
    text-align: center;
    border-radius: 10px 10px 0 0;
  }
  .c-image img {
    width: 100%;
    height: 110px;
    border-radius: 10px 10px 0 0;
  }
  .c-price-container {
    display: flex;
    justify-content: space-between;
    margin: 0 5px;
  }
  .c-price-icon {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 25px;
    transform: scale(0);
    transition: all 0.5s;
    color: #12b0a2;
  }
  .c-ant-select .ant-select-selector {
    width: 125px !important;
  }

  /* responsive */
  @media (min-width: 768px) {
    .c-content-list {
      width: calc(100% - 300px);
    }
    .c-sidebar-right {
      transform: translate(0, 0);
    }
    .c-sidebar-right-humbergur {
      display: none;
    }
    .card-treatment:hover {
      transform: scale(1.1);
    }
    .card-treatment:hover .c-price-icon {
      transform: scale(1);
    }
    .card-treatment.active {
      transform: scale(1.1);
    }
    .card-treatment.active .c-price-icon {
      transform: scale(1);
    }
  }
`;
