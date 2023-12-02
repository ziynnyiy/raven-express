import { Stack, CircularProgress } from "@mui/material";
import styled from "styled-components";

const Wrapper = styled.div`
  ${(props) =>
    props.fullWidth
      ? `
  display: flex;
  justify-content: center;
  margin-top: 30px;
  `
      : `
      border: 5px solid;
      `}
`;

export default function Spinner({ fullWidth }) {
  return (
    <Wrapper fullWidth={fullWidth}>
      <Stack spacing={2} direction="row">
        <CircularProgress color="primary" />
      </Stack>
    </Wrapper>
  );
}
