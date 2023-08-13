import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import { useSession } from "next-auth/react";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.3fr 0.8fr;
  }
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 40px;
  table thead tr th:nth-child(3),
  table tbody tr td:nth-child(3),
  table tbody tr.subtotal td:nth-child(2) {
    text-align: right;
  }
  table tr.subtotal td {
    padding: 15px 0;
  }
  table tbody tr.subtotal {
    font-size: 0.8rem;
  }
  tr.total td {
    font-size: 1rem;
    font-weight: bold;
  }
`;

const ProductInfoCell = styled.td`
  padding: 10px 0px;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    width: 100px;
    height: 100px;
    padding: 10px;
  }
`;

const QuantityLabel = styled.span`
  padding: 0 14px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window?.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
    axios.get("/api/settings?name=shippingFee").then((response) => {
      setShippingFee(response.data.value);
    });
  }, []);
  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get("/api/address").then((response) => {
      setName(response?.data?.name);
      setEmail(response?.data?.email);
      setCity(response?.data?.city);
      setPostalCode(response?.data?.postalCode);
      setStreetAddress(response?.data?.streetAddress);
      setCountry(response?.data?.country);
    });
  }, [session]);

  function moreOfThisProduct(productId) {
    addProduct(productId);
  }
  function lessOfThisProduct(productId) {
    removeProduct(productId);
  }
  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }
  let productsTotal = 0;
  for (const productId of cartProducts) {
    const price =
      products.find((product) => {
        return product._id === productId;
      })?.price || 0;
    productsTotal += price;
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <WhiteBox>
              <h1>感謝您的購買 !</h1>
              <p>當我們出貨時會以電子郵件通知您。</p>
            </WhiteBox>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }
  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <RevealWrapper delay={0}>
            <WhiteBox>
              <h2>購物車</h2>
              {!cartProducts?.length && <div>購物車內沒有任何商品</div>}
              {products?.length > 0 && (
                <Table>
                  <thead>
                    <tr>
                      <th>商品名稱</th>
                      <th>數量</th>
                      <th>價格</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <ProductInfoCell>
                          <ProductImageBox>
                            <img src={product.images[0]} alt="" />
                          </ProductImageBox>
                          {product.title}
                        </ProductInfoCell>
                        <td>
                          <Button
                            onClick={() => {
                              lessOfThisProduct(product._id);
                            }}
                          >
                            -
                          </Button>
                          <QuantityLabel>
                            {
                              cartProducts.filter((id) => id === product._id)
                                .length
                            }
                          </QuantityLabel>
                          <Button
                            onClick={() => {
                              moreOfThisProduct(product._id);
                            }}
                          >
                            +
                          </Button>
                        </td>
                        <td>
                          {cartProducts.filter((id) => {
                            return id === product._id;
                          }).length * product.price}
                        </td>
                      </tr>
                    ))}
                    <tr className="subtotal">
                      <td colSpan={2}>商品總金額</td>
                      <td>${productsTotal}</td>
                    </tr>
                    <tr className="subtotal">
                      <td colSpan={2}>運費總金額</td>
                      <td>${shippingFee}</td>
                    </tr>
                    <tr className="subtotal total">
                      <td colSpan={2}>總付款金額</td>
                      <td>
                        ${parseInt(productsTotal) + parseInt(shippingFee)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </WhiteBox>
          </RevealWrapper>

          <RevealWrapper delay={100}>
            {!!cartProducts?.length && (
              <WhiteBox>
                <h2>訂單資訊</h2>
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
                <Button black block onClick={goToPayment}>
                  前往付款
                </Button>
              </WhiteBox>
            )}
          </RevealWrapper>
        </ColumnsWrapper>
      </Center>
    </>
  );
}
