import Head from "next/head";
import "../scss/kpaparid.scss";
import "../styles/globals.css";

import { Provider } from "react-redux";
// import { createStore } from "../reducer/store";
import { wrapper } from "../reducer/redux2";

function MyApp({ Component, ...rest }) {
  // const { store, props } = wrapper.useWrappedStore(rest);
  const { store, props } = wrapper.withRedux(rest);
  return (
    <div className="hi">
      <Provider store={store}>
        <Head>
          <title>Cantine eFood</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {/* <Component {...pageProps} /> */}
        <Component {...props.pageProps} />
      </Provider>
    </div>
  );
}

// export default MyApp;

const WrappedApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default wrapper.withRedux(WrappedApp);
