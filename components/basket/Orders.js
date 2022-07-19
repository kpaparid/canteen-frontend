import {
  faAngleDown,
  faCheckCircle,
  faCircleXmark,
  faEnvelopeOpenText,
  faList,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { Accordion, Modal, Nav, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import useAPI from "../../hooks/useAPI";
import { clearCart, selectOrders } from "../../reducer/redux2";
import OrderTracker from "../OrderTracker";
export const useOrders = () => {
  const { socket } = useSocket();
  const { currentUser } = useAuth();
  const { fetchUserTodaysOrders, fetchSettings, updateOrderStatus, dispatch } =
    useAPI();
  const orders = useSelector(selectOrders);
  const ordersExist = orders?.length !== 0;

  useEffect(() => {
    socket?.emit("join_room", "shopIsOpen");
    currentUser?.uid && socket?.emit("join_room", currentUser.uid);
  }, [socket, currentUser?.uid]);

  useEffect(() => {
    if (socket) {
      socket.on("updated_order", (data) => {
        console.log(`received updated order`);
        fetchUserTodaysOrders();
      });
      socket.on("updated_shop", (data) => {
        console.log(`received updated shop`);
        !data && dispatch(clearCart());
        fetchSettings({ suffix: "?uid=shopIsOpen" });
      });
    }
  }, [socket, fetchSettings, fetchUserTodaysOrders, dispatch]);

  return { orders, ordersExist };
};
const Orders = memo((props) => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 767.97px)" });
  return (
    <>{isBigScreen ? <OrdersBody {...props} /> : <OrdersModal {...props} />}</>
  );
}, isEqual);

export const OrdersBody = memo(({ orders }) => {
  const sortedOrders = [...orders].sort((a, b) =>
    moment(a.createdAt).isBefore(b.createdAt) ? 1 : -1
  );
  return (
    <>
      {orders.length === 1 ? (
        <OrderTracker {...sortedOrders[0]} />
      ) : (
        <Accordion
          className="accordion-order-list"
          defaultActiveKey={sortedOrders[0].id}
        >
          {sortedOrders?.map((o) => (
            <Accordion.Item
              eventKey={o.id}
              key={o.id}
              className="accordion-item-order"
            >
              <Accordion.Header className="p-0 my-0 align-items-center">
                <div className="flex-fill d-flex flex-nowrap justify-content-between text-dark pe-3">
                  <div className="d-flex flex-column align-items-start font-small fw-bolder">
                    <span>{o.number}</span>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body className="m-1 p-0">
                <OrderTracker {...o} />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </>
  );
}, isEqual);

const OrderStatus = memo(({ status, time, updatedAt }) => {
  const statusVariants = [
    "pending",
    "confirmed",
    "ready",
    "finished",
    // "canceled",
  ];

  const CustomNav = memo(({ eventKey, index }) => {
    const activeIndex = statusVariants.indexOf(status);
    return (
      <Nav.Item>
        <div
          // eventKey={eventKey}
          className={`p-bar ${
            (eventKey === "finished" && index === activeIndex) ||
            index < activeIndex
              ? "finished"
              : index === activeIndex
              ? "active"
              : ""
          }`}
        ></div>
      </Nav.Item>
    );
  }, isEqual);

  const CustomPane = memo(({ eventKey, icon, text, children }) => {
    return (
      <>
        {status === eventKey && (
          <Tab.Pane eventKey={eventKey}>
            {text && <div className="font-small fw-bolder">{text}</div>}
            {icon && (
              <FontAwesomeIcon
                className="w-25 h-25 text-primary py-4"
                icon={icon}
              />
            )}
            {children}
          </Tab.Pane>
        )}
      </>
    );
  }, isEqual);

  CustomNav.displayName = "CustomNav";
  CustomPane.displayName = "CustomPane";

  return (
    <div className="order-status-tab pt-3">
      <Tab.Container activeKey={status}>
        {status !== "canceled" && (
          <Nav className="w-100 py-2">
            {statusVariants.map((s, index) => (
              <CustomNav eventKey={s} key={s} index={index} />
            ))}
          </Nav>
        )}
        <Tab.Content>
          <CustomPane
            eventKey="pending"
            text="Order Sent. Waiting for an approval..."
            icon={faEnvelopeOpenText}
          />
          <CustomPane
            eventKey="confirmed"
            // text="Order Accepted. We are working on it..."
            // icon={faKitchenSet}
          ></CustomPane>
          <CustomPane
            eventKey="ready"
            text="Order is ready to pick up!"
            icon={faCheckCircle}
          />
          <CustomPane
            eventKey="finished"
            text="Order executed successfully."
            icon={faThumbsUp}
          />
          <CustomPane
            eventKey="canceled"
            text="Order canceled. Reason: bla bla"
            icon={faCircleXmark}
          />
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}, isEqual);

export const OrdersModal = memo(
  ({ orders, fullscreen = true, renderToggle = () => <></> }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => {
      setShow(false);
    };
    const handleShow = () => setShow(true);

    return (
      <>
        {renderToggle({
          icon: faList,
          text: "Bestellungen",
          onClick: handleShow,
          disabled: orders?.length === 0,
          number: orders?.length,
        })}
        <Modal
          show={show}
          onHide={handleClose}
          fullscreen={fullscreen}
          contentClassName={`cart basket-modal ${
            orders.length === 1 ? "nofooter" : ""
          }`}
        >
          <Modal.Header closeVariant="white" className="bg-primary" closeButton>
            <span>Bestellungen</span>
          </Modal.Header>
          <OrdersBody orders={orders} />
        </Modal>
      </>
    );
  },
  isEqual
);
export default Orders;

Orders.displayName = "Orders";
OrdersBody.displayName = "OrdersBody";
OrderStatus.displayName = "OrderStatus";
OrdersModal.displayName = "OrdersModal";
