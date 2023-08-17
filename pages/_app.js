import { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "@/components/CartContext";
import { SessionProvider } from "next-auth/react";

const GlobalStyles = createGlobalStyle`

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500&family=Poppins:wght@300;400;500;600;700;900&display=swap');
body{
  background-color: #eee;
  padding:0;
  margin:0;
  font-family: 'Poppins', sans-serif;
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 300;
}
hr {
  display: block;
  border: 0;
  border-top: 1px solid #ccc;
}
`;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider>
    </>
  );
}
