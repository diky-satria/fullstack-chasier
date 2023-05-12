import React from "react";
import styled from "styled-components";
import logo from "../img/new-logo.png";
// import { AutoComplete, Input } from 'antd'

import { AiOutlineAlignLeft } from "react-icons/ai";

export default function Dashboard() {
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

  return (
    <Div>
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
          {/* <span>
            <AutoComplete
              dropdownMatchSelectWidth={252}
              style={{
                width: 300,
              }}
              // options={options}
              // onSelect={onSelect}
              // onSearch={handleSearch}
            >
              <Input.Search size="default" placeholder="Search" />
            </AutoComplete>
          </span> */}
          <span>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link"
                  href="#"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={logo}
                    alt={logo}
                    width={40}
                    height={40}
                    className="c-navbar-img"
                  />
                </a>
                <div className="dropdown-menu c-dropdown-menu">
                  <a className="dropdown-item c-dropdown-item" href="#">
                    Profil
                  </a>
                  <a className="dropdown-item c-dropdown-item" href="#">
                    Setting
                  </a>
                  <a className="dropdown-item c-dropdown-item" href="#">
                    Logout
                  </a>
                </div>
              </li>
            </ul>
          </span>
        </div>
        <div className="c-content">
          <div className="c-content-header">
            <h4>Dashboard</h4>
            <p>Overview</p>
          </div>
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="card">
                <div className="card-body">Card 1</div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card">
                <div className="card-body">Card 2</div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card">
                <div className="card-body">Card 3</div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card">
                <div className="card-body">Card 4</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">Card 5</div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">Card 6</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 mb-3">
              <div className="card">
                <div className="card-body">Card 7</div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">Card 8</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md mb-3">
              <div className="card">
                <div className="card-body">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Laboriosam error vero dolores nesciunt fugiat voluptatibus,
                  animi dignissimos exercitationem commodi non velit corporis
                  mollitia corrupti perspiciatis doloremque totam temporibus
                  aspernatur distinctio! Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Laboriosam error vero dolores nesciunt
                  fugiat voluptatibus, animi dignissimos exercitationem commodi
                  non velit corporis mollitia corrupti perspiciatis doloremque
                  totam temporibus aspernatur distinctio! Lorem ipsum dolor sit
                  amet consectetur adipisicing elit. Laboriosam error vero
                  dolores nesciunt fugiat voluptatibus, animi dignissimos
                  exercitationem commodi non velit corporis mollitia corrupti
                  perspiciatis doloremque totam temporibus aspernatur
                  distinctio! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Laboriosam error vero dolores nesciunt fugiat
                  voluptatibus, animi dignissimos exercitationem commodi non
                  velit corporis mollitia corrupti perspiciatis doloremque totam
                  temporibus aspernatur distinctio! Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Laboriosam error vero dolores
                  nesciunt fugiat voluptatibus, animi dignissimos exercitationem
                  commodi non velit corporis mollitia corrupti perspiciatis
                  doloremque totam temporibus aspernatur distinctio! Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Laboriosam error
                  vero dolores nesciunt fugiat voluptatibus, animi dignissimos
                  exercitationem commodi non velit corporis mollitia corrupti
                  perspiciatis doloremque totam temporibus aspernatur
                  distinctio! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Laboriosam error vero dolores nesciunt fugiat
                  voluptatibus, animi dignissimos exercitationem commodi non
                  velit corporis mollitia corrupti perspiciatis doloremque totam
                  temporibus aspernatur distinctio! Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Laboriosam error vero dolores
                  nesciunt fugiat voluptatibus, animi dignissimos exercitationem
                  commodi non velit corporis mollitia corrupti perspiciatis
                  doloremque totam temporibus aspernatur distinctio! Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Laboriosam error
                  vero dolores nesciunt fugiat voluptatibus, animi dignissimos
                  exercitationem commodi non velit corporis mollitia corrupti
                  perspiciatis doloremque totam temporibus aspernatur
                  distinctio! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Laboriosam error vero dolores nesciunt fugiat
                  voluptatibus, animi dignissimos exercitationem commodi non
                  velit corporis mollitia corrupti perspiciatis doloremque totam
                  temporibus aspernatur distinctio! Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Laboriosam error vero dolores
                  nesciunt fugiat voluptatibus, animi dignissimos exercitationem
                  commodi non velit corporis mollitia corrupti perspiciatis
                  doloremque totam temporibus aspernatur distinctio! Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Laboriosam error
                  vero dolores nesciunt fugiat voluptatibus, animi dignissimos
                  exercitationem commodi non velit corporis mollitia corrupti
                  perspiciatis doloremque totam temporibus aspernatur
                  distinctio! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Laboriosam error vero dolores nesciunt fugiat
                  voluptatibus, animi dignissimos exercitationem commodi non
                  velit corporis mollitia corrupti perspiciatis doloremque totam
                  temporibus aspernatur distinctio! Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Laboriosam error vero dolores
                  nesciunt fugiat voluptatibus, animi dignissimos exercitationem
                  commodi non velit corporis mollitia corrupti perspiciatis
                  doloremque totam temporibus aspernatur distinctio! Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Laboriosam error
                  vero dolores nesciunt fugiat voluptatibus, animi dignissimos
                  exercitationem commodi non velit corporis mollitia corrupti
                  perspiciatis doloremque totam temporibus aspernatur
                  distinctio! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Laboriosam error vero dolores nesciunt fugiat
                  voluptatibus, animi dignissimos exercitationem commodi non
                  velit corporis mollitia corrupti perspiciatis doloremque totam
                  temporibus aspernatur distinctio! Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Laboriosam error vero dolores
                  nesciunt fugiat voluptatibus, animi dignissimos exercitationem
                  commodi non velit corporis mollitia corrupti perspiciatis
                  doloremque totam temporibus aspernatur distinctio! Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Laboriosam error
                  vero dolores nesciunt fugiat voluptatibus, animi dignissimos
                  exercitationem commodi non velit corporis mollitia corrupti
                  perspiciatis doloremque totam temporibus aspernatur
                  distinctio! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Laboriosam error vero dolores nesciunt fugiat
                  voluptatibus, animi dignissimos exercitationem commodi non
                  velit corporis mollitia corrupti perspiciatis doloremque totam
                  temporibus aspernatur distinctio! Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Laboriosam error vero dolores
                  nesciunt fugiat voluptatibus, animi dignissimos exercitationem
                  commodi non velit corporis mollitia corrupti perspiciatis
                  doloremque totam temporibus aspernatur distinctio! Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Laboriosam error
                  vero dolores nesciunt fugiat voluptatibus, animi dignissimos
                  exercitationem commodi non velit corporis mollitia corrupti
                  perspiciatis doloremque totam temporibus aspernatur
                  distinctio! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Laboriosam error vero dolores nesciunt fugiat
                  voluptatibus, animi dignissimos exercitationem commodi non
                  velit corporis mollitia corrupti perspiciatis doloremque totam
                  temporibus aspernatur distinctio! Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Laboriosam error vero dolores
                  nesciunt fugiat voluptatibus, animi dignissimos exercitationem
                  commodi non velit corporis mollitia corrupti perspiciatis
                  doloremque totam temporibus aspernatur distinctio! Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Laboriosam error
                  vero dolores nesciunt fugiat voluptatibus, animi dignissimos
                  exercitationem commodi non velit corporis mollitia corrupti
                  perspiciatis doloremque totam temporibus aspernatur
                  distinctio! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Laboriosam error vero dolores nesciunt fugiat
                  voluptatibus, animi dignissimos exercitationem commodi non
                  velit corporis mollitia corrupti perspiciatis doloremque totam
                  temporibus aspernatur distinctio! Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Laboriosam error vero dolores
                  nesciunt fugiat voluptatibus, animi dignissimos exercitationem
                  commodi non velit corporis mollitia corrupti perspiciatis
                  doloremque totam temporibus aspernatur distinctio! Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Laboriosam error
                  vero dolores nesciunt fugiat voluptatibus, animi dignissimos
                  exercitationem commodi non velit corporis mollitia corrupti
                  perspiciatis doloremque totam temporibus aspernatur
                  distinctio! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Laboriosam error vero dolores nesciunt fugiat
                  voluptatibus, animi dignissimos exercitationem commodi non
                  velit corporis mollitia corrupti perspiciatis doloremque totam
                  temporibus aspernatur distinctio!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    position: fixed;
    top: 0;
    width: 100vw !important;
    z-index: 3;
    transition: all 0.5s;
  }
  .c-navbar-img {
    border-radius: 50%;
  }
  .c-dropdown-menu {
    background-color: #faf2ff81;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid transparent;
    border-radius: 10px;
  }
  .c-dropdown-item:focus,
  .c-dropdown-item:hover {
    background-color: #d0d2ff;
  }
  .c-content {
    padding: 15px;
    padding-top: 80px;
  }
  .card {
    background-color: #faf2ff81;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid transparent;
    border-radius: 10px;
  }
  /* akhir dashboard */

  /* responsive */
  @media (min-width: 768px) {
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
