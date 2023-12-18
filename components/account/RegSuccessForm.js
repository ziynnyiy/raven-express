import { Button as MuiButton } from "@mui/material";
import SuccessIcon from "@/components/icons/Successs";
import styled from "styled-components";

const StyledRegSusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledRegSusTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
`;

const StyledRegSusContent = styled.div`
  font-size: 14px;
  text-align: center;
  margin-bottom: 15px;
`;

export default function RegSuccessForm({
  setOpenLogin,
  setOpenRegSus,
  setOpenRegister,
}) {
  function openLoginPageHandle() {
    setOpenRegSus(false);
    setOpenRegister(false);
    setOpenLogin(true);
  }
  return (
    <StyledRegSusWrapper>
      <SuccessIcon />
      <StyledRegSusTitle>註冊成功</StyledRegSusTitle>
      <StyledRegSusContent>點擊下列按鈕以完成登錄</StyledRegSusContent>

      <MuiButton
        onClick={openLoginPageHandle}
        variant="contained"
        color="success"
        fullWidth={true}
      >
        返回登入畫面
      </MuiButton>
    </StyledRegSusWrapper>
  );
}
