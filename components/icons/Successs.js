import styled from "styled-components";

const StyledSusIconWrapper = styled.div`
  svg {
    width: 77px;
    height: 77px;
    margin: 20px 0 10px 0;
  }
`;

export default function SuccessIcon() {
  return (
    <StyledSusIconWrapper>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 384"
        fill="#3fad43"
      >
        <path d="M192 384c105.9 0 192-86.1 192-192 0-18.3-2.6-36.3-7.6-53.5-2.5-8.5-11.3-13.4-19.8-10.9s-13.3 11.4-10.9 19.8c4.2 14.3 6.3 29.3 6.3 44.5 0 88.2-71.8 160-160 160S32 280.2 32 192 103.8 32 192 32c32.1 0 62.9 9.4 89.2 27.1 7.3 4.9 17.3 3 22.2-4.3s3-17.3-4.3-22.2C267.5 11.3 230.5 0 192 0 86.1 0 0 86.1 0 192s86.1 192 192 192zM356.7 36.7L192 201.4l-52.7-52.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l64 64c3.1 3.1 7.2 4.7 11.3 4.7s8.2-1.6 11.3-4.7l176-176c6.2-6.2 6.2-16.4 0-22.6-6.2-6.3-16.4-6.3-22.6 0z" />
      </svg>
    </StyledSusIconWrapper>
  );
}
