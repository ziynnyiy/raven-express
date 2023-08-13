import { BounceLoader } from "react-spinners";
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
      <BounceLoader speedMultiplier={3} color={"#555"} />
    </Wrapper>
  );
}
