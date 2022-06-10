import {
  faAngleDown,
  faCheckCircle,
  faCircleXmark,
  faEnvelopeOpenText,
  faKitchenSet,
  faList,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _, { isEqual } from "lodash";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import {
  Accordion,
  Modal,
  Nav,
  Tab,
  useAccordionButton,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import useAPI from "../../hooks/useAPI";
import { selectOrders } from "../../reducer/redux2";
import {
  calcInterval,
  formatPrice,
  getDuration,
  useDurationHook,
} from "../../utilities/utils.mjs";
// eslint-disable-next-line react/display-name

import styledComponents from "styled-components";
import { formatDuration, parse } from "date-fns";
import OrderTracker from "../OrderTracker";
export const useOrders = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { fetchUserTodaysOrders } = useAPI();
  const orders = useSelector(selectOrders);
  const ordersExist = orders?.length !== 0;

  useEffect(() => {
    ordersExist &&
      currentUser &&
      (!socket
        ? connect().emit("join_room", currentUser.uid)
        : socket.emit("join_room", currentUser.uid));
  }, [orders]);

  useEffect(() => {
    if (socket) {
      socket.on("updated_order", (data) => {
        console.log(`received updated order`);
        dispatch(fetchUserTodaysOrders());
      });
    }
  }, [socket]);

  return { orders, ordersExist };
};
const Orders = memo((props) => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 992px)" });
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
        <OrderOverview {...sortedOrders[0]} />
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
                    <span>{moment(o.createdAt).format("HH:mm")}</span>
                  </div>
                  <div
                    className={`status text-align-middle font-small fw-bold rounded p-2 bg-${o.status}`}
                  >
                    {o.status}
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body className="m-1 py-0">
                <OrderOverview {...o} />
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

const OrderOverview = memo(
  ({ time, status, updatedAt, price, number, items }) => {
    const Detail = ({ left, right }) => (
      <div>
        <span className="font-small fw-bold">{left}</span>
        <span className="font-small fw-bolder ps-2">{right}</span>
      </div>
    );
    return (
      <div className="order-overview">
        <OrderTracker status={status} time={time} updatedAt={updatedAt} />
        {/* <OrderStatus status={status} time={time} updatedAt={updatedAt} />
        <div className="order-details">
          <Detail left="Bestellnummer:" right={number} />
          {time && <Detail left="Abholung:" right={time} />}
          <Detail left="Preis:" right={formatPrice(price)} />
        </div>
        <div className="order-list">
          <Accordion defaultActiveKey="0" flush>
            {items.map((i, index) => (
              <Order
                {...i}
                index={index}
                key={i.itemId}
                length={items.length}
              />
            ))}
          </Accordion>
        </div> */}
      </div>
    );
  },
  isEqual
);
const Order = ({
  index,
  count,
  price,
  title,
  extras,
  comment,
  calculatedPrice,
  active,
  setActive,
}) => {
  return (
    <>
      <Accordion.Item eventKey={index} className="bg-transparent">
        <Accordion.Header>
          <div
            className={`d-flex justify-content-around align-items-end pe-1 ${
              active === index ? "text-primary" : ""
            }`}
          >
            <div className="flex-fill text-start d-flex flex-nowrap font-small fw-bold">
              <div className="text-start" style={{ minWidth: "23px" }}>
                {count}x
              </div>
              <div className="ps-1 flex-fill text-break break-wrap">
                {title}
              </div>
            </div>
            {(extras?.length !== 0 || comment) && (
              <FontAwesomeIcon
                icon={faAngleDown}
                className="px-3"
              ></FontAwesomeIcon>
            )}
          </div>
        </Accordion.Header>
        <Accordion.Body>
          {extras?.length !== 0 && (
            <div className="col-12">
              {extras
                ?.reduce((a, b) => [...a, ...b.options], [])
                ?.map((e) => (
                  <div className="col-12 d-flex flex-nowrap" key={e.text}>
                    <div style={{ minWidth: "23px" }}></div>
                    <div className="ps-2 flex-fill">+ {e.text}</div>
                  </div>
                ))}
            </div>
          )}
          {comment && (
            <div className="comment">
              <i>{comment}</i>
            </div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
};
export const OrdersModal = memo(({ orders, renderToggle }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      {/* {orders?.length !== 0 && (
        <Button
          className="orders basket-toggle-btn d-flex justify-content-between align-items-center"
          onClick={handleShow}
        >
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faList} className="pe-2" />
            <span className="header-text basket-toggle-title">
              Bestellungen
            </span>
          </div>
          <span className="basket-toggle-title bg-white rounded-2 px-2 text-primary fw-bolder">
            {orders.length}
          </span>
        </Button>
      )} */}
      {/* <Button
        className="d-flex flex-column justify-content-around align-items-center mx-2 p-0 h-100"
        variant="white"
        onClick={handleShow}
      >
        <FontAwesomeIcon icon={faList} />
        <div className="font-small">Bestellungen</div>
      </Button> */}
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
        fullscreen
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
}, isEqual);
export default Orders;

Orders.displayName = "Orders";
OrdersBody.displayName = "OrdersBody";
OrderStatus.displayName = "OrderStatus";
OrderOverview.displayName = "OrderOverview";
OrdersModal.displayName = "OrdersModal";
