import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "../../../interceptor/axios";
import { formatDateHuman, formatNumberNoRp } from "../../../helpers";
import logo from "../../../img/doctor.png";

import { Button, Modal, Space } from "antd";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function TransaksiPending() {
  const [transaksi, setTransaksi] = useState([]);

  const [listTreatmentSelected, setListTreatmentSelected] = useState([]);

  const [kode, setKode] = useState("");
  const [tgl, setTgl] = useState("");
  const [kasir, setKasir] = useState("");

  const [openModalHapusTransaksi, setOpenModalHapusTransaksi] = useState(false);

  const [subTotal, setSubTotal] = useState(0);
  const [diskon, setDiskon] = useState(0);
  const [diskonHarga, setDiskonHarga] = useState(0);
  const [ppn] = useState(11);
  const [ppnHarga, setPpnHarga] = useState(0);
  const [total, setTotal] = useState(0);

  const { user } = useSelector((state) => state.auth);

  const [loadingButtonYaLanjutkan, setLoadingButtonYaLanjutkan] =
    useState(false);

  useEffect(() => {
    getTransaksiPending();
  }, []);

  const getTransaksiPending = async () => {
    let response = await axios.get("/transaksi_pending");
    setTransaksi(response.data.data);
  };

  const detailTransaksi = async (kode) => {
    let response = await axios.get(`/transaksi/list_treatment/${kode}`);

    setKode(response.data.data_transaksi.kode_transaksies);
    setTgl(response.data.data_transaksi.timestamp);
    setKasir(response.data.data_transaksi.nama_kasir);

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
    var ppn_harga = Math.floor((sub_total_2 * ppn) / 100);
    setPpnHarga(ppn_harga);

    // hitung total
    var total =
      sub_total_2 + ppn_harga - response.data.data_transaksi.diskon_harga;
    setTotal(total);
  };

  const openModalHapusTrans = (kode) => {
    setKode(kode);
    setOpenModalHapusTransaksi(true);
  };

  const closeModalHapusTrans = () => {
    setOpenModalHapusTransaksi(false);
  };

  const hapusTransaksi = async (kode_trans) => {
    setLoadingButtonYaLanjutkan(true);

    try {
      let response = await axios.delete(`/transaksi/${kode_trans}`);

      setListTreatmentSelected([]);
      getTransaksiPending();
      closeModalHapusTrans();

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

  return (
    <Div className="c-content">
      <div className="c-content-header">
        <div>
          <h4>Transaksi Pending</h4>
          <p>Semua Transaksi Pending</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-7 mb-3">
          <div className="card">
            <div className="card-body">
              {transaksi.length > 0 ? (
                <div
                  className="product-list-selected"
                  id="product-list-selected"
                >
                  <table
                    className="table"
                    width={100}
                    style={{
                      marginBottom: "50px",
                    }}
                  >
                    <thead>
                      <tr>
                        <td>
                          <b>Qty</b>
                        </td>
                        <td>
                          <b>Kode Transaksi</b>
                        </td>
                        <td align="right">
                          <b>Kasir</b>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {transaksi.map((t, index) => {
                        return (
                          <tr
                            key={index}
                            onClick={() => detailTransaksi(t.kode_transaksies)}
                          >
                            <td
                              style={{
                                width: "5%",
                                paddingLeft: "5px",
                                paddingRight: 0,
                              }}
                            >
                              <div
                                className="product-list-selected-count"
                                style={{
                                  fontSize: "13px",
                                }}
                              >
                                {t.qty}
                              </div>
                            </td>
                            <td>
                              <div>{t.kode_transaksies}</div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "bold",
                                  marginTop: "2px",
                                }}
                              >
                                {formatDateHuman(t.timestamp)}
                              </div>
                            </td>
                            <td align="right">
                              <div>{t.nama}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div className="text-center">
                    <img
                      src={logo}
                      alt="Tidak ada transaksi pending"
                      width={55}
                    />
                    <h6
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Tidak ada transaksi pending
                    </h6>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-5 mb-3">
          <div className="card">
            {transaksi.length > 0 ? (
              <div className="card-body">
                {listTreatmentSelected.length > 0 ? (
                  <div>
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
                              width: "auto",
                            }}
                          >
                            Kasir : {kasir}
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
                            {formatDateHuman(tgl)}
                          </td>
                        </tr>
                      </thead>
                    </table>

                    <table className="table" width={100}>
                      <tbody>
                        {listTreatmentSelected.map((ls, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{
                                  width: "5%",
                                  paddingLeft: "5px",
                                  paddingRight: 0,
                                }}
                              >
                                <div
                                  className="product-list-selected-count"
                                  style={{
                                    fontSize: "13px",
                                  }}
                                >
                                  {ls.qty}
                                </div>
                              </td>
                              <td
                                style={{
                                  padding: 0,
                                }}
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

                    <div className="c-price-total">
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
                              {formatNumberNoRp(subTotal)}
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
                              {formatNumberNoRp(ppnHarga)}
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
                                ? `-${formatNumberNoRp(diskonHarga)}`
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td
                              align="right"
                              style={{ fontSize: "13px", padding: "2px" }}
                            >
                              <b>TOTAL</b>
                            </td>
                            <td
                              align="right"
                              style={{ fontSize: "13px", padding: "2px" }}
                            >
                              <b>{formatNumberNoRp(total)}</b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="c-tombol-footer">
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
                      >
                        HAPUS
                      </Button>

                      {user.role !== "admin" ? (
                        <NavLink
                          to={`/transaksi/${kode}`}
                          type="primary"
                          danger="true"
                          style={{
                            borderRadius: "15px",
                            padding: "5px 40px",
                            boxShadow: "none",
                            backgroundColor: "#12B0A2",
                            border: "1px solid #12B0A2",
                            color: "white",
                            textDecoration: "none",
                          }}
                        >
                          LANJUTKAN
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
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
                )}
              </div>
            ) : (
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
                    <img src={logo} alt="Tidak ada data" width={55} />
                    <h6
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Tidak ada data
                    </h6>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </Div>
  );
}

const Div = styled.div`
  .product-list-selected {
    height: calc(65vh - 10px);
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
  .product-list-selected .table tbody tr:hover {
    background-color: #d0fff4;
    cursor: pointer;
  }
  .c-price-total {
    border-top: 1px solid #dee2e6;
    padding-top: 10px;
  }
  .c-tombol-footer {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    padding-top: 10px;
  }
`;
