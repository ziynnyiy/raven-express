import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import { signIn, signOut, useSession } from "next-auth/react";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";
import GoogleIcon from "@/components/icons/Google";
import FacebookIcon from "@/components/icons/Facebook";
import { Button as MuiButton } from "@mui/material";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin: 40px 0;
  p {
    margin: 5px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
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

const StyledMuiButton = styled(MuiButton)`
  gap: 8px;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const LoginButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [wishedlistLoaded, setWishedlistLoaded] = useState(true);
  const [ordersLoaded, setOrdersLoaded] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }
  async function loginGoogle() {
    await signIn("google", {
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }
  async function loginFacebook() {
    await signIn("facebook", {
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  function saveAddress() {
    const data = { name, email, city, streetAddress, postalCode, country };
    axios.put("/api/address", data);
  }
  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get("/api/address").then((response) => {
      setAddressLoaded(false);
      setName(response.data?.name);
      setEmail(response.data?.email);
      setCity(response.data?.city);
      setPostalCode(response.data?.postalCode);
      setStreetAddress(response.data?.streetAddress);
      setCountry(response.data?.country);
      setAddressLoaded(true);
    });
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
          <div>
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
          </div>
          <div>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <UserInfos>
                  <h2>{session ? "我的帳戶" : "使用帳戶登入"}</h2>
                </UserInfos>

                {!addressLoaded && <Spinner fullWidth={true} />}
                {addressLoaded && session && (
                  <>
                    <Input
                      type="text"
                      placeholder="購買人姓名"
                      value={name}
                      name="name"
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                    />
                    <Input
                      type="text"
                      placeholder="電子信箱"
                      value={email}
                      name="email"
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                    />
                    <CityHolder>
                      <Input
                        type="text"
                        placeholder="城市"
                        value={city}
                        name="city"
                        onChange={(event) => {
                          setCity(event.target.value);
                        }}
                      />
                      <Input
                        type="text"
                        placeholder="郵遞區號"
                        value={postalCode}
                        name="postalCode"
                        onChange={(event) => {
                          setPostalCode(event.target.value);
                        }}
                      />
                    </CityHolder>
                    <Input
                      type="text"
                      placeholder="街道地址"
                      value={streetAddress}
                      name="streetAddress"
                      onChange={(event) => {
                        setStreetAddress(event.target.value);
                      }}
                    />
                    <Input
                      type="text"
                      placeholder="所在國家"
                      value={country}
                      name="country"
                      onChange={(event) => {
                        setCountry(event.target.value);
                      }}
                    />

                    <StyledMuiButton
                      variant="contained"
                      color="info"
                      onClick={saveAddress}
                    >
                      儲存
                    </StyledMuiButton>
                    <hr />
                  </>
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
                {!session && (
                  <LoginButtonWrapper>
                    <StyledMuiButton
                      variant="outlined"
                      color="error"
                      fullWidth={true}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        px: 15,
                        py: 10,
                      }}
                      style={{ justifyContent: "flex-start" }}
                      onClick={loginGoogle}
                    >
                      <GoogleIcon />
                      透過 Google 進行登錄
                    </StyledMuiButton>
                    <StyledMuiButton
                      variant="outlined"
                      color="error"
                      fullWidth={true}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        px: 15,
                        py: 10,
                      }}
                      style={{ justifyContent: "flex-start" }}
                      onClick={loginFacebook}
                    >
                      <FacebookIcon />
                      透過 Facebook 進行登錄
                    </StyledMuiButton>
                  </LoginButtonWrapper>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
