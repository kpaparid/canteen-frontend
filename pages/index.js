import { useStore } from "react-redux";
import Menu from "../components/Menu";
import endOfDay from "date-fns/endOfDay";
import startOfDay from "date-fns/startOfDay";
import {
  fetchCategories,
  fetchMeals,
  fetchOrders,
  wrapper,
} from "../reducer/redux2";
import { format } from "date-fns";

export default function Home(props) {
  return (
    <div className="h-100 bg-white">
      <Menu {...props} />
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      const shop = store
        .dispatch(fetchMeals())
        .then(({ payload }) => store.dispatch(fetchCategories(payload)));
      // const date = format(new Date(), "yyyy-MM-dd") + "T00:00:00.000Z";
      // const user = "kostas";
      const promises = [
        // store.dispatch(
        //   fetchOrders({
        //     suffix: `?createdAt_gte=${date}&user=${user}`,
        //   })
        // ),
        shop,
      ];
      await Promise.all(promises);
      return {
        props: {},
      };
    }
);
