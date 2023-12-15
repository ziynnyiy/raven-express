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
import AppleIcon from "@/components/icons/Apple";
import { useRouter } from "next/router";
import SuccessIcon from "@/components/icons/Successs";

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

const StyledGoogleButton = styled(MuiButton)`
  svg {
    width: 26px;
    height: 26px;
  }
`;
const StyledFacebookButton = styled(MuiButton)`
  svg {
    width: 24px;
    height: 24px;
  }
`;
const StyledAppleButton = styled(MuiButton)`
  svg {
    width: 24px;
    height: 24px;
  }
`;

const LoginButtonWrapper = styled.div`
  display: flex;

  flex-direction: column;
  @media screen and (min-width: 358px) {
    flex-direction: row;
  }
  gap: 32px;
  margin-top: 24px;
`;

const Line = styled.div`
  color: #4a4a4a;
  font-size: 14px;
  font-weight: 400;
  width: 100%; 
  text-align: center; 
  border-bottom: 1px solid #cccccc; 
  line-height: 0.1em;
  margin: 40px 0 10px 0; 
} 
span { 
   background:#fff; 
   padding:0 10px; 
}
`;

const StyledRegCTA = styled.p`
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  font-weight: 400;
  color: #7e8081;
  a {
    color: #0090ee;
    text-decoration: none;
  }
`;
const StyledLoginCTA = styled.p`
  display: flex;
  justify-content: center;
  font-size: 13px;
  font-weight: 400;
  color: #7e8081;
  a {
    color: #0090ee;
    border-bottom: 1px solid #0090ee;
    text-decoration: none;
  }
`;

const StyledLoginInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 10.9px 14px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #c4c4c4;
  :focus {
    outline: none !important;
  }
`;
const StyledRegInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 9.38px 12px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #c4c4c4;
  :focus {
    outline: none !important;
  }
`;

const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
`;
const StyledErrorTag = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 17px;
  span {
    color: #f43f5e;
    font-size: 13px;
    font-weight: 400;
  }
`;
const StyledRegSusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const StyledRegSusTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
`;
const StyledRegSusContent = styled.div`
  font-size: 14px;
  text-align: center;
  margin-bottom: 15px;
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

  const [openLogin, setOpenLogin] = useState(true);
  const [openRegister, setOpenRegister] = useState(false);

  //login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  // register
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [openRegSus, setOpenRegSus] = useState(false);

  // validations
  const validationErrors = {};
  const [loginValidErrors, setLoginValidErrors] = useState({});
  const [regValidErrors, setRegValidErrors] = useState({});

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
    // facebook provider need a real shop to initiate
    // await signIn("facebook", {
    //   callbackUrl: process.env.NEXT_PUBLIC_URL,
    // });
  }

  function saveAddress() {
    const data = { name, email, city, streetAddress, postalCode, country };
    axios.put("/api/address", data);
  }

  function openRegPageHandle() {
    setOpenRegSus(false);
    setOpenLogin(false);
    setOpenRegister(true);
  }

  function openLoginPageHandle() {
    setOpenRegSus(false);
    setOpenRegister(false);
    setOpenLogin(true);
  }

  async function handleRegister(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }

    if (!regEmail.trim()) {
      validationErrors.regEmail = "必填";
    } else if (!checkEmail(regEmail)) {
      validationErrors.regEmail = "請提供真實的信箱";
    }

    if (!regPassword.trim()) {
      validationErrors.regPassword = "必填";
    } else if (regPassword.length < 6 || regPassword.length > 16) {
      validationErrors.regPassword = "密碼字數需要介於 6 ~ 16 之間";
    } else if (!checkPassword(regPassword.trim())) {
      validationErrors.regPassword = "輸入的密碼請包含英文、數字";
    }

    if (regPassword2 !== regPassword) {
      validationErrors.regPassword2 = "與之前輸入的密碼不相符";
    }

    setRegValidErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post("api/register", {
          userEmail: regEmail,
          password: regPassword,
        })
        .then((response) => {
          setRegEmail("");
          setRegPassword("");
          setRegPassword2("");
          setOpenRegister(false);
          setOpenRegSus(true);
        });
    }
  }

  async function handleLogin(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }

    const validationErrors = {};

    if (!loginEmail.trim()) {
      validationErrors.loginEmail = "必填";
    } else if (!checkEmail(loginEmail)) {
      validationErrors.loginEmail = "請提供真實的信箱";
    }

    if (!loginPassword.trim()) {
      validationErrors.loginPassword = "必填";
    } else if (loginPassword.length < 6 || loginPassword.length > 16) {
      validationErrors.loginPassword = "密碼字數需要介於 6 ~ 16 之間";
    } else if (!checkPassword(loginPassword.trim())) {
      validationErrors.loginPassword = "輸入的密碼請包含英文、數字";
    }

    setLoginValidErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: loginEmail,
          password: loginPassword,
          callbackUrl: "http://localhost:4000/account", // production 時需要改掉
        });
        if (res?.error) return setLoginError(res.error);
        router.replace("/account");
      } catch (error) {
        console.error("登入期間發生錯誤：", error);
      }
    }
  }

  function checkPassword(value) {
    let password = /^[A-Za-z0-9]{6,30}$/;
    if (value.match(password)) {
      return true;
    } else {
      return false;
    }
  }

  function checkEmail(value) {
    const emailPattern = /^[\w\.-]{1,64}@[\w\.-]{1,255}$/;
    if (value.match(emailPattern)) {
      return true;
    } else {
      return false;
    }
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

                    <MuiButton
                      variant="contained"
                      color="info"
                      onClick={saveAddress}
                      fullWidth={true}
                    >
                      儲存
                    </MuiButton>
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
                {!session && openLogin && (
                  <>
                    <form onSubmit={handleLogin}>
                      <StyledInputWrapper>
                        <StyledLoginInput
                          label="Email"
                          name="email"
                          type="email"
                          value={loginEmail}
                          placeholder="電子信箱"
                          onChange={(event) => {
                            setLoginEmail(event.target.value);
                          }}
                        />
                        <StyledErrorTag>
                          <span>{loginValidErrors.loginEmail}</span>
                        </StyledErrorTag>
                        <StyledLoginInput
                          label="Password"
                          name="password"
                          type="password"
                          autocomplete="current-password"
                          value={loginPassword}
                          placeholder="密碼"
                          onChange={(event) => {
                            setLoginPassword(event.target.value);
                          }}
                        />
                        <StyledErrorTag>
                          {loginValidErrors.loginPassword && (
                            <span>{loginValidErrors.loginPassword}</span>
                          )}
                        </StyledErrorTag>
                      </StyledInputWrapper>

                      <MuiButton
                        type="submit"
                        variant="contained"
                        color="info"
                        fullWidth={true}
                        sx={{ mb: 0.2, borderRadius: "6px" }}
                      >
                        登入
                      </MuiButton>

                      <StyledRegCTA>
                        還沒有帳號嗎? &thinsp;{" "}
                        <a href="#" onClick={openRegPageHandle}>
                          點我註冊!
                        </a>
                      </StyledRegCTA>

                      <Line>
                        <span>使用以下帳號快速登入</span>
                      </Line>

                      <LoginButtonWrapper>
                        <StyledGoogleButton
                          variant="outlined"
                          color="error"
                          fullWidth={true}
                          sx={{
                            px: 1.2,
                            py: 1.5,
                          }}
                          onClick={loginGoogle}
                        >
                          <GoogleIcon />
                        </StyledGoogleButton>
                        <StyledFacebookButton
                          variant="outlined"
                          color="error"
                          fullWidth={true}
                          sx={{
                            px: 1.2,
                            py: 1.5,
                          }}
                          onClick={loginFacebook}
                        >
                          <FacebookIcon />
                        </StyledFacebookButton>
                        <StyledAppleButton
                          variant="outlined"
                          color="error"
                          fullWidth={true}
                          sx={{
                            px: 1.2,
                            py: 1.5,
                          }}
                          onClick={loginFacebook}
                        >
                          <AppleIcon />
                        </StyledAppleButton>
                      </LoginButtonWrapper>
                    </form>
                  </>
                )}
                {!session && openRegister && (
                  <>
                    <form onSubmit={handleRegister}>
                      <h2>立即註冊</h2>
                      <StyledInputWrapper>
                        <StyledRegInput
                          type="email"
                          value={regEmail}
                          placeholder="請輸入電子信箱"
                          onChange={(event) => {
                            setRegEmail(event.target.value);
                          }}
                        />
                        <StyledErrorTag>
                          {regValidErrors.regEmail && (
                            <span>{regValidErrors.regEmail}</span>
                          )}
                        </StyledErrorTag>
                        <StyledRegInput
                          type="password"
                          value={regPassword}
                          placeholder="請輸入密碼 ( 6~16位英數混合 )"
                          autocomplete="current-password"
                          onChange={(event) => {
                            setRegPassword(event.target.value);
                          }}
                        />
                        <StyledErrorTag>
                          {regValidErrors.regPassword && (
                            <span>{regValidErrors.regPassword}</span>
                          )}
                        </StyledErrorTag>
                        <StyledRegInput
                          type="password"
                          value={regPassword2}
                          placeholder="確認密碼"
                          autocomplete="current-password"
                          onChange={(event) => {
                            setRegPassword2(event.target.value);
                          }}
                        />
                        <StyledErrorTag>
                          {regValidErrors.regPassword2 && (
                            <span>regValidErrors.regPassword2</span>
                          )}
                        </StyledErrorTag>
                      </StyledInputWrapper>
                      <MuiButton
                        type="submit"
                        variant="contained"
                        color="info"
                        fullWidth={true}
                        sx={{ mb: 0.2, borderRadius: "6px" }}
                      >
                        註冊
                      </MuiButton>
                      <StyledLoginCTA>
                        已經擁有帳號? &thinsp;{" "}
                        <a href="#" onClick={openLoginPageHandle}>
                          立即登入
                        </a>
                      </StyledLoginCTA>
                    </form>
                  </>
                )}
                {!session && openRegSus && (
                  <StyledRegSusWrapper>
                    <SuccessIcon />
                    <StyledRegSusTitle>註冊成功</StyledRegSusTitle>
                    <StyledRegSusContent>
                      點擊下列按鈕以完成登錄
                    </StyledRegSusContent>

                    <MuiButton
                      onClick={openLoginPageHandle}
                      variant="contained"
                      color="success"
                      fullWidth={true}
                    >
                      返回登入畫面
                    </MuiButton>
                  </StyledRegSusWrapper>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
