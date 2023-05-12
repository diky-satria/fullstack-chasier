import React, { useState, useEffect } from "react";
import axios from "../../../interceptor/axios.js";
import styled from "styled-components";

// datatable
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

// ant
import { Modal, Input, Form, Button, Space, Popconfirm } from "antd";
// toast
import toast from "react-hot-toast";

export default function Pasien() {
  // datatable
  const [pasien, setPasien] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // ant
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // state tambah
  const [namaTambah, setNamaTambah] = useState("");
  const [teleponTambah, setTeleponTambah] = useState("");
  const [errorsTambah, setErrorsTambah] = useState([]);

  // state edit
  const [idEdit, setIdEdit] = useState("");
  const [namaEdit, setNamaEdit] = useState("");
  const [teleponLamaEdit, setTeleponLamaEdit] = useState("");
  const [teleponEdit, setTeleponEdit] = useState("");
  const [errorsEdit, setErrorsEdit] = useState([]);

  // loading
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingButtonEdit, setLoadingButtonEdit] = useState(false);

  useEffect(() => {
    getPasien();
  }, [page, perPage]);

  const getPasien = async () => {
    let response = await axios.get("/pasien");
    setPasien(response.data.data);
  };

  // datatable
  const columns = [
    {
      dataField: "no",
      text: "No",
      align: "center",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        let num = (page - 1) * perPage + (rowIndex + 1);
        return num;
      },
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "nama",
      text: "Nama",
      sort: true,
      filter: textFilter(),
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "telepon",
      text: "Telepon",
      sort: true,
      filter: textFilter(),
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "databaseOkey",
      text: "Status",
      sort: true,
      filter: textFilter(),
      formatter: (cellContent, row) => {
        return (
          <div>
            {row.status === 0 ? (
              <span className="badge badge-pill badge-secondary">Lama</span>
            ) : (
              ""
            )}
            {row.status === 1 ? (
              <span className="badge badge-pill badge-primary">Baru</span>
            ) : (
              ""
            )}
            {row.status === 2 ? (
              <span className="badge badge-pill badge-warning">
                Belum melakukan transaksi
              </span>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      dataField: "databasePkey",
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
              onClick={() => modalBukaEdit(row.id, row.nama, row.telepon)}
            >
              Edit
            </Button>
            <Popconfirm
              placement="left"
              title={`Apa kamu yakin`}
              description={`Ingin menghapus data "${row.nama}"`}
              onConfirm={() => hapusPasien(row.id)}
              okText="Ya"
              cancelText="Tidak"
            >
              <Button type="primary" size="small" danger>
                Hapus
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

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

  const modalBukaTambah = () => {
    setOpenTambah(true);
  };

  const modalBukaEdit = (id, nama, telepon) => {
    setOpenEdit(true);

    setIdEdit(id);
    setNamaEdit(nama);
    setTeleponEdit(telepon);
    setTeleponLamaEdit(telepon);
  };

  const modalTutupTambah = () => {
    resetStateTambah();
    setOpenTambah(false);
  };

  const modalTutupEdit = () => {
    resetStateEdit();
    setOpenEdit(false);
  };

  const resetStateTambah = () => {
    setNamaTambah("");
    setTeleponTambah("");
    setErrorsTambah([]);
  };

  const resetStateEdit = () => {
    setIdEdit("");
    setNamaEdit("");
    setTeleponEdit("");
    setTeleponLamaEdit("");
    setErrorsEdit([]);
  };

  const tambahPasien = async (e) => {
    e.preventDefault();
    setLoadingButton(true);

    try {
      let response = await axios.post("/pasien", {
        nama_tambah: namaTambah,
        telepon_tambah: teleponTambah,
      });

      getPasien();

      modalTutupTambah();
      resetStateTambah();
      setLoadingButton(false);

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
    } catch (e) {
      setErrorsTambah(e.response.data.errors);
      setLoadingButton(false);
    }
  };

  const editPasien = async (id) => {
    setLoadingButtonEdit(true);

    try {
      let response = await axios.patch(`/pasien/${id}`, {
        nama_edit: namaEdit,
        telepon_lama_edit: teleponLamaEdit,
        telepon_edit: teleponEdit,
      });

      getPasien();

      modalTutupEdit();
      resetStateEdit();
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
    } catch (e) {
      setErrorsEdit(e.response.data.errors);
      setLoadingButtonEdit(false);
    }
  };

  const hapusPasien = async (id) => {
    try {
      let response = await axios.delete(`/pasien/${id}`);

      getPasien();

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
    } catch (e) {
      toast.error("Pasien ini telah digunakan di transaksi", {
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

  return (
    <Div className="c-content">
      <div className="c-content-header">
        <div>
          <h4>Pasien</h4>
          <p>Semua pasien</p>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => modalBukaTambah()}
            style={{
              backgroundColor: "#12B0A2",
              color: "white",
              border: "#12B0A2",
            }}
          >
            Tambah
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <BootstrapTable
                bootstrap4
                keyField="id"
                data={pasien}
                columns={columns}
                pagination={paginationFactory(options)}
                filter={filterFactory()}
                striped
                hover
                condensed
                filterPosition="top"
                wrapperClasses="table-responsive"
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Tambah Pasien"
        open={openTambah}
        onCancel={() => modalTutupTambah()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button onClick={() => modalTutupTambah()}>Kembali</Button>
              <Button
                onClick={(e) => tambahPasien(e)}
                type="primary"
                loading={loadingButton}
                style={{
                  backgroundColor: "#12B0A2",
                  color: "white",
                  border: "#12B0A2",
                  marginRight: "2px",
                }}
              >
                Tambah
              </Button>
            </Space>
          </Space>,
        ]}
      >
        <div className="form-group mb-2 mt-4">
          <label>Nama</label>
          <Form.Item
            validateStatus={errorsTambah.param === "nama_tambah" ? "error" : ""}
            help={errorsTambah.param === "nama_tambah" ? errorsTambah.msg : ""}
          >
            <Input
              onChange={(e) => setNamaTambah(e.target.value)}
              value={namaTambah}
            />
          </Form.Item>
        </div>
        <div className="form-group mb-2 mt-4">
          <label>Telepon</label>
          <Form.Item
            validateStatus={
              errorsTambah.param === "telepon_tambah" ? "error" : ""
            }
            help={
              errorsTambah.param === "telepon_tambah" ? errorsTambah.msg : ""
            }
          >
            <Input
              onChange={(e) => setTeleponTambah(e.target.value)}
              value={teleponTambah}
            />
          </Form.Item>
        </div>
      </Modal>

      <Modal
        title="Edit Pasien"
        open={openEdit}
        onCancel={() => modalTutupEdit()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button onClick={() => modalTutupEdit()}>Kembali</Button>
              <Button
                onClick={() => editPasien(idEdit)}
                type="primary"
                loading={loadingButtonEdit}
                style={{
                  backgroundColor: "#12B0A2",
                  color: "white",
                  border: "#12B0A2",
                  marginRight: "2px",
                }}
              >
                Edit
              </Button>
            </Space>
          </Space>,
        ]}
      >
        <Input type="hidden" value={idEdit} />
        <Input type="hidden" value={teleponLamaEdit} />

        <div className="form-group mb-2 mt-4">
          <label>Nama</label>
          <Form.Item
            validateStatus={errorsEdit.param === "nama_edit" ? "error" : ""}
            help={errorsEdit.param === "nama_edit" ? errorsEdit.msg : ""}
          >
            <Input
              onChange={(e) => setNamaEdit(e.target.value)}
              value={namaEdit}
            />
          </Form.Item>
        </div>
        <div className="form-group mb-2 mt-4">
          <label>Telepon</label>
          <Form.Item
            validateStatus={errorsEdit.param === "telepon_edit" ? "error" : ""}
            help={errorsEdit.param === "telepon_edit" ? errorsEdit.msg : ""}
          >
            <Input
              onChange={(e) => setTeleponEdit(e.target.value)}
              value={teleponEdit}
            />
          </Form.Item>
        </div>
      </Modal>
    </Div>
  );
}

const Div = styled.div`
  .pagination {
    float: right !important;
  }
`;
