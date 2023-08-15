import styled from "styled-components";

const StyledImage = styled.img`
  width: 24px;
  height: 24px;
`;

export default function LogoWhite() {
  return (
    <StyledImage
      src="https://test-for-aws-course-only.s3.ap-southeast-2.amazonaws.com/icons8-bird-48+(4).pngs"
      alt="logo"
    />
  );
}
