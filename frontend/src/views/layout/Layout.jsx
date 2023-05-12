import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Overlay from "../../components/Overlay";

import styled from "styled-components";

import { AiOutlineAlignLeft } from "react-icons/ai";
import { NavLink } from "react-router-dom";

import { logoutApi } from "../../redux/auth/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../interceptor/axios";

import { BsFillPersonFill } from "react-icons/bs";

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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

  const clickHumbergurIcon = () => {
    var humbergurIcon = document.querySelector(".c-sidebar");
    var dashboard = document.querySelector(".c-dashboard");
    var overlay = document.querySelector(".c-overlay");

    if (humbergurIcon.classList.contains("c-sidebar-show")) {
      humbergurIcon.classList.remove("c-sidebar-show");
      dashboard.classList.remove("c-dashboard-show");
      overlay.classList.remove("c-overlay-show");
    } else {
      humbergurIcon.classList.add("c-sidebar-show");
      dashboard.classList.add("c-dashboard-show");
      overlay.classList.add("c-overlay-show");
    }
  };

  const logout = () => {
    dispatch(logoutApi());
  };

  return (
    <Div>
      <Sidebar />

      <div className="c-dashboard">
        <div className="c-navbar">
          <span
            className="c-humbergur-icon"
            onClick={() => clickHumbergurIcon()}
          >
            <AiOutlineAlignLeft
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            />
          </span>
          <span>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link c-nav-user-icon"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span
                    style={{
                      color: "black",
                    }}
                  >
                    {user.nama.length > 15
                      ? user.nama.substring(0, 15) + "..."
                      : user.nama}
                  </span>
                  <BsFillPersonFill
                    style={{
                      fontSize: "20px",
                      color: "black",
                      marginLeft: "5px",
                    }}
                  />
                </NavLink>
                <div className="dropdown-menu c-dropdown-menu">
                  {/* <NavLink
                    to="/profil"
                    className="dropdown-item c-dropdown-item"
                  >
                    Profil
                  </NavLink> */}
                  <NavLink
                    to="/ubah_password"
                    className="dropdown-item c-dropdown-item"
                  >
                    Ubah password
                  </NavLink>
                  <span
                    onClick={logout}
                    className="dropdown-item c-dropdown-item c-logout"
                  >
                    Logout
                  </span>
                </div>
              </li>
            </ul>
          </span>
        </div>
        {children}
      </div>

      <Overlay />
    </Div>
  );
}

const Div = styled.div`
  /* dashboard */
  .c-dashboard {
    position: relative;
    left: 0;
    width: 100vw;
    transition: all 0.5s;
    z-index: 2 !important;
    min-height: 100vh;
  }
  .c-dashboard.c-dashboard-show {
    left: 0;
    width: 100vw;
  }
  .c-navbar {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 15px;
    padding-right: 20px;
    background-color: #12b0a2;
    position: fixed;
    top: 0;
    width: 100vw !important;
    z-index: 3;
    transition: all 0.5s;
  }
  .c-nav-user-icon {
    display: flex;
    align-items: center;
  }
  .c-dropdown-menu {
    border-radius: 10px;
    box-shadow: 1px 1px 15px #a3a3a3;
    border: 1px solid transparent;
  }
  .c-dropdown-item:focus,
  .c-dropdown-item:hover {
    background-color: #d0fff4;
    color: black !important;
  }
  .dropdown-item.active {
    background-color: #d0fff4 !important;
    color: black !important;
  }
  .c-content {
    padding: 15px;
    padding-top: 80px;
  }
  .card {
    /* background-color: #faf2ff81; */
    background-color: white;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid transparent;
    border-radius: 10px;
  }
  .c-logout {
    cursor: pointer;
  }
  /* akhir dashboard */

  /* responsive */
  @media (min-width: 992px) {
    .c-dashboard {
      left: 220px !important;
      width: calc(100vw - 220px) !important;
    }
    .c-dashboard.c-dashboard-show {
      left: 0 !important;
      width: 100vw !important;
    }
    .c-navbar {
      width: calc(100vw - 220px) !important;
    }
    .c-dashboard.c-dashboard-show .c-navbar {
      width: 100vw !important;
    }
  }
  /* akhir responsive */
`;
