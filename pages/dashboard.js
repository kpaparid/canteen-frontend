import { isEqual } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TwoColumnsOrders from "../components/TwoColumnsOrders";
import { useSocket } from "../contexts/SocketContext";
// import { useSocket } from "../hooks/orderHooks";
import useAPI from "../hooks/useAPI";
import {
  changeOrderStatus,
  fetchMeals,
  fetchSettings,
  openCloseShop,
  selectAllOrdersByCategory,
  wrapper,
} from "../reducer/redux2";

const Home = memo(() => {
  const orders = useSelector(selectAllOrdersByCategory);
  const dispatch = useDispatch();
  // const { connect, socket } = useSocket();
  const { socket } = useSocket();
  const { fetchTodaysOrders } = useAPI();

  const [loading, setLoading] = useState();

  useEffect(() => {
    dispatch(fetchTodaysOrders()).then((r) => {
      // const socket = connect();
      socket?.emit("join_room", [
        ...new Set(r?.payload?.map((p) => p.user.uid)),
        "admin",
        "shopIsOpen",
      ]);
    });
  }, [socket]);

  useEffect(() => {
    console.log({ socket });
    if (socket) {
      socket.on("received_order", (data) => {
        console.log(`received order in admin ${data}`);
        dispatch(fetchTodaysOrders()).then((r) => {
          socket.emit("join_room", [
            ...new Set(r?.payload?.map((p) => p.user.uid)),
            "admin",
          ]);
        });
      });
    }
  }, [socket]);
  const onChangeOrderStatus = (userId, orderId, body) => {
    setLoading(true);
    console.log(socket);
    dispatch(changeOrderStatus({ id: orderId, body })).then(async () => {
      socket?.emit("update_order", { uid: userId });
      setLoading(false);
    });
  };
  const onChangeShopStatus = useCallback(
    (value) => {
      dispatch(openCloseShop(value))
        .then((r) => dispatch(fetchSettings({ suffix: "?uid=shopIsOpen" })))
        .then(() => socket?.emit("update_shop", value));
    },
    [dispatch, socket]
  );
  // return <Dashboard orders={orders} />;
  return (
    <TwoColumnsOrders
      orders={orders}
      socket={socket}
      loading={loading}
      onChangeOrderStatus={onChangeOrderStatus}
      onChangeShopStatus={onChangeShopStatus}
    />
  );
}, isEqual);

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
export default Home;
