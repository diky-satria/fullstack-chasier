import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { Button, DatePicker, Space, Modal } from "antd";
import toast from "react-hot-toast";
import ApexChart from "react-apexcharts";
import axios from "../../interceptor/axios";
import {
  formatNumberNoRp,
  formatNumber,
  formatDateHuman,
} from "../../helpers/index";
import logo from "../../img/doctor.png";
import logo_adadental from "../../img/new-logo.png";

// datatable
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const { RangePicker } = DatePicker;

export default function Dashboard() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [chartLabel, setChartLabel] = useState([]);

  const [topTreatment, setTopTreatment] = useState([]);

  const [tanggal, setTanggal] = useState("");

  const [openModalDetail, setOpenModalDetail] = useState(false);

  // datatable
  const [laporan, setLaporan] = useState([]);
  // eslint-disable-next-line
  const [page, setPage] = useState(1);
  // eslint-disable-next-line
  const [perPage, setPerPage] = useState(5);

  const [totalPerHari, setTotalPerHari] = useState(0);

  // selected transaksi in modal
  const [transaksiDetail, setTransaksiDetail] = useState(null);
  const [listTreatmentSelected, setListTreatmentSelected] = useState([]);

  const [subTotal, setSubTotal] = useState(0);
  const [diskon, setDiskon] = useState(0);
  const [diskonHarga, setDiskonHarga] = useState(0);
  const [ppn] = useState(11);
  const [ppnHarga, setPpnHarga] = useState(0);
  const [total, setTotal] = useState(0);

  const [namaKasirStruk, setNamaKasirStruk] = useState("");
  // eslint-disable-next-line
  const [namaPasienStruk, setNamaPasienStruk] = useState("");
  const [nominalStruk, setNominalStruk] = useState(0);
  const [kembalianStruk, setKembalianStruk] = useState(0);
  const [metodePembayaranIdStruk, setMetodePembayaranIdStruk] = useState(0);
  // end selected transaksi in modal

  useEffect(() => {
    setDateFrom(dateNow());
    setDateTo(dateNow());
  }, []);

  useEffect(() => {
    getDetail();
    // eslint-disable-next-line
  }, []);

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

  const getDetail = async () => {
    var ft = dateFrom === "" ? dateNow() : dateFrom;
    var tt = dateTo === "" ? dateNow() : dateTo;

    let response = await axios.get(`/dashboard?ft=${ft}&tt=${tt}`);

    setChartData(response.data.data_chart);
    setChartLabel(response.data.label_chart);
    setTopTreatment(response.data.top_treatment);

    setLoading(false);
  };

  const cari = () => {
    setLoading(true);
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
      setLoading(false);
    } else {
      getDetail();
    }
  };

  const lineData = {
    series: chartData,
    options: {
      noData: {
        text: "Data tidak tersedia",
        align: "center",
        verticalAlign: "middle",
      },
      chart: {
        width: 350,
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: true,
            zoomout: true,
            pan: false,
            reset: true,
            customIcons: [],
          },
          autoSelected: "zoom",
        },
        events: {
          click: function (event, chartContext, config) {
            let seriesIndex = config.seriesIndex;
            let seriesName = config.globals.seriesNames[seriesIndex];
            let pointIndex = config.dataPointIndex;
            let tanggal = config.globals.categoryLabels[pointIndex];

            if (seriesIndex < 0 || !tanggal || !seriesName) {
              console.log("DATA KOSONG");
            } else {
              // alert(`${seriesIndex}, ${seriesName}, ${tanggal}`);
              openModalPas(tanggal);
            }
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        dashArray: [0, 0],
        width: 2,
      },
      markers: {
        size: 4,
        shape: ["circle"],
        hover: {
          size: 4,
        },
      },
      colors: ["rgb(251, 0, 0)", "rgb(18,176,162)"],
      title: {
        text: "Visualisasi data",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "rgb(83,88,117)",
        },
      },
      xaxis: {
        type: "category",
        categories: chartLabel,
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return formatNumberNoRp(value);
          },
        },
        // opposite: true,
      },
    },
  };

  const openModalPas = async (tanggal) => {
    setTanggal(tanggal);
    setOpenModalDetail(true);

    let response = await axios.get(`/dashboard/${tanggal}`);
    setLaporan(response.data.data);
    setTotalPerHari(response.data.pendapatan_perhari);
  };

  const closeModalPas = () => {
    setListTreatmentSelected([]);
    setOpenModalDetail(false);
  };

  // datatable
  const columns = [
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
      dataField: "qty",
      text: "Qty",
      sort: true,
      filter: textFilter(),
      formatter: (cellContent, row) => {
        return formatNumberNoRp(row.qty);
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
        textAlign: "right",
      },
    },
  ];
  const tableRowEvents = {
    onClick: (e, row, rowIndex) => {
      getListTreatmentSelected(row.kode_transaksies);
    },
  };

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
        text: "5",
        value: 5,
      },
    ],
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

  const randomColor = () => {
    var rc = "#";
    for (var i = 0; i < 6; i++) {
      rc += Math.floor(Math.random() * 16).toString(16);
    }
    return rc;
  };

  return (
    <Div className="c-content">
      <div className="row">
        <div className="col">
          <h4>Dashboard</h4>
          <p>Overview</p>
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
                    loading={loading}
                    onClick={() => cari()}
                  >
                    Cari
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-9 col-xl-9 col-md-9 col-sm-12 mb-4">
          <div className="card">
            <div className="card-body">
              <ApexChart
                series={lineData.series}
                options={lineData.options}
                type="line"
                height={350}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xl-3 col-md-3 col-sm-12 mb-4">
          <div className="card" style={{ height: "100%" }}>
            <div className="card-header custom">Top Treatments</div>
            <div className="card-body custom">
              {topTreatment.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {topTreatment.map((tt, index) => {
                    return (
                      <li
                        className="list-group-item custom"
                        id={`topTreatment${index}`}
                        key={index}
                      >
                        <span>
                          {tt.nama.length > 20
                            ? tt.nama.substring(0, 20) + "..."
                            : tt.nama}
                        </span>
                        <span
                          style={{
                            color: `${randomColor()}`,
                            fontWeight: "bold",
                          }}
                        >
                          {tt.qty}
                        </span>
                        <Tooltip
                          anchorId={`topTreatment${index}`}
                          content={`${tt.nama} - ${tt.qty}`}
                          place="top"
                          style={{ zIndex: 2000, backgroundColor: "#686868" }}
                        />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div
                  style={{
                    fontSize: "30px",
                    paddingTop: "15px",
                    display: "flex",
                    justifyContent: "center",
                    color: "red",
                  }}
                >
                  0
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={<h5>{tanggal}</h5>}
        className="modal-dashboard"
        open={openModalDetail}
        onCancel={() => closeModalPas()}
        centered
        width={1000}
        footer={[]}
      >
        <div className="row mt-4">
          <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12">
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
                        rowEvents={tableRowEvents}
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
                          <img
                            src={logo}
                            alt="Data tidak tersedia"
                            width="60"
                          />
                          <h6 className="mt-2">Data tidak tersedia</h6>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="card my-3">
                  <div className="card-body">
                    <div className="row justify-content-between px-3">
                      <h6>Total Pendapatan</h6>
                      <h5
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {formatNumber(totalPerHari)}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
            {listTreatmentSelected.length > 0 ? (
              <div className="card">
                <div className="card-body">
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
                  <h1
                    className="available-print mb-5"
                    style={{ display: "none" }}
                  >
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
                          <tr
                            key={index}
                            style={{ borderTop: "1px solid #E5E5E5" }}
                          >
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
                                        <b style={{ fontSize: "11px" }}>
                                          Note :
                                        </b>{" "}
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
                          {metodePembayaranIdStruk === 3
                            ? `Non BCA (3% Charge)`
                            : ""}
                          {metodePembayaranIdStruk === 4 ? `Transfer` : ""}
                        </td>
                        <td
                          align="right"
                          style={{ fontSize: "13px", padding: "2px" }}
                        >
                          {metodePembayaranIdStruk === 3
                            ? `${formatNumber(
                                Math.floor((nominalStruk * 3) / 100)
                              )}`
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
                            ? formatNumber(
                                Math.floor(total + (total * 3) / 100)
                              )
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
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-body">
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
                        alt="Silahkan pilih transaksi"
                        width={55}
                      />
                      <h6
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        Silahkan pilih transaksi
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
  .card-header.custom {
    font-weight: bold !important;
    color: #535875;
    background-color: white !important;
    border-radius: 10px 10px 0 0;
  }
  .card-body.custom {
    padding-top: 0 !important;
  }
  .list-group-item.custom {
    padding: 6px 0 !important;
    color: #373d3f !important;
    display: flex;
    justify-content: space-between;
  }
`;
