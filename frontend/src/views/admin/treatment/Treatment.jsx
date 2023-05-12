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

// format number
import { formatNumberNoRp } from "../../../helpers/index.js";

// react select
import CreatableSelect from "react-select/creatable";

const components = {
  DropdownIndicator: null,
};
const createOption = (label) => ({
  label,
  value: label,
});

export default function Treatment() {
  // datatable
  const [treatment, setTreatment] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // ant
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // state tambah
  const [namaTambah, setNamaTambah] = useState("");
  const [hargaTambah, setHargaTambah] = useState([]);
  const [inputHargaTambah, setInputHargaTambah] = useState("");
  const [errorHargaTambah, setErrorHargaTambah] = useState("");
  const [gambarTambah, setGambarTambah] = useState(null);
  /* eslint-disable no-unused-vars */
  const [previewTambah, setPreviewTambah] = useState("");
  /* eslint-disable no-unused-vars */
  const [errorsTambah, setErrorsTambah] = useState([]);

  // state edit
  const [idEdit, setIdEdit] = useState("");
  const [namaEdit, setNamaEdit] = useState("");
  const [namaLamaEdit, setNamaLamaEdit] = useState("");
  const [hargaEdit, setHargaEdit] = useState([]);
  const [inputHargaEdit, setInputHargaEdit] = useState("");
  const [errorHargaEdit, setErrorHargaEdit] = useState("");
  const [gambarEdit, setGambarEdit] = useState(null);
  /* eslint-disable no-unused-vars */
  const [gambarEditShow, setGambarEditShow] = useState(null);
  const [previewEdit, setPreviewEdit] = useState("");
  /* eslint-disable no-unused-vars */
  const [errorsEdit, setErrorsEdit] = useState([]);

  // loading
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingButtonEdit, setLoadingButtonEdit] = useState(false);

  useEffect(() => {
    getTreatment();
  }, [page, perPage]);

  const getTreatment = async () => {
    let response = await axios.get("/treatment");
    setTreatment(response.data.data);
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
      dataField: "harga",
      text: "Harga",
      sort: true,
      // filter: textFilter(),
      formatter: (cellContent, row) => {
        const split = row.harga.split(",");

        return split.map((s, index) => (
          <span
            style={{
              fontSize: "16px",
            }}
            key={index}
          >
            <span className="badge badge-pill badge-secondary mr-1">
              {formatNumberNoRp(s)}
            </span>
          </span>
        ));
      },
    },
    // {
    //   dataField: "databaseOkey",
    //   text: "Gambar",
    //   formatter: (cellContent, row) => {
    //     return (
    //       <div>
    //         {row.gambar !== null ? (
    //           <img
    //             src={
    //               process.env.REACT_APP_URL_API +
    //               "/gambar/treatment/" +
    //               row.gambar
    //             }
    //             alt="gambar"
    //             width="50"
    //           />
    //         ) : (
    //           <span
    //             style={{
    //               fontWeight: "bold",
    //               color: "red",
    //             }}
    //           >
    //             x
    //           </span>
    //         )}
    //       </div>
    //     );
    //   },
    // },
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
              }}
              onClick={() => modalBukaEdit(row.id)}
            >
              Edit
            </Button>
            <Popconfirm
              placement="left"
              title={`Apa kamu yakin`}
              description={`Ingin menghapus data "${row.nama}"`}
              onConfirm={() => hapusTreatment(row.id)}
              okText="Ya"
              cancelText="Tidak"
            >
              <Button
                type="primary"
                size="small"
                danger
                style={{
                  margin: "0 2px",
                }}
              >
                Hapus
              </Button>
            </Popconfirm>
            {row.gambar !== null ? (
              <Popconfirm
                placement="left"
                title={`Apa kamu yakin`}
                description={`Ingin menghapus gambar "${row.nama}"`}
                onConfirm={() => hapusGambar(row.id)}
                okText="Ya"
                cancelText="Tidak"
              >
                <Button
                  type="primary"
                  size="small"
                  danger
                  style={{
                    backgroundColor: "#FFC107",
                    color: "black",
                    border: "#FFC107",
                  }}
                >
                  Hapus Gambar
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

  const modalBukaEdit = async (id) => {
    setOpenEdit(true);

    let response = await axios.get(`/treatment/${id}`);

    setIdEdit(response.data.data.id);
    setNamaLamaEdit(response.data.data.nama);
    setNamaEdit(response.data.data.nama);
    setHargaEdit(response.data.data.harga);
    setGambarEdit(response.data.data.gambar);
    setGambarEditShow(response.data.data.gambar);
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
    setHargaTambah([]);
    setInputHargaTambah("");
    setErrorHargaTambah("");
    setGambarTambah(null);
    setPreviewTambah("");
    setErrorsTambah([]);
  };

  const resetStateEdit = () => {
    setIdEdit("");
    setNamaLamaEdit("");
    setNamaEdit("");
    setHargaEdit([]);
    setGambarEdit(null);
    setGambarEditShow(null);
    setPreviewEdit("");
    setErrorsEdit([]);
  };

  const loadGambarTambah = (e) => {
    const gambar_load = e.target.files[0];
    if (gambar_load) {
      setGambarTambah(gambar_load);
      setPreviewTambah(URL.createObjectURL(gambar_load));
    } else {
      setGambarTambah(null);
      setPreviewTambah("");
    }
  };

  const loadGambarEdit = (e) => {
    const gambar_load = e.target.files[0];
    if (gambar_load) {
      setGambarEdit(gambar_load);
      setPreviewEdit(URL.createObjectURL(gambar_load));
    } else {
      setGambarEdit(null);
      setPreviewEdit("");
    }
  };

  const tambahTreatment = async (e) => {
    e.preventDefault();
    setLoadingButton(true);

    try {
      // ubah hargaTambah dari array of object ke array biasa
      var har = hargaTambah.map(function (item) {
        return item["value"];
      });

      const formData = new FormData();
      formData.append("nama_tambah", namaTambah);
      formData.append("harga_tambah", har);
      formData.append("gambar_tambah", gambarTambah);

      let response = await axios.post(`/treatment`, formData, {
        "Content-type": "multipart/form-data",
      });

      getTreatment();

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

  const editTreatment = async (id) => {
    setLoadingButtonEdit(true);

    try {
      // ubah hargaEdit dari array of object ke array biasa
      var har = hargaEdit.map(function (item) {
        return item["value"];
      });

      const formData = new FormData();
      formData.append("nama_lama_edit", namaLamaEdit);
      formData.append("nama_edit", namaEdit);
      formData.append("harga_edit", har);
      formData.append("gambar_edit", gambarEdit);

      let response = await axios.patch(`/treatment/${id}`, formData, {
        "Content-type": "multipart/form-data",
      });

      getTreatment();

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

  const hapusTreatment = async (id) => {
    try {
      let response = await axios.delete(`/treatment/${id}`);

      getTreatment();

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
      toast.error("Treatment ini telah digunakan di transaksi", {
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

  const hapusGambar = async (id) => {
    let response = await axios.patch(`/treatment/hapus_gambar/${id}`, {});

    getTreatment();

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
  };

  const handleKeyDown = (event) => {
    if (!inputHargaTambah) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setErrorsTambah([]);
        setErrorHargaTambah("");

        var cek = hargaTambah.filter((val) => val.value === inputHargaTambah);

        if (cek.length <= 0) {
          setHargaTambah((prev) => [...prev, createOption(inputHargaTambah)]);
        } else {
          setErrorHargaTambah("Harga tidak boleh ada yang sama");
        }

        setInputHargaTambah("");
        event.preventDefault();
        break;
      default:
    }
  };

  const handleKeyDownEdit = (event) => {
    if (!inputHargaEdit) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setErrorsEdit([]);
        setErrorHargaEdit("");

        var cek = hargaEdit.filter((val) => val.value === inputHargaEdit);

        if (cek.length <= 0) {
          setHargaEdit((prev) => [...prev, createOption(inputHargaEdit)]);
        } else {
          setErrorHargaEdit("Harga tidak boleh ada yang sama");
        }

        setInputHargaEdit("");
        event.preventDefault();
        break;
      default:
    }
  };

  return (
    <Div className="c-content">
      <div className="c-content-header">
        <div>
          <h4>Treatment</h4>
          <p>Semua treatment</p>
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
                data={treatment}
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
        title="Tambah Treatment"
        open={openTambah}
        onCancel={() => modalTutupTambah()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button onClick={() => modalTutupTambah()}>Kembali</Button>
              <Button
                onClick={(e) => tambahTreatment(e)}
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
          <label>Harga</label>
          <CreatableSelect
            components={components}
            inputValue={inputHargaTambah}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={(newValue) => setHargaTambah(newValue)}
            onInputChange={(newValue) => setInputHargaTambah(newValue)}
            onKeyDown={handleKeyDown}
            placeholder=""
            value={hargaTambah}
          />
          <small
            className="form-text"
            style={{ color: "red", fontSize: "14px" }}
          >
            {errorHargaTambah ? errorHargaTambah : ""}
          </small>
          {errorsTambah.param === "harga_tambah" ? (
            <small
              className="form-text"
              style={{ color: "red", fontSize: "14px" }}
            >
              {errorsTambah.msg}
            </small>
          ) : (
            ""
          )}
        </div>
        {/* <div className="form-group mb-2 mt-4">
          <label>Gambar</label>
          <Form.Item
            validateStatus={
              errorsTambah.param === "gambar_tambah" ? "error" : ""
            }
            help={
              errorsTambah.param === "gambar_tambah" ? errorsTambah.msg : ""
            }
          >
            <Input type="file" onChange={loadGambarTambah} />
          </Form.Item>
          {previewTambah ? (
            <img src={previewTambah} alt="load" width="100" />
          ) : (
            ""
          )}
        </div> */}
      </Modal>

      <Modal
        title="Edit Treatment"
        open={openEdit}
        onCancel={() => modalTutupEdit()}
        centered
        footer={[
          <Space key="1" direction="vertical">
            <Space wrap>
              <Button onClick={() => modalTutupEdit()}>Kembali</Button>
              <Button
                onClick={() => editTreatment(idEdit)}
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
        <Input type="hidden" value={namaLamaEdit} />

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
          <label>Harga</label>
          <CreatableSelect
            components={components}
            inputValue={inputHargaEdit}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={(newValue) => setHargaEdit(newValue)}
            onInputChange={(newValue) => setInputHargaEdit(newValue)}
            onKeyDown={handleKeyDownEdit}
            placeholder=""
            value={hargaEdit}
          />
          <small
            className="form-text"
            style={{ color: "red", fontSize: "14px" }}
          >
            {errorHargaEdit ? errorHargaEdit : ""}
          </small>
          {errorsEdit.param === "harga_edit" ? (
            <small
              className="form-text"
              style={{ color: "red", fontSize: "14px" }}
            >
              {errorsEdit.msg}
            </small>
          ) : (
            ""
          )}
        </div>
        {/* <div className="form-group mb-2 mt-4">
          <label>Gambar</label>
          <Form.Item
            validateStatus={errorsEdit.param === "gambar_edit" ? "error" : ""}
            help={errorsEdit.param === "gambar_edit" ? errorsEdit.msg : ""}
          >
            <Input type="file" onChange={loadGambarEdit} />
          </Form.Item>
          <div
            style={{
              display: "flex",
            }}
          >
            {gambarEditShow !== null ? (
              <span>
                <div className="mb-2">Sebelum</div>
                <img
                  src={
                    process.env.REACT_APP_URL_API +
                    "/gambar/treatment/" +
                    gambarEditShow
                  }
                  alt="gambar"
                  width="100"
                  className="mr-4"
                />
              </span>
            ) : (
              <span>
                <div className="mb-2">Sebelum</div>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "red",
                    marginRight: "60px",
                  }}
                >
                  x
                </span>
              </span>
            )}
            {previewEdit ? (
              <span>
                <div
                  className="mb-2"
                  style={{
                    color: "#12B0A2",
                    fontWeight: "bold",
                  }}
                >
                  Sesudah
                </div>
                <img src={previewEdit} alt="load" width="100" />
              </span>
            ) : (
              ""
            )}
          </div>
        </div> */}
      </Modal>
    </Div>
  );
}

const Div = styled.div`
  .pagination {
    float: right !important;
  }
`;
