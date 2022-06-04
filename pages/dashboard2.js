import format from "date-fns/format";
import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import Dashboard from "../components/OrderApp";
import TwoColumnsOrders from "../components/TwoColumnsOrders";
import { useSocket } from "../hooks/orderHooks";
import useAPI from "../hooks/useAPI";
import {
  fetchCategories,
  fetchMeals,
  fetchOrders,
  fetchSettings,
  fetchShop,
  selectAllOrdersByCategory,
  wrapper,
} from "../reducer/redux2";

export default function Home() {
  const orders = useSelector(selectAllOrdersByCategory);
  const dispatch = useDispatch();
  const { connect } = useSocket();
  const { fetchTodaysOrders } = useAPI();
  useEffect(() => {
    connect();
    dispatch(fetchTodaysOrders());
  }, []);
  return <Dashboard orders={orders} />;
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const promises = [
      store.dispatch(fetchMeals()),
      store.dispatch(fetchSettings({ suffix: "?uid=shopIsOpen" })),
    ];
    await Promise.all(promises);
    return {
      props: {},
    };
  }
);
