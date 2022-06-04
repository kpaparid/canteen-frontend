import Head from "next/head";
import "../scss/kpaparid.scss";
import "../styles/globals.css";

import { wrapper } from "../reducer/redux2";
import { SSRProvider } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import { SocketProvider } from "../contexts/SocketContext";

const WrappedApp = ({ Component, pageProps }) => {
  const protectedRoutes = [
    { url: "/admin", roles: ["admin", "super"] },
    { url: "/dashboard", roles: ["admin", "super"] },
  ];
  return (
    <SSRProvider>
      <AuthProvider>
        <SocketProvider>
          <Head>
            <meta name="color-scheme" content="light dark" />
          </Head>
          <PrivateRoute protectedRoutes={protectedRoutes}>
            <Component {...pageProps} />
          </PrivateRoute>
        </SocketProvider>
      </AuthProvider>
    </SSRProvider>
  );
};

export default wrapper.withRedux(WrappedApp);
