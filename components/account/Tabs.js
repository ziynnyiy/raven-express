import styled from "styled-components";

const StyledTabs = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const StyleTab = styled.span`
  font-size: 1.5rem;
  cursor: pointer;
  ${(props) =>
    props.active
      ? `
  color: black;
  border-bottom: 2px solid black;
  `
      : `
  color: #999;
  `}
`;

export default function Tabs({ tabs, active, onChange }) {
  return (
    <StyledTabs>
      {tabs.map((tabName) => (
        <StyleTab
          onClick={() => {
            onChange(tabName);
          }}
          active={tabName === active}
          key={tabName}
        >
          {tabName === "orders" ? "訂購紀錄" : "願望清單"}
        </StyleTab>
      ))}
    </StyledTabs>
  );
}
