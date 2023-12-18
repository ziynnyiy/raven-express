import styled, { css } from "styled-components";

const StyledInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 10.9px 14px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #c4c4c4;
  :focus {
    outline: none !important;
  }
  ${(props) =>
    props.register &&
    css`
      padding: 9.38px 12px;
    `}
  ${(props) =>
    props.login &&
    css`
      padding: 10.9px 14px;
    `}
`;

export default StyledInput;
