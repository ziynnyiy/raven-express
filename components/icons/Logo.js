import styled from "styled-components";

const StyledImage = styled.img`
  width: 6px;
  height: 6px;
`;

export default function LogoWhite() {
  return (
    <StyledImage
      src="https://test-for-aws-course-only.s3.ap-southeast-2.amazonaws.com/icons8-bird-48+(2).png"
      alt="logo"
    />
  );
}
