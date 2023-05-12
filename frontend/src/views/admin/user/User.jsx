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

export default function User() {
  // datatable
  const [user, setUser] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // ant
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // state tambah
  const [namaTambah, setNamaTambah] = useState("");
  const [usernameTambah, setUsernameTambah] = useState("");
  const [passwordTambah, setPasswordTambah] = useState("");
  const [passwordKonfirmasiTambah, setPasswordKonfirmasiTambah] = useState("");
  const [errorsTambah, setErrorsTambah] = useState([]);

  // state edit
  const [idEdit, setIdEdit] = useState("");
  const [namaEdit, setNamaEdit] = useState("");
  const [usernameLamaEdit, setUsernameLamaEdit] = useState("");
  const [usernameEdit, setUsernameEdit] = useState("");
  const [errorsEdit, setErrorsEdit] = useState([]);

  // loading
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingButtonEdit, setLoadingButtonEdit] = useState(false);

  useEffect(() => {
    getUser();
  }, [page, perPage]);

  const getUser = async () => {
    let response = await axios.get("/user");
    setUser(response.data.data);
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
      dataField: "username",
      text: "Username",
      sort: true,
      filter: textFilter(),
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "role",
      text: "Role",
      sort: true,
      filter: textFilter(),
      style: {
        fontSize: "14px",
      },
    },
    {
      dataField: "databasePkey",
      text: "Opsi",
      formatter: (cellContent, row) => {
        // return <button className="btn btn-danger btn-xs" id={row.id}>Delete</button>
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
              onClick={() => modalBukaEdit(row.id, row.nama, row.username)}
            >
              Edit
            </Button>
            {row.role !== "admin" ? (
              <Popconfirm
                placement="left"
                title={`Apa kamu yakin`}
                description={`Ingin menghapus data "${row.nama}"`}
                onConfirm={() => hapusUser(row.id)}
                okText="Ya"
                cancelText="Tidak"
              >
                <Button type="primary" size="small" danger>
                  Hapus
                </Button>
              </Popconfirm>
            ) : (
              ""
            )}
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

  const modalBukaEdit = (id, nama, username) => {
    setOpenEdit(true);

    setIdEdit(id);
    setUsernameLamaEdit(username);
    setUsernameEdit(username);
    setNamaEdit(nama);
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
    setUsernameTambah("");
    setPasswordTambah("");
    setPasswordKonfirmasiTambah("");
    setErrorsTambah([]);
  };

  const resetStateEdit = () => {
    setIdEdit("");
    setUsernameLamaEdit("");
    setUsernameEdit("");
    setNamaEdit("");
    setErrorsEdit([]);
  };

  const tambahUser = async (e) => {
    e.preventDefault();
    setLoadingButton(true);

    try {
      let response = await axios.post("/user", {
        nama_tambah: namaTambah,
        username_tambah: usernameTambah,
        password_tambah: passwordTambah,
        konfirmasi_password_tambah: passwordKonfirmasiTambah,
      });

      getUser();

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

  const editUser = async (id) => {
    setLoadingButtonEdit(true);

    try {
      let response = await axios.patch(`/user/${id}`, {
        nama_edit: namaEdit,
        username_lama_edit: usernameLamaEdit,
        username_edit: usernameEdit,
      });

      getUser();

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

  const hapusUser = async (id) => {
    try {
      let response = await axios.delete(`/user/${id}`);

      getUser();

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
      toast.error("User ini telah digunakan di transaksi", {
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
          <h4>User</h4>
          <p>Semua user</p>
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
                data={user}
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
        title="Tambah User"
        open={openTambah}
        onCancel={() => modalTutupTambah()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button onClick={() => modalTutupTambah()}>Kembali</Button>
              <Button
                onClick={(e) => tambahUser(e)}
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
        <div className="form-group mb-2">
          <label>Username</label>
          <Form.Item
            validateStatus={
              errorsTambah.param === "username_tambah" ? "error" : ""
            }
            help={
              errorsTambah.param === "username_tambah" ? errorsTambah.msg : ""
            }
          >
            <Input
              onChange={(e) => setUsernameTambah(e.target.value)}
              value={usernameTambah}
            />
          </Form.Item>
        </div>
        <div className="form-group mb-2">
          <label>Password</label>
          <Form.Item
            validateStatus={
              errorsTambah.param === "password_tambah" ? "error" : ""
            }
            help={
              errorsTambah.param === "password_tambah" ? errorsTambah.msg : ""
            }
          >
            <Input
              type="password"
              onChange={(e) => setPasswordTambah(e.target.value)}
              value={passwordTambah}
            />
          </Form.Item>
        </div>
        <div className="form-group mb-2">
          <label>Konfirmasi Password</label>
          <Form.Item
            validateStatus={
              errorsTambah.param === "konfirmasi_password_tambah" ? "error" : ""
            }
            help={
              errorsTambah.param === "konfirmasi_password_tambah"
                ? errorsTambah.msg
                : ""
            }
          >
            <Input
              type="password"
              onChange={(e) => setPasswordKonfirmasiTambah(e.target.value)}
              value={passwordKonfirmasiTambah}
            />
          </Form.Item>
        </div>
      </Modal>

      <Modal
        title="Edit User"
        open={openEdit}
        onCancel={() => modalTutupEdit()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button onClick={() => modalTutupEdit()}>Kembali</Button>
              <Button
                onClick={() => editUser(idEdit)}
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
        <Input type="hidden" value={usernameLamaEdit} />

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
        <div className="form-group mb-2">
          <label>Username</label>
          <Form.Item
            validateStatus={errorsEdit.param === "username_edit" ? "error" : ""}
            help={errorsEdit.param === "username_edit" ? errorsEdit.msg : ""}
          >
            <Input
              onChange={(e) => setUsernameEdit(e.target.value)}
              value={usernameEdit}
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
