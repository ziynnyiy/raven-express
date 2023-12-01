import Center from "@/components/Center";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { getServerSession } from "next-auth";
import { WishedProduct } from "@/models/WishedProduct";
import { authOptions } from "./api/auth/[...nextauth]";
import { Pagination, Stack } from "@mui/material";
import { useRouter } from "next/router";

const ProductsWrapper = styled.div`
  margin-bottom: 20px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 50px;
  div {
    display: flex;
    gap: 15px;
  }
`;

const PaginationLink = styled.a`
  text-decoration: none;
`;

const PAGE_SIZE = 12; // 每頁顯示的商品數量

export default function ProductsPage({
  products,
  wishedProducts,
  totalPages,
  currentPage,
}) {
  return (
    <>
      <Header />
      <Center>
        <ProductsWrapper>
          <Title>所有商品</Title>
          <ProductsGrid products={products} wishedProducts={wishedProducts} />
          <PaginationCompo currentPage={currentPage} totalPages={totalPages} />
        </ProductsWrapper>
      </Center>
    </>
  );
}

// 分頁連結組件
function PaginationCompo({ currentPage, totalPages }) {
  const router = useRouter();
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (event, page) => {
    router.push(`/products?page=${page}`);
  };

  return (
    <PaginationWrapper>
      <Stack spacing={2}>
        <Pagination count={totalPages} onChange={handlePageChange} />
      </Stack>
    </PaginationWrapper>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  // const products = await Product.find({}, null, { sort: { _id: -1 } });

  // 取得當前頁碼，如果沒有指定則預設為第一頁
  // ctx.query.page => 可以解讀 query 上的 page
  const currentPage = ctx.query.page ? parseInt(ctx.query.page, 10) : 1;

  // 計算總共有多少頁，假設每頁有 PAGE_SIZE 個商品
  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  // 根據當前頁碼取得相對應的商品
  const products = await Product.find({})
    .skip((currentPage - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .sort({ _id: -1 });

  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user.email,
        product: products.map((p) => p._id.toString()),
      })
    : [];
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProducts.map((i) => i.product.toString()),
      totalPages,
      currentPage,
    },
  };
}
