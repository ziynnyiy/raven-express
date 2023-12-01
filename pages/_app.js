import { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "@/components/CartContext";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { createTheme, ThemeProvider } from "@mui/material";
import { purple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4C1D95",
    },
    secondary: purple,
  },
  // typography: {
  //   fontFamily: "Poppins",
  //   fontWeightLight: 400,
  //   fontWeightRegular: 500,
  //   fontWeightMedium: 600,
  //   fontWeightBold: 700,
  // },
});

const GlobalStyles = createGlobalStyle`
body{
  background-color: #eee;
  padding:0;
  margin:0;
  font-family: 'Poppins', sans-serif;
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 300;
}
h1, h2, h3, h4, p {
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
  // useEffect(() => {
  //   // After component mount, change the rel attribute to "stylesheet"
  //   const linkElement = document.querySelector('link[rel="preload"]');
  //   if (linkElement) {
  //     linkElement.onload = () => {
  //       linkElement.rel = "stylesheet";
  //     };
  //   }
  // }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500&family=Poppins:wght@300;400;500;600;700;900&display=swap"
          />
        </Helmet>
        <GlobalStyles />
        <SessionProvider session={session}>
          <CartContextProvider>
            <Component {...pageProps} />
          </CartContextProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
