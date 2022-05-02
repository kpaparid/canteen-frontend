import {
  faAngleDown,
  faCartShopping,
  faCheckCircle,
  faCircleXmark,
  faEnvelopeOpenText,
  faFileSignature,
  faKitchenSet,
  faList,
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
import { formatPrice } from "../../utilities/utils";
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
    moment(a.createdAt).isBefore(b.createdAt) ? 1 : -1
  );
  return (
    <div className="w-100">
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
                    className={`text-align-middle font-small fw-bold rounded p-2 bg-${o.status}`}
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
        {status !== "canceled" && (
          <Nav className="w-100 py-2">
            {statusVariants.map((s, index) => (
              <CustomNav eventKey={s} index={index} />
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
  ({
    createdAt,
    status,
    pickupTime,
    user,
    price,
    id,
    number,
    items,
    onNext,
    setKey,
  }) => {
    const Detail = ({ left, right }) => (
      <div>
        <span className="font-small fw-bold">{left}</span>
        <span className="font-small fw-bolder ps-2">{right}</span>
      </div>
    );
    return (
      <div className="order-overview">
        <OrderStatus status={status} />
        <div className="order-details">
          <Detail left="Bestellnummer:" right={number} />
          <Detail left="Uhr:" right={moment(createdAt).format("HH:mm")} />
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
        </div>
      </div>
    );
  },
  isEqual
);
function CustomToggle({ children, eventKey, setActive }) {
  const handleClick = () => {
    setActive(eventKey);
  };
  const decoratedOnClick = useAccordionButton(eventKey, handleClick);

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
  active,
  setActive,
}) => {
  return (
    <>
      <Accordion.Item eventKey={index}>
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
                  <div className="col-12 d-flex flex-nowrap">
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
export const OrdersModal = ({ orders }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      {orders?.length !== 0 && (
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
          <span className="basket-toggle-title bg-white rounded-circle px-2 text-primary fw-bolder">
            {orders.length}
          </span>
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
        <OrdersBody orders={orders} />
      </Modal>
    </>
  );
};
export default Orders;
