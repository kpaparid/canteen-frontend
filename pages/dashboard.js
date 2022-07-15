import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import useSound from "use-sound";
import TwoColumnsOrders from "../components/TwoColumnsOrders";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
// import { useSocket } from "../hooks/orderHooks";
import useAPI from "../hooks/useAPI";
import notification from "../public/notification.mp3";
import {
  clearError,
  fetchMealsThunk,
  fetchSettingsThunk,
  selectAllOrdersByCategory,
  wrapper,
} from "../reducer/redux2";

const Home = memo(() => {
  const orders = useSelector(selectAllOrdersByCategory);
  const { socket } = useSocket();
  const {
    fetchTodaysOrders,
    updateOrderStatus,
    fetchSettings,
    postShopIsOpen,
    dispatch,
  } = useAPI();
  const [play] = useSound(notification);
  const [loading, setLoading] = useState();
  const error = useSelector((state) => state.shop.error);

  useEffect(() => {
    fetchTodaysOrders().then((r) => {
      // const socket = connect();
      socket?.emit("join_room", [
        ...new Set(r?.payload?.map((p) => p.user.uid)),
        "admin",
        "shopIsOpen",
      ]);
    });
  }, [socket, fetchTodaysOrders]);

  useEffect(() => {
    socket?.on("received_order", (data) => {
      play();
      fetchTodaysOrders().then((r) => {
        socket.emit("join_room", [
          ...new Set(r?.payload?.map((p) => p.user.uid)),
          "admin",
          "shopIsOpen",
        ]);
      });
    });
  }, [socket, fetchTodaysOrders, play]);
  const onChangeOrderStatus = (userId, orderId, body) => {
    setLoading(true);
    return updateOrderStatus(orderId, body).then(async () => {
      socket?.emit("update_order", { uid: userId });
      setLoading(false);
    });
  };
  const onChangeShopStatus = useCallback(
    (value) => {
      return postShopIsOpen(value)
        .then((r) => fetchSettings({ suffix: "?uid=shopIsOpen" }))
        .then(() => socket?.emit("update_shop", value));
    },
    [socket, postShopIsOpen, fetchSettings]
  );
  const handleClearError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );
  return (
    <>
      <Modal
        show={error}
        onHide={handleClearError}
        centered
        contentClassName="m-auto bg-transparent d-flex justify-content-center align-items-center border-0 shadow-none"
      >
        <Modal.Body className="p-0 bg-transparent">
          <Alert show={true} variant="danger d-flex flex-nowrap">
            <Alert.Heading className="m-0 pe-3 d-flex align-items-center">
              <div>Σφάλμα</div>
            </Alert.Heading>
            <div className="d-flex justify-content-end">
              <Button onClick={handleClearError} variant="transparent">
                <FontAwesomeIcon icon={faX} />
              </Button>
            </div>
          </Alert>
        </Modal.Body>
      </Modal>
      <TwoColumnsOrders
        orders={orders}
        socket={socket}
        loading={loading}
        onChangeOrderStatus={onChangeOrderStatus}
        onChangeShopStatus={onChangeShopStatus}
      />
    </>
  );
}, isEqual);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const promises = [
      store.dispatch(fetchSettingsThunk({ suffix: "?uid=shopIsOpen" })),
      store.dispatch(fetchMealsThunk({ suffix: "?uid=shopIsOpen" })),
    ];
    await Promise.all(promises);
    return {
      props: {},
    };
  }
);
export default Home;
