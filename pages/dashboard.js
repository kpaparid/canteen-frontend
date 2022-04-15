import { useStore } from "react-redux";
import Dashboard from "../components/OrderApp";
import {
  fetchCategories,
  fetchMeals,
  fetchOrders,
  fetchShop,
  wrapper,
} from "../reducer/redux2";

export default function Home(props) {
  console.log("State on render", useStore().getState(), props);
  return <Dashboard {...props} />;
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      const promises = [
        store.dispatch(fetchOrders()),
        store.dispatch(fetchMeals()),
      ];
      await Promise.all(promises);
      return {
        props: {},
      };
    }
);
