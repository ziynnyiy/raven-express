import Center from "@/components/Center";
import Header from "@/components/Header";
import { signOut, useSession } from "next-auth/react";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/account/Tabs";
import SingleOrder from "@/components/account/SingleOrder";
import { Button as MuiButton } from "@mui/material";
import AddressForm from "@/components/account/AddressForm";
import LoginForm from "@/components/account/LoginForm";
import RegisterForm from "@/components/account/RegisterForm";
import RegSuccessForm from "@/components/account/RegSuccessForm";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
  gap: 40px;
  margin: 40px 0;
  p {
    margin: 5px;
  }
`;
const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;
const UserInfos = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  svg {
    width: 28px;
    height: 28px;
    margin-top: 3px;
    display: none;
    @media screen and (min-width: 768px) {
      display: flex;
    }
  }
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [wishedlistLoaded, setWishedlistLoaded] = useState(true);
  const [ordersLoaded, setOrdersLoaded] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);

  // form switch
  const [openLogin, setOpenLogin] = useState(true);
  const [openRegister, setOpenRegister] = useState(false);
  const [openRegSus, setOpenRegSus] = useState(false);

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get("/api/wishlist").then((response) => {
      setWishedlistLoaded(false);
      setWishedProducts(response.data.map((wp) => wp.product));
      setWishedlistLoaded(true);
    });
    axios.get("/api/orders").then((response) => {
      setOrdersLoaded(false);
      setOrders(response.data);
      setOrdersLoaded(true);
    });
  }, [session]);

  function productRemovedFromWishlist(idToRemove) {
    setWishedProducts((products) => {
      return [...products.filter((p) => p._id.toString() !== idToRemove)];
    });
  }

  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <Tabs
                  tabs={["orders", "wishlist"]}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {activeTab === "orders" && (
                  <>
                    {!ordersLoaded && <Spinner fullWidth={true} />}
                    {ordersLoaded && (
                      <div>
                        {orders.length === 0 && (
                          <>
                            {session && <p>您目前尚未訂購任何商品。</p>}
                            {!session && <p>登錄以檢視您的訂單。</p>}
                          </>
                        )}
                        {orders.length > 0 &&
                          orders.map((order) => (
                            <SingleOrder key={order._id} {...order} />
                          ))}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "wishlist" && (
                  <>
                    {!wishedlistLoaded && <Spinner fullWidth={true} />}

                    {wishedlistLoaded && (
                      <>
                        <WishedProductsGrid>
                          {wishedProducts.length > 0 &&
                            wishedProducts.map((wp) => (
                              <ProductBox
                                {...wp}
                                wished={true}
                                onRemovedFromWishlist={
                                  productRemovedFromWishlist
                                }
                                key={wp?._id}
                              />
                            ))}
                        </WishedProductsGrid>
                        {wishedProducts.length === 0 && (
                          <>
                            {session && <p>您的願望清單是空的。</p>}
                            {!session && (
                              <p>若欲將商品加入願望清單，請先進行登入。</p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </>
          <div>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <UserInfos>
                  {!openRegister && !openRegSus && (
                    <h2>{session ? "我的帳戶" : "登入帳號"}</h2>
                  )}
                </UserInfos>

                {!addressLoaded && <Spinner fullWidth={true} />}
                {addressLoaded && session && (
                  <AddressForm setAddressLoaded={setAddressLoaded} />
                )}
                {session && (
                  <MuiButton
                    variant="contained"
                    color="primary"
                    onClick={logout}
                  >
                    登出
                  </MuiButton>
                )}
                {!session && openLogin && (
                  <LoginForm
                    setOpenLogin={setOpenLogin}
                    setOpenRegister={setOpenRegister}
                    setOpenRegSus={setOpenRegSus}
                  />
                )}
                {!session && openRegister && (
                  <RegisterForm
                    setOpenLogin={setOpenLogin}
                    setOpenRegister={setOpenRegister}
                    setOpenRegSus={setOpenRegSus}
                  />
                )}
                {!session && openRegSus && (
                  <RegSuccessForm
                    setOpenLogin={setOpenLogin}
                    setOpenRegister={setOpenRegister}
                    setOpenRegSus={setOpenRegSus}
                  />
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
