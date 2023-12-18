import { Button as MuiButton } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import StyledInputWrapper from "../StyledInputWrapper";
import StyledErrorTag from "../StyledErrorTag";

const StyledRegInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 9.38px 12px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #c4c4c4;
  :focus {
    outline: none !important;
  }
`;

const StyledLoginCTA = styled.p`
  display: flex;
  justify-content: center;
  font-size: 13px;
  font-weight: 400;
  color: #7e8081;
  a {
    color: #0090ee;
    border-bottom: 1px solid #0090ee;
    text-decoration: none;
  }
`;

export default function RegisterForm({
  setOpenLogin,
  setOpenRegSus,
  setOpenRegister,
}) {
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [regValidErrors, setRegValidErrors] = useState({});

  async function handleRegister(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }

    const validationErrors = {};

    if (!regEmail.trim()) {
      validationErrors.regEmail = "必填";
    } else if (!checkEmail(regEmail)) {
      validationErrors.regEmail = "請提供真實的信箱";
    }

    if (!regPassword.trim()) {
      validationErrors.regPassword = "必填";
    } else if (regPassword.length < 6 || regPassword.length > 16) {
      validationErrors.regPassword = "密碼字數需要介於 6 ~ 16 之間";
    } else if (!checkPassword(regPassword.trim())) {
      validationErrors.regPassword = "輸入的密碼請包含英文、數字";
    }

    if (regPassword2 !== regPassword) {
      validationErrors.regPassword2 = "與之前輸入的密碼不相符";
    }

    setRegValidErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      await axios
        .post("api/register", {
          userEmail: regEmail,
          password: regPassword,
        })
        .then((response) => {
          if (response.data.message === "電子信箱已經被註冊過") {
            if (validationErrors.regEmailExisted != "信箱已經被註冊過") {
              validationErrors.regEmailExisted = "信箱已經被註冊過";
              setRegValidErrors({ ...validationErrors }); // 用這種方式創建了一個新的 Object ，因此 React 會視為對象已經改變，進而觸發組件的重新渲染。
            }
            return;
          } else {
            setRegEmail("");
            setRegPassword("");
            setRegPassword2("");
            setOpenRegister(false);
            setOpenRegSus(true);
          }
        });
    }
  }

  function openLoginPageHandle() {
    setOpenRegSus(false);
    setOpenRegister(false);
    setOpenLogin(true);
  }

  function checkPassword(value) {
    let password = /^[A-Za-z0-9]{6,30}$/;
    if (value.match(password)) {
      return true;
    } else {
      return false;
    }
  }

  function checkEmail(value) {
    const emailPattern = /^[\w\.-]{1,64}@[\w\.-]{1,255}$/;
    if (value.match(emailPattern)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <form onSubmit={handleRegister}>
        <h2>立即註冊</h2>
        <StyledInputWrapper>
          <StyledRegInput
            type="email"
            value={regEmail}
            placeholder="請輸入電子信箱"
            onChange={(event) => {
              setRegEmail(event.target.value);
            }}
          />
          <StyledErrorTag>
            {regValidErrors.regEmail && <span>{regValidErrors.regEmail}</span>}
          </StyledErrorTag>
          <StyledRegInput
            type="password"
            value={regPassword}
            placeholder="請輸入密碼 ( 6~16位英數混合 )"
            autocomplete="current-password"
            onChange={(event) => {
              setRegPassword(event.target.value);
            }}
          />
          <StyledErrorTag>
            {regValidErrors.regPassword && (
              <span>{regValidErrors.regPassword}</span>
            )}
          </StyledErrorTag>
          <StyledRegInput
            type="password"
            value={regPassword2}
            placeholder="確認密碼"
            autocomplete="current-password"
            onChange={(event) => {
              setRegPassword2(event.target.value);
            }}
          />
          <StyledErrorTag>
            {regValidErrors.regPassword2 && (
              <span>{regValidErrors.regPassword2}</span>
            )}

            {regValidErrors.regEmailExisted && (
              <span>{regValidErrors.regEmailExisted}</span>
            )}
          </StyledErrorTag>
        </StyledInputWrapper>
        <MuiButton
          type="submit"
          variant="contained"
          color="info"
          fullWidth={true}
          sx={{ mb: 0.2, borderRadius: "6px" }}
        >
          註冊
        </MuiButton>
        <StyledLoginCTA>
          已經擁有帳號? &thinsp;{" "}
          <a href="#" onClick={openLoginPageHandle}>
            立即登入
          </a>
        </StyledLoginCTA>
      </form>
    </>
  );
}
