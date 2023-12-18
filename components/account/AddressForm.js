import axios from "axios";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Button as MuiButton } from "@mui/material";
import toast from "react-hot-toast";

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function AddressForm({ setAddressLoaded }) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");

  function saveAddress() {
    const data = { name, email, city, streetAddress, postalCode, country };
    axios.put("/api/address", data);
    toast.success("儲存成功 !");
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
  }, [session]);

  return (
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
  );
}
