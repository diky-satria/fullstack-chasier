import React, { useEffect } from "react";
import styled from "styled-components";
import logo from "../img/11.png";

import {
  AiFillWindows,
  // AiFillApple,
  // AiFillAndroid,
  AiOutlineArrowDown,
  // AiFillSetting,
  // AiFillTool,
  AiFillHdd,
  // AiFillPieChart,
  AiFillContacts,
  // AiFillDollarCircle,
  // AiFillFolderOpen,
  // AiFillFolder
} from "react-icons/ai";
import {
  BsFillPersonFill,
  BsFillPeopleFill,
  BsFillBagCheckFill,
  // BsFillCreditCard2BackFill,
  BsCalendarDateFill,
  BsFillBackspaceFill,
} from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { logoutApi } from "../redux/auth/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "../interceptor/axios";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    var url = window.location.href;
    var url_split = url.split("/");

    var key = url_split[3];
    if (
      key === "user" ||
      key === "dokter" ||
      key === "pasien" ||
      key === "barang" ||
      key === "treatment"
    ) {
      var master_data = document.getElementById("master-data");
      if (master_data) {
        master_data.click();
      }
      var master_data_nav = document.getElementById("master-data-nav");
      if (master_data_nav) {
        master_data_nav.click();
      }
    }
    var sub_nav = document.getElementById(`${key}`);
    if (sub_nav) {
      sub_nav.click();
    }
  }, []);

  useEffect(() => {
    getMeCompare();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getMeCompare = async () => {
    try {
      let response = await axios.get("/auth/me");

      if (
        !user ||
        user.id !== response.data.data.id ||
        user.nama !== response.data.data.nama ||
        user.username !== response.data.data.username ||
        user.role !== response.data.data.role
      ) {
        logout();
      }
    } catch (e) {
      logout();
    }
  };

  const activeMenu = (e) => {
    var navLink = document.getElementsByClassName("nav-item");
    for (var i = 0; i < navLink.length; i++) {
      navLink[i].classList.remove("active");
    }

    e.currentTarget.classList.add("active");
  };

  const logout = () => {
    dispatch(logoutApi());
  };

  return (
    <Div>
      <div className="c-sidebar">
        <span>
          <div className="c-sidebar-logo-container">
            <div>
              <span className="c-sidebar-logo">
                <img src={logo} alt={logo} width={150} />
              </span>
              {/* <span className="c-sidebar-logo-title">LogoLogoLogo</span> */}
            </div>
          </div>
          <div className="sidebar-menu-container">
            <div>
              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span
                  style={{
                    fontSize: "16px",
                    color: "#12B0A2",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Menu
                </span>
                <span
                  className="d-flex align-items-center text-muted"
                  aria-label="Add a new report"
                >
                  <span data-feather="plus-circle" />
                </span>
              </h6>
              <ul className="nav flex-column mb-2">
                {user.role === "admin" ? (
                  <>
                    <li
                      className="nav-item active"
                      onClick={(e) => activeMenu(e)}
                      id="dashboard"
                    >
                      <NavLink to="/dashboard" className="nav-link c-nav-link">
                        <AiFillWindows className="c-icon-nav-link" />
                        Dashboard
                      </NavLink>
                    </li>
                    <div className="accordion" id="accordionExample">
                      <li
                        className="nav-item"
                        onClick={(e) => activeMenu(e)}
                        id="master-data"
                      >
                        <NavLink
                          className="nav-link c-nav-link"
                          data-toggle="collapse"
                          id="master-data-nav"
                          data-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <AiFillHdd className="c-icon-nav-link" />
                              Master Data
                            </div>
                            <AiOutlineArrowDown />
                          </div>
                        </NavLink>
                      </li>
                    </div>
                    <div
                      id="collapseOne"
                      className="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordionExample"
                    >
                      <div
                        style={{
                          marginLeft: "10px",
                        }}
                      >
                        <li
                          className="nav-item"
                          onClick={(e) => activeMenu(e)}
                          id="user"
                        >
                          <NavLink to="/user" className="nav-link c-nav-link">
                            <BsFillPersonFill className="c-icon-nav-link" />
                            User
                          </NavLink>
                        </li>
                        <li
                          className="nav-item"
                          onClick={(e) => activeMenu(e)}
                          id="dokter"
                        >
                          <NavLink to="/dokter" className="nav-link c-nav-link">
                            <BsFillPeopleFill className="c-icon-nav-link" />
                            Dokter
                          </NavLink>
                        </li>
                        <li
                          className="nav-item"
                          onClick={(e) => activeMenu(e)}
                          id="pasien"
                        >
                          <NavLink to="/pasien" className="nav-link c-nav-link">
                            <BsFillPeopleFill className="c-icon-nav-link" />
                            Pasien
                          </NavLink>
                        </li>
                        <li
                          className="nav-item"
                          onClick={(e) => activeMenu(e)}
                          id="treatment"
                        >
                          <NavLink
                            to="/treatment"
                            className="nav-link c-nav-link"
                          >
                            <BsFillBagCheckFill className="c-icon-nav-link" />
                            Treatment
                          </NavLink>
                        </li>
                        {/* <li
                          className="nav-item"
                          onClick={(e) => activeMenu(e)}
                          id="barang"
                        >
                          <NavLink to="/barang" className="nav-link c-nav-link">
                            <BsFillCreditCard2BackFill className="c-icon-nav-link" />
                            Barang
                          </NavLink>
                        </li> */}
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {user.role === "kasir" ? (
                  <li
                    className="nav-item"
                    onClick={(e) => activeMenu(e)}
                    id="transaksi"
                  >
                    <NavLink to="/transaksi" className="nav-link">
                      <AiFillContacts className="c-icon-nav-link" />
                      Transaksi
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}

                {user.role === "admin" || user.role === "kasir" ? (
                  <li
                    className="nav-item"
                    onClick={(e) => activeMenu(e)}
                    id="transaksi_pending"
                  >
                    <NavLink to="/transaksi_pending" className="nav-link">
                      <BsFillBackspaceFill className="c-icon-nav-link" />
                      Transaksi Pending
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}

                <li
                  className="nav-item"
                  onClick={(e) => activeMenu(e)}
                  id="laporan"
                >
                  <NavLink to="/laporan" className="nav-link">
                    <BsCalendarDateFill className="c-icon-nav-link" />
                    Laporan
                  </NavLink>
                </li>

                {/* <li 
                  className="nav-item"
                  onClick={(e) => activeMenu(e)}
                >
                  <NavLink to="/chart" className="nav-link">
                    <AiFillPieChart className="c-icon-nav-link" />
                    Chart
                  </NavLink>
                </li>
                <li 
                  className="nav-item"
                  onClick={(e) => activeMenu(e)}
                >
                  <NavLink to="/wallet" className="nav-link">
                    <AiFillDollarCircle className="c-icon-nav-link" />
                    Wallet
                  </NavLink>
                </li> */}
              </ul>
            </div>
            {/* <div>
              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span
                  style={{
                    fontSize: '16px',
                    color: '#12B0A2',
                    fontWeight: 'bold',
                    marginBottom: '5px'
                  }}
                >Page</span>
                <a className="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
                  <span data-feather="plus-circle" />
                </a>
              </h6>
              <ul className="nav flex-column mb-2">
                <li 
                  className="nav-item"
                  onClick={(e) => activeMenu(e)}
                >
                  <NavLink to="/" className="nav-link">
                    <AiFillFolderOpen className="c-icon-nav-link" />
                    Login
                  </NavLink>
                </li>
                <li 
                  className="nav-item"
                  onClick={(e) => activeMenu(e)}
                >
                  <NavLink to="/register" className="nav-link">
                    <AiFillFolder className="c-icon-nav-link" />
                    Register
                  </NavLink>
                </li>
                <li 
                  className="nav-item"
                  onClick={(e) => activeMenu(e)}
                >
                  <NavLink to="/forgot_password" className="nav-link">
                    <AiFillFolder className="c-icon-nav-link" />
                    Forgot Password
                  </NavLink>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span
                  style={{
                    fontSize: '16px',
                    color: '#12B0A2',
                    fontWeight: 'bold',
                    marginBottom: '5px'
                  }}
                >Settings</span>
                <a className="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
                  <span data-feather="plus-circle" />
                </a>
              </h6>
              <ul className="nav flex-column mb-2">
                <li 
                  className="nav-item"
                  onClick={(e) => activeMenu(e)}
                >
                  <NavLink to="/setting1" className="nav-link">
                    <AiFillSetting className="c-icon-nav-link" />
                    Setting 1
                  </NavLink>
                </li>
                <li 
                  className="nav-item"
                  onClick={(e) => activeMenu(e)}
                >
                  <NavLink to="/setting2" className="nav-link">
                    <AiFillTool className="c-icon-nav-link" />
                    Setting 2
                  </NavLink>
                </li>
              </ul>
            </div> */}
          </div>
          <div className="c-sidebar-logout-container">
            <div className="c-sidebar-logout">
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  backgroundColor: "#12B0A2",
                  border: "1px solid #12B0A2",
                  borderRadius: "15px",
                }}
                onClick={() => logout()}
              >
                Logout
              </button>
            </div>
          </div>
        </span>
      </div>
    </Div>
  );
}

const Div = styled.div`
  /* sidebar */
  .c-sidebar {
    position: fixed;
    height: 100vh;
    width: 220px;
    transform: translate(-220px, 0);
    transition: all 0.5s;
    z-index: 3 !important;
    background-color: white;
  }
  .c-sidebar.c-sidebar-show {
    transform: translate(0, 0);
  }
  .c-sidebar-logo-container {
    height: 60px;
    width: 100%;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin-bottom: 20px;
    background-color: #12b0a2;
  }
  .c-sidebar-logo-container div {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .c-sidebar-logo {
    padding: 10px 0;
    align-items: center;
  }
  .c-sidebar-logo-title {
    font-size: 20px;
    color: #374456;
    font-weight: 600;
  }
  .sidebar-menu-container {
    padding: 0 10px;
    overflow-y: scroll;
    max-height: 70vh;
  }
  .sidebar-menu-container::-webkit-scrollbar {
    width: 5px;
    background-color: #d0fff4;
    border-radius: 5px;
  }
  .sidebar-menu-container::-webkit-scrollbar-thumb {
    background-color: #12b0a2;
    border-radius: 5px;
  }

  /* hover menu dan active */
  .nav-item:hover {
    background-color: #d0fff4;
    border-radius: 10px;
  }
  .nav-item:hover a {
    color: #12b0a2;
    font-weight: 600;
  }
  .nav-item:hover .c-icon-nav-link {
    background-color: #12b0a2;
    color: white;
  }

  .nav-item.active {
    background-color: #d0fff4;
    border-radius: 10px;
  }
  .nav-item.active a {
    color: #12b0a2;
    font-weight: 600;
  }
  .nav-item.active .c-icon-nav-link {
    background-color: #12b0a2;
    color: white;
  }
  /* akhir hover menu dan active */

  .nav-item {
    margin-bottom: 5px;
  }
  .nav-item a {
    font-size: 14px !important;
    color: #374456;
    font-weight: 500;
  }
  .c-nav-link {
    display: flex;
    align-items: center;
  }
  .c-icon-nav-link {
    font-size: 25px;
    background-color: #d0fff4;
    padding: 5px;
    border-radius: 50%;
    margin-right: 7px;
    color: #374456;
  }
  .c-sidebar-logout-container {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
    padding: 20px;
  }
  /* akhir sidebar */

  /* responsive */
  @media (min-width: 992px) {
    .c-sidebar {
      transform: translate(0, 0) !important;
    }
    .c-sidebar.c-sidebar-show {
      transform: translate(-220px, 0) !important;
    }
  }
  /* akhir responsive */
`;
