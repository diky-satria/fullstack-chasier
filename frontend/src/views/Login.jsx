import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Input, Form, Button } from "antd";
import logo from "../img/2.png";
import { Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { loginApi, authSuccessApiLogin } from "../redux/auth/action";
import { authErrorDelete } from "../redux/authError/action";

import { useNavigate } from "react-router-dom";
import axios from "../interceptor/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState("false");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { isError, isLoading } = useSelector((state) => state.authError);

  useEffect(() => {
    cekRememberMe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/transaksi");
      }
    }
    return () => {
      dispatch(authErrorDelete());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const cekRememberMe = async () => {
    let response = await axios.get("/auth/remember_me");

    if (response.data.status === 200) {
      dispatch(authSuccessApiLogin(response.data));
    }
  };

  const remember = (e) => {
    setRememberMe(e.target.checked);
  };

  const login = (e) => {
    let data = {
      username: username,
      password: password,
      remember_me: rememberMe,
    };

    dispatch(loginApi(data));
  };

  return (
    <Div>
      <div className="c-login-container">
        <div className="c-login-header">
          <div className="c-login-logo text-center">
            <img src={logo} alt={logo} width={120} />
          </div>
          <div className="c-login-title mt-2 mb-4">
            <h5>Hai,</h5>
            <h4>Silahkan Login</h4>
          </div>
        </div>
        <div className="c-login-content">
          <form>
            <div className="form-group">
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </Form.Item>
              {isError && isError.param === "username" ? (
                <small className="form-text ml-3" style={{ color: "red" }}>
                  {isError.msg}
                </small>
              ) : (
                ""
              )}
            </div>
            <div className="form-group">
              <Form.Item>
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </Form.Item>
              {isError && isError.param === "password" ? (
                <small className="form-text ml-3" style={{ color: "red" }}>
                  {isError.msg}
                </small>
              ) : (
                ""
              )}
            </div>

            {/* <NavLink to="/forgot_password">
              <p
                style={{
                  fontSize: "12px",
                  float: "right",
                  marginTop: "5px",
                }}
              >
                Forgot password?
              </p>
            </NavLink> */}
            <div className="text-start pt-1 pb-3">
              <Checkbox
                onChange={remember}
                style={{
                  color: "#757575",
                }}
              >
                Ingat saya
              </Checkbox>
            </div>
            <div className="c-login-footer">
              <Button
                type="primary"
                size="large"
                className="btn btn-lg c-btn-login"
                onClick={login}
                loading={isLoading}
              >
                Login
              </Button>

              <div
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#757575",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                  }}
                >
                  @Copyright 2023 Harvest Dental Care
                </div>
                <div
                  style={{
                    fontSize: "12px",
                  }}
                >
                  build by Diky satria
                </div>
                {/* <NavLink to="/register">
              <span
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  marginTop: "20px",
                  marginLeft: "5px",
                }}
              >
                Create new one
              </span>
            </NavLink> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Div>
  );
}

const Div = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .c-login-container {
    width: 300px;
    background-color: white;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    padding: 30px;
    border-radius: 10px;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-input,
  .ant-row,
  .ant-input-affix-wrapper {
    background-color: #d0fff4;
    backdrop-filter: blur(5px) !important;
    -webkit-backdrop-filter: blur(5px) !important;
    border-radius: 10px;
    border-radius: 20px;
    padding: 4px 11px;
    border: 1px solid transparent !important;
  }
  .ant-input-password {
    box-shadow: none !important;
    border: 1px solid transparent !important;
  }
  .ant-input:focus,
  .ant-input-password:hover,
  .ant-input-password:focus {
    box-shadow: none !important;
    border: 1px solid transparent !important;
  }
  .ant-input-affix-wrapper-focused.ant-input-password:focus,
  .ant-input-affix-wrapper-focused.ant-input-password:hover {
    border: 1px solid transparent !important;
    box-shadow: none !important;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #12b0a2 !important;
  }
  .ant-checkbox-checked:after {
    border: 1px solid #12b0a2 !important;
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner {
    border-color: #12b0a2 !important;
  }
  .c-btn-login {
    border-radius: 20px;
    width: 100%;
    background-color: #12b0a2;
    color: white;
    font-size: 14px;
    padding: 9px 0;
  }
  .c-btn-login:hover {
    background-color: #12b0a2;
  }
`;
