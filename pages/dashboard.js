import format from "date-fns/format";
import { useStore } from "react-redux";
import Dashboard from "../components/OrderApp";
import {
  fetchCategories,
  fetchMeals,
  fetchOrders,
  fetchSettings,
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
      const date = format(new Date(), "yyyy-MM-dd") + "T00:00:00.000Z";
      const suffix = `?createdAt_gte=${date}`;
      const promises = [
        store.dispatch(fetchOrders({ suffix })),
        store.dispatch(fetchMeals()),
        store.dispatch(fetchSettings({ suffix: "?uid=shopIsOpen" })),
      ];
      await Promise.all(promises);
      return {
        props: {},
      };
    }
);
