import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "../../../interceptor/axios";
import logo from "../../../img/doctor.png";
import logo_adadental from "../../../img/new-logo.png";

// dayjs
import dayjs from "dayjs";

// ant
import { Button, DatePicker, Space, Modal, Input } from "antd";

// datatable
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

// toast
import toast from "react-hot-toast";

import {
  formatNumberNoRp,
  formatDateHuman,
  formatNumber,
} from "../../../helpers";

import jsPDF from "jspdf";
// eslint-disable-next-line
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";

import ReactToPrint from "react-to-print";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function Laporan() {
  const ref = useRef();
  const doc = new jsPDF();

  // datatable
  const [laporan, setLaporan] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [transaksiDetail, setTransaksiDetail] = useState(null);
  const [listTreatmentSelected, setListTreatmentSelected] = useState([]);

  const [subTotal, setSubTotal] = useState(0);
  const [diskon, setDiskon] = useState(0);
  const [diskonHarga, setDiskonHarga] = useState(0);
  const [ppn] = useState(11);
  const [ppnHarga, setPpnHarga] = useState(0);
  const [total, setTotal] = useState(0);

  const [namaKasirStruk, setNamaKasirStruk] = useState("");
  const [namaPasienStruk, setNamaPasienStruk] = useState("");
  const [nominalStruk, setNominalStruk] = useState(0);
  const [kembalianStruk, setKembalianStruk] = useState(0);
  const [metodePembayaranIdStruk, setMetodePembayaranIdStruk] = useState(0);

  const [id, setId] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [loadingButtonEdit, setLoadingButtonEdit] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [openModalPrint, setOpenModalPrint] = useState(false);

  useEffect(() => {
    setDateFrom(dateNow());
    setDateTo(dateNow());
  }, []);

  useEffect(() => {
    getLaporan();

    // eslint-disable-next-line
  }, [page, perPage]);

  const onRangeChange = (dates, dateStrings) => {
    setDateFrom(dateStrings[0]);
    setDateTo(dateStrings[1]);
  };
  const rangePresets = [
    {
      label: "Hari ini",
      value: [dayjs().add(-0, "d"), dayjs()],
    },
    // {
    //   label: "Yesterday",
    //   value: [dayjs().add(-1, "d"), dayjs().add(-1, "d")],
    // },
    // {
    //   label: "Last 7 Days",
    //   value: [dayjs().add(-6, "d"), dayjs()],
    // },
    {
      label: "Bulan ini",
      value: [dayjs().startOf("month"), dayjs().endOf("month")],
    },
    {
      label: "30 hari terakhir",
      value: [dayjs().add(-29, "d"), dayjs()],
    },
    // {
    //   label: "Last Month",
    //   value: [
    //     dayjs().subtract(1, "month").startOf("month"),
    //     dayjs().subtract(1, "month").endOf("month"),
    //   ],
    // },
  ];
  const dateNow = () => {
    var a = new Date();
    var m = a.getMonth() + 1;
    var d = a.getDate();
    var mts = m.toString();
    var dts = d.toString();

    var resMonth = mts.length < 2 ? `${0}${mts}` : mts;
    var resDate = dts.length < 2 ? `${0}${dts}` : dts;

    var now = `${a.getFullYear()}-${resMonth}-${resDate}`;

    return now;
  };

  const getLaporan = async () => {
    var ft = dateFrom === "" ? dateNow() : dateFrom;
    var tt = dateTo === "" ? dateNow() : dateTo;

    let response = await axios.get(`/laporan?ft=${ft}&tt=${tt}`);
    setLaporan(response.data.data);
  };

  // datatable
  const columns = [
    // {
    //   dataField: "no",
    //   text: "No",
    //   align: "center",
    //   formatter: (cell, row, rowIndex, formatExtraData) => {
    //     let num = (page - 1) * perPage + (rowIndex + 1);
    //     return num;
    //   },
    //   style: {
    //     fontSize: "14px",
    //   },
    // },
    {
      dataField: "kode_transaksies",
      text: "Kode transaksi",
      sort: true,
      filter: textFilter(),
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "tgl",
      text: "Tanggal",
      sort: true,
      filter: textFilter(),
      formatter: (cellContent, row) => {
        return row.tgl;
      },
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "pasien",
      text: "Pasien",
      sort: true,
      filter: textFilter(),
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "treatment",
      text: "Treatment",
      sort: true,
      filter: textFilter(),
      formatter: (cellContent, row) => {
        var split_treatment = row.treatment.split(",");
        if (split_treatment.length > 1) {
          return (
            <div>
              {split_treatment.map((s, index) => {
                return index === split_treatment.length - 1 ? (
                  <span key={index}>{s}</span>
                ) : (
                  <span key={index}>
                    {s}, <br />
                  </span>
                );
              })}
            </div>
          );
        } else {
          return row.treatment;
        }
      },
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "qty",
      text: "Qty",
      sort: true,
      filter: textFilter(),
      formatter: (cellContent, row) => {
        var split_qty = row.qty.split(",");
        if (split_qty.length > 1) {
          return (
            <div>
              {split_qty.map((s, index) => {
                return index === split_qty.length - 1 ? (
                  <span key={index}>{s}</span>
                ) : (
                  <span key={index}>
                    {s}, <br />
                  </span>
                );
              })}
            </div>
          );
        } else {
          return row.qty;
        }
      },
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "total_pembayaran",
      text: "Total pembayaran",
      sort: true,
      filter: textFilter(),
      formatter: (cellContent, row) => {
        return row.metode_pembayaran_id === 3
          ? formatNumberNoRp(
              row.total_pembayaran +
                Math.floor((row.total_pembayaran * 3) / 100)
            )
          : formatNumberNoRp(row.total_pembayaran);
      },
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "metode_pembayaran",
      text: "Metode pembayaran",
      sort: true,
      filter: textFilter(),
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "kasir",
      text: "Kasir",
      sort: true,
      filter: textFilter(),
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "keterangan",
      text: "Keterangan",
      sort: true,
      filter: textFilter(),
      formatter: (cellContent, row) => {
        return row.keterangan !== null ? row.keterangan : "";
      },
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "opsi",
      text: "Opsi",
      formatter: (cellContent, row) => {
        return (
          <div className="d-flex">
            <Button
              size="small"
              style={{
                backgroundColor: "#12B0A2",
                color: "white",
                border: "#12B0A2",
                marginRight: "2px",
              }}
              onClick={() => modalBukaEdit(row.id, row.keterangan)}
            >
              Ket
            </Button>
            <Button
              size="small"
              onClick={() => openModalPr(row.kode_transaksies)}
            >
              Detail
            </Button>
          </div>
        );
      },
    },
  ];
  // const tableRowEvents = {
  //   onClick: (e, row, rowIndex) => {
  //     openModalPr(row.kode_transaksies);
  //   },
  // };

  const customTotal = (from, to, size) => {
    return (
      <span className="react-bootstrap-table-pagination-total">
        Menampilkan {from} sampai {to} dari {size} hasil
      </span>
    );
  };

  const options = {
    firstPageText: "<<",
    prePageText: "<",
    nextPageText: ">",
    lastPageText: ">>",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    onPageChange: (page) => {
      setPage(page);
    },
    onSizePerPageChange: (pageQty) => {
      setPerPage(pageQty);
    },
    sizePerPageList: [
      {
        text: "10",
        value: 10,
      },
      {
        text: "20",
        value: 20,
      },
      {
        text: "30",
        value: 30,
      },
      {
        text: "50",
        value: 50,
      },
    ],
  };

  const cari = () => {
    if (dateFrom === "" || dateTo === "") {
      toast.error("Tanggal tidak boleh kosong", {
        position: "top-right",
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
    } else {
      getLaporan();
    }
  };

  const ExportToPDF = (dateFrom, dateTo, laporan) => {
    if (dateFrom === "" || dateTo === "") {
      return toast.error("Tanggal tidak boleh kosong", {
        position: "top-right",
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

    if (laporan.length > 0) {
      var columns = [
        "Tanggal",
        "Pasien",
        "Treatment",
        "Qty",
        "diskon",
        "Charge",
        "dokter",
        "Total pembayaran",
        "Metode pembayaran",
        "keterangan",
      ];
      var rows = [];
      for (var i = 0; i < laporan.length; i++) {
        let charge;
        if (laporan[i].metode_pembayaran_id === 3) {
          charge = Math.floor((laporan[i].total_pembayaran * 3) / 100);
        } else {
          charge = 0;
        }

        var total_pem =
          laporan[i].metode_pembayaran_id === 3
            ? formatNumberNoRp(
                laporan[i].total_pembayaran +
                  Math.floor((laporan[i].total_pembayaran * 3) / 100)
              )
            : formatNumberNoRp(laporan[i].total_pembayaran);

        var split_treatment = laporan[i].treatment.split(",");
        let treat = " ";
        if (split_treatment.length > 1) {
          for (var st = 0; st < split_treatment.length; st++) {
            if (st === split_treatment.length - 1) {
              treat += `${split_treatment[st]}`;
            } else {
              treat += `${split_treatment[st]},\n`;
            }
          }
        } else {
          treat = ` ${laporan[i].treatment}`;
        }

        var qty_treatment = laporan[i].qty.split(",");
        let qt = " ";
        if (qty_treatment.length > 1) {
          for (var q = 0; q < qty_treatment.length; q++) {
            if (q === qty_treatment.length - 1) {
              qt += `${formatNumberNoRp(qty_treatment[q])}`;
            } else {
              qt += `${formatNumberNoRp(qty_treatment[q])},\n`;
            }
          }
        } else {
          qt = ` ${laporan[i].qty}`;
        }

        rows.push([
          laporan[i].tgl,
          laporan[i].pasien,
          treat,
          qt,
          formatNumberNoRp(laporan[i].diskon_harga),
          formatNumberNoRp(charge),
          laporan[i].dokter,
          total_pem,
          laporan[i].metode_pembayaran,
          laporan[i].keterangan,
        ]);
      }

      doc.autoTable(columns, rows, {
        styles: {
          cellPadding: 0.5,
          fontSize: 8,
        },
        margin: { left: 5, right: 5 },
        startY:
          doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 0 : 25,
        showHead: "firstPage",
        didDrawPage: function (data) {
          // Footer
          var str = "Halaman " + doc.internal.getNumberOfPages();

          if (doc.internal.getNumberOfPages() === 1) {
            // Header
            doc.setFontSize(10);
            doc.setTextColor(90);
            doc.text(`Laporan ${dateFrom} - ${dateTo}`, 75, 20);
          }

          // jsPDF 1.4+ uses getWidth, <1.4 uses .width
          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          doc.setFontSize(8);
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        },
      });
      doc.save(`laporan_${dateFrom}_${dateTo}.pdf`);
    } else {
      toast.error(`Tidak ada data di tanggal ${dateFrom} - ${dateTo}`, {
        position: "top-right",
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

  const ExportToExcel = (dateFrom, dateTo, laporan) => {
    if (dateFrom === "" || dateTo === "") {
      return toast.error("Tanggal tidak boleh kosong", {
        position: "top-right",
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

    if (laporan.length > 0) {
      const title = [{ A: `LAPORAN ${dateFrom} - ${dateTo}` }, { A: "" }];

      let table = [
        {
          A: "Tanggal",
          B: "Pasien",
          C: "Treatment",
          D: "Qty",
          E: "Diskon",
          F: "Charge",
          G: "Dokter",
          H: "Total pembayaran",
          I: "Metode pembayaran",
          J: "Keterangan",
        },
      ];

      for (var i = 0; i < laporan.length; i++) {
        let charge;
        if (laporan[i].metode_pembayaran_id === 3) {
          charge = Math.floor((laporan[i].total_pembayaran * 3) / 100);
        } else {
          charge = 0;
        }

        var total_pem =
          laporan[i].metode_pembayaran_id === 3
            ? formatNumberNoRp(
                laporan[i].total_pembayaran +
                  Math.floor((laporan[i].total_pembayaran * 3) / 100)
              )
            : formatNumberNoRp(laporan[i].total_pembayaran);

        var split_treatment = laporan[i].treatment.split(",");
        let treat = " ";
        if (split_treatment.length > 1) {
          for (var st = 0; st < split_treatment.length; st++) {
            if (st === split_treatment.length - 1) {
              treat += `${split_treatment[st]}`;
            } else {
              treat += `${split_treatment[st]} - \n`;
            }
          }
        } else {
          treat = ` ${laporan[i].treatment}`;
        }

        var qty_treatment = laporan[i].qty.split(",");
        let qt = " ";
        if (qty_treatment.length > 1) {
          for (var q = 0; q < qty_treatment.length; q++) {
            if (q === qty_treatment.length - 1) {
              qt += `${formatNumberNoRp(qty_treatment[q])}`;
            } else {
              qt += `${formatNumberNoRp(qty_treatment[q])} - \n`;
            }
          }
        } else {
          qt = ` ${laporan[i].qty}`;
        }

        table.push({
          A: laporan[i].tgl,
          B: laporan[i].pasien,
          C: treat,
          D: qt,
          E: formatNumberNoRp(laporan[i].diskon_harga),
          F: formatNumberNoRp(charge),
          G: laporan[i].dokter,
          H: total_pem,
          I: laporan[i].metode_pembayaran,
          J: laporan[i].keterangan,
        });
      }

      const finalData = [...title, ...table];

      var wb = XLSX.utils.book_new();
      var ws = XLSX.utils.json_to_sheet(finalData, {
        skipHeader: true,
      });

      ws["A1"].s = {
        // border: {
        //   right: {
        //     style: "thin",
        //     color: "000000",
        //   },
        //   left: {
        //     style: "thin",
        //     color: "000000",
        //   },
        //   top: {
        //     style: "thin",
        //     color: "000000",
        //   },
        //   bottom: {
        //     style: "thin",
        //     color: "000000",
        //   },
        // },
        font: { bold: true },
      };
      ws["A3"].s = {
        font: { bold: true },
      };
      ws["B3"].s = {
        font: { bold: true },
      };
      ws["C3"].s = {
        font: { bold: true },
      };
      ws["D3"].s = {
        font: { bold: true },
      };
      ws["E3"].s = {
        font: { bold: true },
      };
      ws["F3"].s = {
        font: { bold: true },
      };
      ws["G3"].s = {
        font: { bold: true },
      };
      ws["H3"].s = {
        font: { bold: true },
      };
      ws["I3"].s = {
        font: { bold: true },
      };
      ws["J3"].s = {
        font: { bold: true },
      };

      XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
      XLSX.writeFile(wb, `laporan_${dateFrom}_${dateTo}.xlsx`);
    } else {
      toast.error(`Tidak ada data di tanggal ${dateFrom} - ${dateTo}`, {
        position: "top-right",
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

  const getListTreatmentSelected = async (kode) => {
    let response = await axios.get(`/laporan/${kode}`);

    var res = response.data.data_transaksi_treatment;
    setListTreatmentSelected(res);
    setTransaksiDetail(response.data.data_transaksi);

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
    var ppn_harga = Math.floor((sub_total_2 * ppn) / 100);
    setPpnHarga(ppn_harga);

    // hitung total
    var total =
      sub_total_2 + ppn_harga - response.data.data_transaksi.diskon_harga;
    setTotal(total);

    // masukan data untuk kebutuhan state struk
    if (res.length > 0) {
      setNamaKasirStruk(response.data.data_transaksi.nama_kasir);
      setNamaPasienStruk(response.data.data_transaksi.nama_pasien);

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
  };

  const modalBukaEdit = (id, keterangan) => {
    setOpenEdit(true);

    setId(id);
    setKeterangan(keterangan);
  };

  const modalTutupEdit = () => {
    setId("");
    setKeterangan("");

    setOpenEdit(false);
  };

  const editKeterangan = async () => {
    setLoadingButtonEdit(true);
    try {
      let response = await axios.patch(`/keterangan/${id}`, {
        keterangan: keterangan !== "" ? keterangan : null,
      });

      getLaporan();
      modalTutupEdit();

      setLoadingButtonEdit(false);
      toast.success(response.data.message, {
        position: "top-right",
        duration: 4000,
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
    } catch (error) {
      toast.error("Server error", {
        position: "top-right",
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
      setLoadingButtonEdit(false);
    }
  };

  const openModalPr = (kode_transaksies) => {
    setOpenModalPrint(true);

    getListTreatmentSelected(kode_transaksies);
  };

  const closeModalPr = () => {
    setOpenModalPrint(false);
  };

  return (
    <Div className="c-content">
      <div className="row">
        <div className="col">
          <h4>Laporan</h4>
          <p>Laporan transaksi</p>
        </div>
        <div className="col"></div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-xl-5 col-lg-5 col-md-5 col-sm mb-2">
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <RangePicker
                      style={{ height: "32px", width: "100%" }}
                      presets={rangePresets}
                      onChange={onRangeChange}
                      defaultValue={[
                        dayjs(`${dateNow()}`, "YYYY-MM-DD"),
                        dayjs(`${dateNow()}`, "YYYY-MM-DD"),
                      ]}
                    />
                  </Space>
                </div>
                <div className="col-xl-1 col-lg-1 col-md-1 col-sm mb-2">
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#12B0A2",
                      color: "white",
                      border: "#12B0A2",
                    }}
                    onClick={() => cari()}
                  >
                    Cari
                  </Button>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm">
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#12B0A2",
                      color: "white",
                      border: "#12B0A2",
                      float: "right",
                    }}
                    onClick={() => ExportToExcel(dateFrom, dateTo, laporan)}
                  >
                    Export Excel
                  </Button>
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#813838",
                      color: "white",
                      border: "#813838",
                      float: "right",
                      marginRight: "5px",
                    }}
                    onClick={() => ExportToPDF(dateFrom, dateTo, laporan)}
                  >
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              {laporan.length > 0 ? (
                <BootstrapTable
                  bootstrap4
                  keyField="id"
                  data={laporan}
                  columns={columns}
                  pagination={paginationFactory(options)}
                  filter={filterFactory()}
                  striped
                  hover
                  condensed
                  filterPosition="top"
                  wrapperClasses="table-responsive"
                  // rowEvents={tableRowEvents}
                />
              ) : (
                <div
                  style={{
                    height: "40vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div className="text-center">
                    <img src={logo} alt="Data tidak tersedia" width="60" />
                    <h6 className="mt-2">Data tidak tersedia</h6>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Keterangan"
        open={openEdit}
        onCancel={() => modalTutupEdit()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button onClick={() => modalTutupEdit()}>Kembali</Button>
              <Button
                // onClick={(e) => tambahUser(e)}
                type="primary"
                loading={loadingButtonEdit}
                style={{
                  backgroundColor: "#12B0A2",
                  color: "white",
                  border: "#12B0A2",
                  marginRight: "2px",
                }}
                onClick={() => editKeterangan()}
              >
                Edit
              </Button>
            </Space>
          </Space>,
        ]}
      >
        <div className="form-group mb-2 mt-4">
          <input type="hidden" value={id} />
          <label>Keterangan</label>
          <TextArea
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            rows={4}
            placeholder="Tambahkan keterangan"
          />
        </div>
      </Modal>

      <Modal
        title={<h5>Kwitansi Pembayaran</h5>}
        open={openModalPrint}
        onCancel={() => closeModalPr()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button onClick={() => closeModalPr()}>Kembali</Button>
              <ReactToPrint
                trigger={() => {
                  return (
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "#12B0A2",
                        color: "white",
                        border: "#12B0A2",
                        marginRight: "2px",
                      }}
                    >
                      Print
                    </Button>
                  );
                }}
                content={() => ref.current}
                onBeforePrint={() =>
                  (document.title = `KWITANSI-${namaPasienStruk}`)
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
            </Space>
          </Space>,
        ]}
      >
        <div className="my-4" ref={ref}>
          <div className="my-4">
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
                    {transaksiDetail && transaksiDetail.kode_transaksies}
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
                    {transaksiDetail && transaksiDetail.nama_pasien}
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
                    {transaksiDetail &&
                      formatDateHuman(transaksiDetail.timestamp)}
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
                    {transaksiDetail && transaksiDetail.nama_dokter}
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
                                {formatNumber(ls.harga_satuan * ls.qty)}
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
                  <td
                    align="right"
                    style={{ fontSize: "13px", padding: "2px" }}
                  >
                    SubTotal
                  </td>
                  <td
                    align="right"
                    style={{ fontSize: "13px", padding: "2px" }}
                  >
                    {formatNumber(subTotal)}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    align="right"
                    style={{ fontSize: "13px", padding: "2px" }}
                  >
                    PPN ({ppn}%)
                  </td>
                  <td
                    align="right"
                    style={{ fontSize: "13px", padding: "2px" }}
                  >
                    {formatNumber(ppnHarga)}
                  </td>
                </tr>
                <tr className="c-diskon-transaksi">
                  <td
                    align="right"
                    style={{
                      fontSize: "13px",
                      padding: "2px",
                      color: "#12B0A2",
                    }}
                  >
                    {diskon !== 0 ? `Diskon (${diskon}%)` : ""}
                  </td>
                  <td
                    align="right"
                    style={{
                      fontSize: "13px",
                      padding: "2px",
                      color: "#12B0A2",
                    }}
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
                  <td
                    align="right"
                    style={{ fontSize: "13px", padding: "2px" }}
                  >
                    {metodePembayaranIdStruk === 1 ? `Cash` : ""}
                    {metodePembayaranIdStruk === 2 ? `BCA` : ""}
                    {metodePembayaranIdStruk === 3 ? `Non BCA (3% Charge)` : ""}
                    {metodePembayaranIdStruk === 4 ? `Transfer` : ""}
                  </td>
                  <td
                    align="right"
                    style={{ fontSize: "13px", padding: "2px" }}
                  >
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
                    {metodePembayaranIdStruk === 3
                      ? formatNumber(Math.floor(total + (total * 3) / 100))
                      : formatNumber(total)}
                  </td>
                </tr>
                <tr>
                  <td
                    align="right"
                    style={{ fontSize: "13px", padding: "2px" }}
                  >
                    Kembali
                  </td>
                  <td
                    align="right"
                    style={{ fontSize: "13px", padding: "2px" }}
                  >
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
        </div>
      </Modal>
    </Div>
  );
}

const Div = styled.div`
  .ant-picker:hover {
    border-color: #12b0a2 !important;
  }
  .ant-picker-active-bar {
    background: #12b0a2 !important;
  }
  .ant-picker-focused {
    border-color: #12b0a2 !important;
  }
  .react-bootstrap-table tr:hover {
    cursor: pointer !important;
  }
  .pagination {
    float: right !important;
  }
`;
