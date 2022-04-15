import { useStore } from "react-redux";
import Menu from "../components/Menu";
import {
  fetchCategories,
  fetchMeals,
  fetchOrders,
  wrapper,
} from "../reducer/redux2";

export default function Home(props) {
  console.log("State on render", useStore().getState(), props);
  return (
    <div className="h-100 bg-white">
      {/* <Header /> */}
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
      const promises = [store.dispatch(fetchOrders()), shop];
      await Promise.all(promises);
      return {
        props: {},
      };
    }
);
