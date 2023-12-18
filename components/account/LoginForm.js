import { Button as MuiButton } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import GoogleIcon from "@/components/icons/Google";
import FacebookIcon from "@/components/icons/Facebook";
import AppleIcon from "@/components/icons/Apple";
import StyledInputWrapper from "../StyledInputWrapper";
import StyledErrorTag from "../StyledErrorTag";

const StyledLoginInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 10.9px 14px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #c4c4c4;
  :focus {
    outline: none !important;
  }
`;

const StyledRegCTA = styled.p`
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  font-weight: 400;
  color: #7e8081;
  a {
    color: #0090ee;
    text-decoration: none;
  }
`;

const LoginOptionsText = styled.div`
  color: #4a4a4a;
  font-size: 14px;
  font-weight: 400;
  width: 100%; 
  text-align: center; 
  border-bottom: 1px solid #cccccc; 
  line-height: 0.1em;
  margin: 40px 0 10px 0; 
} 
span { 
   background:#fff; 
   padding:0 10px; 
}
`;

const LoginButtonWrapper = styled.div`
  display: flex;

  flex-direction: column;
  @media screen and (min-width: 358px) {
    flex-direction: row;
  }
  gap: 32px;
  margin-top: 24px;
`;

const StyledGoogleButton = styled(MuiButton)`
  svg {
    width: 26px;
    height: 26px;
  }
`;
const StyledFacebookButton = styled(MuiButton)`
  svg {
    width: 24px;
    height: 24px;
  }
`;
const StyledAppleButton = styled(MuiButton)`
  svg {
    width: 24px;
    height: 24px;
  }
`;

export default function LoginForm({
  setOpenRegSus,
  setOpenRegister,
  setOpenLogin,
}) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginValidErrors, setLoginValidErrors] = useState({});

  async function handleLogin(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }

    const validationErrors = {};

    if (!loginEmail.trim()) {
      validationErrors.loginEmail = "必填";
    } else if (!checkEmail(loginEmail)) {
      validationErrors.loginEmail = "請提供真實的信箱";
    }

    if (!loginPassword.trim()) {
      validationErrors.loginPassword = "必填";
    } else if (loginPassword.length < 6 || loginPassword.length > 16) {
      validationErrors.loginPassword = "密碼字數需要介於 6 ~ 16 之間";
    } else if (!checkPassword(loginPassword.trim())) {
      validationErrors.loginPassword = "輸入的密碼請包含英文、數字";
    }

    setLoginValidErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: loginEmail,
          password: loginPassword,
          callbackUrl: "http://localhost:4000/account", // production 時需要改掉
        });
        if (Object.keys(validationErrors).length === 0) {
          setLoginError("帳號或密碼不匹配 !");
        }
      } catch (error) {
        console.error("登入期間發生錯誤：", error);
      }
    }
  }

  async function loginGoogle() {
    await signIn("google", {
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }
  async function loginFacebook() {
    // facebook provider need a real shop to initiate
    // await signIn("facebook", {
    //   callbackUrl: process.env.NEXT_PUBLIC_URL,
    // });
  }
  async function loginApple() {}

  function openRegPageHandle() {
    setOpenRegSus(false);
    setOpenLogin(false);
    setOpenRegister(true);
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
      <form onSubmit={handleLogin}>
        <StyledInputWrapper>
          <StyledLoginInput
            label="Email"
            name="email"
            type="email"
            value={loginEmail}
            placeholder="電子信箱"
            onChange={(event) => {
              setLoginEmail(event.target.value);
            }}
          />
          <StyledErrorTag>
            <span>{loginValidErrors.loginEmail}</span>
          </StyledErrorTag>
          <StyledLoginInput
            label="Password"
            name="password"
            type="password"
            autocomplete="current-password"
            value={loginPassword}
            placeholder="密碼"
            onChange={(event) => {
              setLoginPassword(event.target.value);
            }}
          />
          <StyledErrorTag>
            {loginValidErrors.loginPassword && (
              <span>{loginValidErrors.loginPassword}</span>
            )}
            {loginError && <span>{loginError}</span>}
          </StyledErrorTag>
        </StyledInputWrapper>

        <MuiButton
          type="submit"
          variant="contained"
          color="info"
          fullWidth={true}
          sx={{ mb: 0.2, borderRadius: "6px" }}
        >
          登入
        </MuiButton>

        <StyledRegCTA>
          還沒有帳號嗎? &thinsp;{" "}
          <a href="#" onClick={openRegPageHandle}>
            點我註冊!
          </a>
        </StyledRegCTA>

        <LoginOptionsText>
          <span>使用以下帳號快速登入</span>
        </LoginOptionsText>

        <LoginButtonWrapper>
          <StyledGoogleButton
            variant="outlined"
            color="error"
            fullWidth={true}
            sx={{
              px: 1.2,
              py: 1.5,
            }}
            onClick={loginGoogle}
          >
            <GoogleIcon />
          </StyledGoogleButton>
          <StyledFacebookButton
            variant="outlined"
            color="error"
            fullWidth={true}
            sx={{
              px: 1.2,
              py: 1.5,
            }}
            onClick={loginFacebook}
          >
            <FacebookIcon />
          </StyledFacebookButton>
          <StyledAppleButton
            variant="outlined"
            color="error"
            fullWidth={true}
            sx={{
              px: 1.2,
              py: 1.5,
            }}
            onClick={loginApple}
          >
            <AppleIcon />
          </StyledAppleButton>
        </LoginButtonWrapper>
      </form>
    </>
  );
}
