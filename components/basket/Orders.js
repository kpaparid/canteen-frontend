import {
  faAngleDown,
  faCartShopping,
  faCheckCircle,
  faCircleXmark,
  faEnvelopeOpenText,
  faKitchenSet,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import moment from "moment";
import { memo, useCallback, useState } from "react";
import {
  Accordion,
  Badge,
  Modal,
  Nav,
  Tab,
  useAccordionButton,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { selectOrders } from "../../reducer/redux2";
// eslint-disable-next-line react/display-name

export const useOrders = () => {
  const orders = useSelector(selectOrders);
  const ordersExist = orders?.length !== 0;
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
    moment(a.timestamp).isBefore(b.createdAt) ? 1 : -1
  );
  const [order, setOrder] = useState(orders.length === 1 ? orders[0] : null);
  const [activeKey, setActiveKey] = useState(
    orders.length === 1 ? "overview" : "orders"
  );
  const handleOrderClick = useCallback((o) => {
    setOrder(o);
    setActiveKey("overview");
  }, []);
  return (
    <div className="w-100">
      <Tab.Container activeKey={activeKey}>
        <Tab.Content>
          {activeKey === "orders" && (
            <Tab.Pane eventKey="orders" className="pane-order-list ">
              {sortedOrders?.map((o) => {
                return (
                  <Button
                    variant={"gray-100"}
                    onClick={() => handleOrderClick(o)}
                    className="d-flex justify-content-between px-2 my-1 mx-3 flex-nowrap align-items-center"
                  >
                    <div className="d-flex flex-column align-items-start font-small fw-bold">
                      <span>Bestellnummer: {o.id.substr(10, 5)}</span>
                      <span>Uhr: {moment(o.timestamp).format("HH:mm")}</span>
                    </div>
                    <div
                      className={`text-align-middle font-small fw-bold rounded p-2 bg-${o.status}`}
                    >
                      {o.status}
                    </div>
                  </Button>
                );
              })}
            </Tab.Pane>
          )}
          {activeKey === "overview" && (
            <Tab.Pane eventKey="overview">
              <OrderOverview {...order} />
              {orders.length !== 1 && (
                <div className="d-flex py-2 border-top">
                  <Button
                    className="m-auto header-text"
                    onClick={() => setActiveKey("orders")}
                  >
                    View Orders
                  </Button>
                </div>
              )}
            </Tab.Pane>
          )}
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}, isEqual);

const OrderStatus = memo(({ status }) => {
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
          eventKey={eventKey}
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
  const CustomPane = memo(({ eventKey, icon, text }) => {
    return (
      <>
        {status === eventKey && (
          <Tab.Pane eventKey={eventKey}>
            <div className="font-small fw-bolder">{text}</div>
            <FontAwesomeIcon
              className="w-25 h-25 text-primary py-4"
              icon={icon}
            />
          </Tab.Pane>
        )}
      </>
    );
  }, isEqual);
  return (
    <div className="order-status-tab pt-3">
      <Tab.Container activeKey={status}>
        <Nav className="w-100 py-2">
          {status !== "canceled" &&
            statusVariants.map((s, index) => (
              <CustomNav eventKey={s} index={index} />
            ))}
        </Nav>
        <Tab.Content>
          <CustomPane
            eventKey="pending"
            text="Order Sent. Waiting for an approval..."
            icon={faEnvelopeOpenText}
          />
          <CustomPane
            eventKey="confirmed"
            text="Order Accepted. We are working on it..."
            icon={faKitchenSet}
          />
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
}, []);

const OrderOverview = memo(
  ({ createdAt, status, pickupTime, user, id, items, onNext, setKey }) => {
    return (
      <div className="order-overview">
        <OrderStatus status={status} />
        <div className="order-details border-bottom">
          <span className="font-small fw-bold">Ihre Bestellnummer:</span>
          <span className="font-small fw-bolder ps-2">{id.substr(0, 4)}</span>
        </div>
        <div className="my-2 order-list">
          <Accordion defaultActiveKey="0">
            {items.map((i, index) => (
              <Order
                {...i}
                index={index}
                key={i.itemId}
                length={items.length}
              />
            ))}
          </Accordion>
        </div>
      </div>
    );
  },
  isEqual
);
function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey);

  return (
    <Button
      variant="white"
      className="p-0 w-100 shadow-none rounded-0"
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}
const Order = ({
  index,
  count,
  price,
  title,
  extras,
  comment,
  calculatedPrice,
}) => {
  return (
    <>
      <CustomToggle eventKey={index}>
        <div className="d-flex justify-content-around align-items-end pe-1">
          <div className="flex-fill text-start d-flex flex-nowrap font-small fw-bold">
            <div className="text-end pe-2" style={{ minWidth: "30px" }}>
              {count}x
            </div>
            <div className="ps-1 flex-fill text-break break-wrap">{title}</div>
          </div>
          {(extras.length !== 0 || comment) && (
            <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
          )}
        </div>
      </CustomToggle>
      <Accordion.Collapse eventKey={index} className="font-small">
        <>
          {extras?.length !== 0 && (
            <div className="col-12">
              {extras?.map((e) => (
                <div className="col-12 d-flex flex-nowrap">
                  <div style={{ minWidth: "25px" }}></div>
                  <div className="ps-2 flex-fill">+ {e.text}</div>
                </div>
              ))}
            </div>
          )}
          {comment && (
            <i className="col-12 d-flex flex-nowrap px-2 pt-2 text-break text-wrap">
              {comment}
            </i>
          )}
        </>
      </Accordion.Collapse>

      <div className="w-100 border-bottom pb-2"></div>
    </>
  );
};
export const OrdersModal = ({ orders }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setActiveKey(orders.length === 1 ? "overview" : "orders");
  };
  const handleShow = () => setShow(true);

  const sortedOrders = [...orders].sort((a, b) =>
    moment(a.timestamp).isBefore(b.createdAt) ? 1 : -1
  );
  const [order, setOrder] = useState(orders.length === 1 ? orders[0] : null);
  const [activeKey, setActiveKey] = useState(
    orders.length === 1 ? "overview" : "orders"
  );
  const handleOrderClick = useCallback((o) => {
    setOrder(o);
    setActiveKey("overview");
  }, []);
  return (
    <>
      {orders?.length !== 0 && (
        <Button className="header-text" onClick={handleShow}>
          <span className="px-4">Bestellungen</span>
        </Button>
      )}

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
        <div className="w-100 modal-body-wrapper">
          <Tab.Container activeKey={activeKey}>
            <Tab.Content>
              {activeKey === "orders" && (
                <Tab.Pane eventKey="orders" className="d-flex flex-column">
                  <Modal.Body>
                    {sortedOrders?.map((o) => {
                      return (
                        <Button
                          variant={"gray-100"}
                          onClick={() => handleOrderClick(o)}
                          className="d-flex justify-content-between px-2 my-1 mx-3 flex-nowrap align-items-center"
                        >
                          <div className="d-flex flex-column align-items-start font-small fw-bold">
                            <span>Bestellnummer: {o.id.substr(10, 5)}</span>
                            <span>
                              Uhr: {moment(o.timestamp).format("HH:mm")}
                            </span>
                          </div>
                          <div
                            className={`text-align-middle font-small fw-bold rounded p-2 bg-${o.status}`}
                          >
                            {o.status}
                          </div>
                        </Button>
                      );
                    })}
                  </Modal.Body>
                </Tab.Pane>
              )}
              {activeKey === "overview" && (
                <Tab.Pane eventKey="overview">
                  <Modal.Body>
                    <OrderOverview {...order} />
                  </Modal.Body>
                  {orders.length !== 1 && (
                    <Modal.Footer>
                      <div className="d-flex pt-2">
                        <Button
                          className="m-auto header-text"
                          onClick={() => setActiveKey("orders")}
                        >
                          View Orders
                        </Button>
                      </div>
                    </Modal.Footer>
                  )}
                </Tab.Pane>
              )}
            </Tab.Content>
          </Tab.Container>
        </div>
      </Modal>
    </>
  );
};
export default Orders;
