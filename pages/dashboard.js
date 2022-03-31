import { useStore } from "react-redux";
import Dashboard from "../components/OrderApp";
import { fetchOrders, wrapper } from "../reducer/redux2";

export default function Home(props) {
  console.log("State on render", useStore().getState(), props);
  return <Dashboard {...props} />;
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      await store.dispatch(fetchOrders());
      return {
        props: {},
      };
    }
);
