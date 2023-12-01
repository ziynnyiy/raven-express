import Center from "./Center";
import styled from "styled-components";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import FlyingButton from "./FlyingButton";
import { RevealWrapper } from "next-reveal";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;

const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  img.main {
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
    margin-left: auto;
    margin-right: auto;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    & > div:nth-child(1) {
      order: 0;
    }
    img {
      max-width: 100%;
    }
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;
const CenterImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ImgColumn = styled(Column)`
  & > div {
    width: 100%;
  }
`;
const ContentWrapper = styled.div``;

export default function Featured({ product }) {
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <RevealWrapper origin={"left"} delay={0}>
                <ContentWrapper>
                  <Title>{product.title}</Title>
                  <Desc>{product.description}</Desc>
                  <ButtonWrapper>
                    <ButtonLink
                      href={"/product/" + product._id}
                      outline={1}
                      white={1}
                    >
                      瞭解更多
                    </ButtonLink>
                    <FlyingButton
                      white={1}
                      id={product._id}
                      src={product.images?.[0]}
                    >
                      <CartIcon />
                      加入購物車
                    </FlyingButton>
                  </ButtonWrapper>
                </ContentWrapper>
              </RevealWrapper>
            </div>
          </Column>
          <ImgColumn>
            <RevealWrapper delay={0}>
              <CenterImg>
                <img className={"main"} src={product.images?.[0]} alt="" />
              </CenterImg>
            </RevealWrapper>
          </ImgColumn>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
