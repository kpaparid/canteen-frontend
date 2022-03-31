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
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  addCommentCart,
  postOrders,
  removeItemCart,
  selectCart,
  updateItemCountCart,
} from "../reducer/redux2";
import { formatPrice } from "../utilities/utils";
import Accumulator from "./Accumulator";
import { useSocket } from "../hooks/orderHooks";
// eslint-disable-next-line react/display-name

const Cart = memo(() => {
  const items = useSelector(selectCart);
  const dispatch = useDispatch();
  const summa = items && items?.reduce((a, b) => a + b.calculatedPrice, 0);
  const socket = useSocket();

  const handleOrderClick = useCallback(async () => {
    dispatch(postOrders({ items, user: "kostas" }));
  }, [socket, items]);

  useEffect(() => {
    function handleEvent(payload) {
      console.log(payload);
    }
    if (socket) {
      socket.on("updated_order", handleEvent);
    }
  }, [socket]);

  return (
    <div variant="transparent" className="cart p-0 border-0">
      <Card.Header className="d-flex font-bolder px-4 pt-3 pb-3">
        <span className="">Warenkorb</span>
      </Card.Header>
      <Card.Body className="p-0">
        {items.length ? (
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
        )}
      </Card.Body>
      <Card.Footer className="pt-0">
        {summa ? (
          <div className="d-flex flex-nowrap justify-content-between font-bolder text-gray-900">
            <span>Gesamt</span>
            <span>{formatPrice(summa)} €</span>
          </div>
        ) : (
          <></>
        )}
        <div className="d-flex w-100 pt-2">
          <Button
            // disabled={!items.length}
            className="m-auto"
            variant="primary"
            onClick={handleOrderClick}
          >
            Weiter
          </Button>
        </div>
      </Card.Footer>
    </div>
  );
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
      <div className="pt-3 d-flex w-100 flex-wrap">
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
        {extras && (
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
        className={`px-4 pb-2 text-gray-700 font-small comment-text ${
          show ? "opacity-0" : "opacity-100"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default Cart;
