import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Setting } from "@/models/Setting";
import Head from "next/head";

export default function HomePage({
  featuredProduct,
  recentProducts,
  wishedNewProducts,
}) {
  return (
    <div>
      <Head>
        <title>Raven Express</title>
        <meta name="description" content="The only express that you need." />
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://test-for-aws-course-only.s3.ap-southeast-2.amazonaws.com/icons8-bird-48+(1).png"
        />
      </Head>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts
        products={recentProducts}
        wishedProducts={wishedNewProducts}
      />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const featuredProductSetting = await Setting.findOne({
    name: "featuredProductId",
  });
  const featuredProductId = featuredProductSetting.value;
  const featuredProduct = await Product.findById(featuredProductId);
  const recentProducts = await Product.find({}, null, {
    sort: { _id: 1 },
    limit: 10,
  });
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  // 如果 session 存在並具有 user屬性，則執行前者，反之 return一個empty array
  const wishedNewProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user.email,
        product: recentProducts.map((p) => p._id.toString()),
      })
    : [];

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      recentProducts: JSON.parse(JSON.stringify(recentProducts)),
      wishedNewProducts: wishedNewProducts.map((i) => i.product.toString()),
    },
  };
}
