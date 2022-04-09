import {
  faBasketShopping,
  faCartArrowDown,
  faCartPlus,
  faCartShopping,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce, isEqual } from "lodash";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Col, Form, Modal, Nav, Row, Tab, Tabs } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  addCommentCart,
  postOrders,
  removeItemCart,
  selectCart,
  selectOrders,
  updateItemCountCart,
} from "../reducer/redux2";
import { formatPrice } from "../utilities/utils";
import Accumulator from "./Accumulator";
import { useSocket } from "../hooks/orderHooks";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import { nanoid } from "@reduxjs/toolkit";
// eslint-disable-next-line react/display-name

export const useRightSideBar = () => {
  const cart = useCart();
  const orders = useOrders();
  return { cart, orders };
};

const useOrders = () => {
  const orders = useSelector(selectOrders);
  const ordersExist = orders?.length !== 0;
  return { orders, ordersExist };
};
const Orders = ({ orders }) => {
  const sortedOrders = [...orders].sort((a, b) =>
    moment(a.timestamp).isBefore(b.createdAt) ? 1 : -1
  );
  return (
    <div className="py-3 d-flex flex-column w-100">
      {sortedOrders?.map((o) => {
        const variant = o.status;
        return (
          <div className="py-1 px-3 w-100">
            <Button
              variant={variant}
              className="w-100 d-flex justify-content-between"
            >
              <span>{nanoid(6)}</span>
              <span>{moment(o.createdAt).format("HH:mm")}</span>
            </Button>
          </div>
        );
      })}
    </div>
  );
};
const Basket = () => {
  const { orders, ordersExist } = useOrders();
  const { items } = useCart();
  const [activeKey, setActiveKey] = useState("cart");
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey={activeKey}>
      <div className="basket">
        <div className="basket-header">
          <Nav>
            <Nav.Item className="flex-fill">
              <Nav.Link as={Button} eventKey="cart">
                Warenkorb
              </Nav.Link>
            </Nav.Item>
            {ordersExist && (
              <Nav.Item className="flex-fill">
                <Nav.Link as={Button} eventKey="orders">
                  Orders
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </div>
        <Col sm={12}>
          <Tab.Content>
            <Tab.Pane eventKey="cart">
              <CartCard />
            </Tab.Pane>
            {ordersExist && (
              <Tab.Pane eventKey="orders">
                <Orders orders={orders} />
              </Tab.Pane>
            )}
          </Tab.Content>
        </Col>
      </div>
    </Tab.Container>
  );
};

const useCart = () => {
  const socket = useSocket();
  const items = useSelector(selectCart);
  const empty = !items?.length !== 0;
  const dispatch = useDispatch();
  const summa = items && items?.reduce((a, b) => a + b.calculatedPrice, 0);
  const formattedSumma = formatPrice(summa) + " €";

  const handleOrderClick = useCallback(async () => {
    dispatch(postOrders({ items: items, user: "kostas" })).then(() =>
      socket.emit("send_order", { test: "hi" })
    );
  }, [socket, items]);

  useEffect(() => {
    function handleEvent(payload) {
      console.log(payload);
    }
    if (socket) {
      socket.on("updated_order", handleEvent);
    }
  }, [socket]);

  const header = <span>Warenkorb</span>;
  const body = items.length ? (
    items?.map((i) => <CartItem key={i.id} {...i} />)
  ) : (
    <div className="p-5 d-flex flex-column">
      <FontAwesomeIcon
        className="pb-4 text-primary"
        size="4x"
        icon={faBasketShopping}
      />
      <div className="text-center font-small">
        Füllen Sie Ihren Warenkorb mit den Produkten auf der linken Seite
      </div>
    </div>
  );
  const footer = (
    <>
      {summa ? (
        <div className="d-flex flex-nowrap justify-content-between font-bolder text-gray-900">
          <span>Gesamt</span>
          <span>{formattedSumma}</span>
        </div>
      ) : (
        <></>
      )}
      <div className="d-flex w-100 pt-2">
        <Button className="m-auto" variant="primary" onClick={handleOrderClick}>
          Weiter
        </Button>
      </div>
    </>
  );
  return {
    header,
    body,
    footer,
    summa,
    items,
    empty,
    formattedSumma,
    onOrder: handleOrderClick,
  };
};
const CartModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { formattedSumma, items, body, onOrder } = useCart();
  return (
    <>
      {items.length !== 0 && (
        <div className="cart-toggle">
          <Button className="header-text" onClick={handleShow}>
            <FontAwesomeIcon icon={faCartShopping} />
            <span
              className="px-4
            "
            >
              Warenkorb
            </span>
            <span>({formattedSumma})</span>
          </Button>
        </div>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        fullscreen
        contentClassName="cart"
      >
        <Modal.Header closeVariant="white" className="bg-primary" closeButton>
          <span>Warenkorb</span>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button
            className="px-5 d-flex flex-wrap justify-content-center header-text"
            onClick={onOrder}
          >
            <span>Bestellen</span>{" "}
            <span className="px-1">({formattedSumma})</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
const CartCard = () => {
  const { header, body, footer } = useCart();
  return (
    <div className="cart">
      {/* <Card.Header className="d-flex font-bolder px-4 pt-3 pb-3">
        {header}
      </Card.Header> */}
      <Card.Body>{body}</Card.Body>
      <Card.Footer>{footer}</Card.Footer>
    </div>
  );
};
const Cart = memo(() => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 992px)" });

  return <Basket></Basket>;

  // return <>{isBigScreen ? <CartCard /> : <CartModal />}</>;
}, isEqual);

// eslint-disable-next-line react/display-name
const CartItem = memo(
  ({ count: count = 1, extras, id, calculatedPrice, title, comment }) => {
    const dispatch = useDispatch();
    const extrasText = extras.map(({ text }) => text)?.join(", ");
    const handleIncrease = (v) =>
      dispatch(updateItemCountCart({ id, add: true }));
    const handleDecrease = (v) =>
      dispatch(updateItemCountCart({ id, add: false }));
    const handleDelete = (v) => dispatch(removeItemCart(id));
    const handleCommentChange = (comment) => {
      return dispatch(addCommentCart({ id, comment }));
    };

    return (
      <div className="d-flex w-100 flex-wrap">
        <div className="ps-4 col-8 m-0 font-small fw-bolder text-gray-900">
          {title}
        </div>
        <div className="col-4 pe-4 text-end d-flex justify-content-end">
          <Button
            variant="transparent"
            className="p-1 rounded-circle d-flex"
            style={{ width: "25px", height: "25px" }}
            onClick={handleDelete}
          >
            <FontAwesomeIcon className="m-auto" icon={faClose} />
          </Button>
        </div>
        {extras.length !== 0 && (
          <div className="px-4 col-11 font-small text-gray-700">
            Extras: {extrasText}
          </div>
        )}
        <Comment text={comment} onChange={handleCommentChange} />
        <div className="col-8 pt-1 ps-4">
          <Accumulator
            count={count}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        </div>
        <div className="pe-4 font-small fw-bold col-4 m-0 text-end d-flex align-items-end justify-content-end">
          {formatPrice(calculatedPrice)} €
        </div>
        <div className="border-bottom w-100 m-3"></div>
      </div>
    );
  },
  isEqual
);

const Comment = ({ text: initialText, onChange }) => {
  const [text, setText] = useState(initialText);
  const length = `${text?.length || "0"}/160`;

  const [show, setShow] = useState(false);
  const handleChange = useCallback((e) => onChange(e.target.value), [onChange]);

  const debouncedChangeHandler = useMemo(() => {
    return debounce(handleChange, 3000);
  }, [handleChange]);
  const handleDirectChange = useCallback(
    (e) => {
      setText(e.target.value);
      debouncedChangeHandler(e);
    },
    [debouncedChangeHandler]
  );
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  return (
    <div className={`col-12 comment ${!show ? "" : "open"}`}>
      <Form.Label
        onClick={() => setShow((old) => !old)}
        className="px-4 m-0 py-2 text-light-blue font-small fw-bold"
      >
        Anmerkung {!show && text ? "bearbeiten" : "hinzufügen"}
      </Form.Label>
      <div className={`textarea-wrapper bg-octonary overflow-hidden `}>
        <div className={`h-100 p-4 w-100`}>
          <Form.Control
            className={`border-1 font-small w-100 border-gray-400`}
            onChange={handleDirectChange}
            as="textarea"
            rows={3}
            resize={"false"}
            maxLength={160}
            value={text}
            autoFocus
            onBlur={() => setShow(false)}
          />
          <div className="m-auto mt-1 me-2 font-small text-end">{length}</div>
        </div>
      </div>
      <div
        className={`px-4 pb-2 text-gray-700 font-small text-break text-wrap comment-text ${
          show ? "opacity-0" : "opacity-100"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default Cart;
