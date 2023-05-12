import React from 'react'
import styled from 'styled-components'
import { Input, Form, Button } from 'antd'
import logo from '../img/success-logo.png'
import { NavLink } from 'react-router-dom'

export default function ForgotPassword() {
  return (
    <Div>
      <div className="c-login-container">
        <div className="c-login-header">
          <div className="c-login-logo text-center">
            <img 
              src={logo} 
              alt={logo}
              width={80}
            />
          </div>
          <div className="c-login-title my-4">
            <h4>Forgot Password</h4>
          </div>
        </div>
        <div className="c-login-content">
          <form>
            <div className="form-group">
              <Form.Item>
                <Input placeholder="Email" />
              </Form.Item>
            </div>
          </form>
        </div>
        <div className="c-login-footer">
          <Button 
            type="primary" 
            size="large"
            className="c-btn-login"
            style={{
                backgroundColor: '#5356FB',
                border: '1px solid #5356FB',
            }}
          >Send</Button>

          <div
            style={{
              fontSize: '12px',
              textAlign: 'center',
              marginTop: '20px'
            }}
          >
            Don't forget your'e email?  
            <NavLink to="/">
                <span
                    style={{
                        fontSize: '12px',
                        textAlign: 'center',
                        marginTop: '20px',
                        marginLeft: '5px'
                    }}
                >Login now</span>
            </NavLink>
          </div>
        </div>
      </div>
    </Div>
  )
}

const Div = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .c-login-container{
    width: 300px;
    background-color: #faf2ff81;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    padding: 30px;
    border-radius: 10px;
  }
  .ant-form-item{
    margin-bottom: 0;
  }
  .ant-input, 
  .ant-row,
  .ant-input-affix-wrapper{
    background-color: #faf2ffce;
    backdrop-filter: blur(5px) !important;
    -webkit-backdrop-filter: blur(5px) !important;
    border-radius: 10px;
    border-radius: 20px;
    padding: 4px 11px;
    border: 1px solid transparent;
  }
  .ant-input-password{
    box-shadow: none !important;
    border: 1px solid transparent !important;
  }
  .ant-input:focus,
  .ant-input-password:hover,
  .ant-input-password:focus{
    box-shadow: none !important;
    border: 1px solid transparent !important;
  }
  .c-btn-login{
    border-radius: 20px;
    width: 100%;
  }
`