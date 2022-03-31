import Head from "next/head";
import "../scss/kpaparid.scss";
import "../styles/globals.css";

import { Provider } from "react-redux";
// import { createStore } from "../reducer/store";
import { wrapper } from "../reducer/redux2";
import { SSRProvider } from "react-bootstrap";

const WrappedApp = ({ Component, pageProps }) => {
  return (
    <SSRProvider>
      <Component {...pageProps} />
    </SSRProvider>
  );
};

export default wrapper.withRedux(WrappedApp);
