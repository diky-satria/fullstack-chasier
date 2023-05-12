import { Input, Button } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../../interceptor/axios";
import { Alert } from "antd";

export default function UbahPassword() {
  const { user } = useSelector((state) => state.auth);

  const [username] = useState(user.username);
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPasswordBaru, setKonfirmasiPasswordBaru] = useState("");

  const [errors, setErrors] = useState([]);

  const [loadingButton, setLoadingButton] = useState(false);
  const [success, setSuccess] = useState(false);

  const ubahPassword = async () => {
    setErrors([]);
    setLoadingButton(true);

    try {
      let response = await axios.patch(`/setting/ubah_password/${username}`, {
        password_lama: passwordLama,
        password_baru: passwordBaru,
        konfirmasi_password_baru: konfirmasiPasswordBaru,
      });

      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasiPasswordBaru("");

      if (response.status === 200) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }

      setLoadingButton(false);
    } catch (e) {
      setErrors(e.response.data.errors);
      setLoadingButton(false);
    }
  };

  return (
    <div className="c-content">
      <div className="c-content-header">
        <div>
          <h4>Ubah password</h4>
          <p>Ubah password sekarang</p>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-4 col-lg-4 col-md-5 col-sm-12">
          <div className="card">
            <div className="card-body">
              {success ? (
                <Alert
                  message="Password berhasil di ubah"
                  type="success"
                  showIcon
                  closable
                />
              ) : (
                ""
              )}
              <div className="form-group mt-3">
                <Input
                  type="password"
                  placeholder="Password lama"
                  onChange={(e) => setPasswordLama(e.target.value)}
                  value={passwordLama}
                />
                {errors.param === "password_lama" ? (
                  <small className="form-text" style={{ color: "red" }}>
                    {errors.msg}
                  </small>
                ) : (
                  ""
                )}
              </div>
              <div className="form-group">
                <Input
                  type="password"
                  placeholder="Password baru"
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  value={passwordBaru}
                />
                {errors.param === "password_baru" ? (
                  <small className="form-text" style={{ color: "red" }}>
                    {errors.msg}
                  </small>
                ) : (
                  ""
                )}
              </div>
              <div className="form-group">
                <Input
                  type="password"
                  placeholder="Konfirmasi Password Baru"
                  onChange={(e) => setKonfirmasiPasswordBaru(e.target.value)}
                  value={konfirmasiPasswordBaru}
                />
                {errors.param === "konfirmasi_password_baru" ? (
                  <small className="form-text" style={{ color: "red" }}>
                    {errors.msg}
                  </small>
                ) : (
                  ""
                )}
              </div>
              <Button
                type="primary"
                loading={loadingButton}
                style={{
                  backgroundColor: "#12B0A2",
                  color: "white",
                  border: "#12B0A2",
                  marginRight: "2px",
                  float: "right",
                }}
                onClick={() => ubahPassword()}
              >
                Ubah
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
