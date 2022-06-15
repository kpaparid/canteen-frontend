import { useStore } from "react-redux";
import Menu from "../components/Menu";
import endOfDay from "date-fns/endOfDay";
import startOfDay from "date-fns/startOfDay";
import {
  fetchCategories,
  fetchMeals,
  fetchOrders,
  fetchSettings,
  wrapper,
} from "../reducer/redux2";
import { format } from "date-fns";

export default function Home(props) {
  return <Menu {...props} />;
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      const shop = store
        .dispatch(fetchMeals())
        .then(({ payload }) => store.dispatch(fetchCategories(payload)));

      const promises = [
        store.dispatch(fetchSettings({ suffix: "?uid=shopIsOpen" })),
        shop,
      ];
      await Promise.all(promises);
      return {
        props: {},
      };
    }
);
