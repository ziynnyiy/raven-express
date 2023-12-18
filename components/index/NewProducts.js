import styled from "styled-components";
import Center from "../Center";
import ProductsGrid from "../ProductsGrid";

const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 20px;
  font-weight: 400;
`;

const NewProductsWrapper = styled.div`
  margin-bottom: 40px;
`;

export default function NewProducts({ products, wishedProducts }) {
  return (
    <Center>
      <NewProductsWrapper>
        <Title>最新上架</Title>
        <ProductsGrid products={products} wishedProducts={wishedProducts} />
      </NewProductsWrapper>
    </Center>
  );
}
