import {
  faBasketShopping,
  faCartShopping,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce, isEqual } from "lodash";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {
  addCommentCart,
  postOrders,
  removeItemCart,
  selectCart,
  updateItemCountCart,
} from "../../reducer/redux2";
import { formatPrice } from "../../utilities/utils";
import { useSocket } from "../../hooks/orderHooks";
import Accumulator from "../Accumulator";
// eslint-disable-next-line react/display-name
export const useCart = () => {
  const socket = useSocket();
  const items = useSelector(selectCart);
  const cartExists = items?.length !== 0;
  const empty = !items?.length !== 0;
  const dispatch = useDispatch();
  const summa = items && items?.reduce((a, b) => a + b.calculatedPrice, 0);

  const handleSendOrder = useCallback(async () => {
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

  return {
    summa,
    items,
    empty,
    sendOrder: handleSendOrder,
    cartExists,
  };
};
const Cart = memo((props) => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 992px)" });

  return (
    <>{isBigScreen ? <CartCard {...props} /> : <CartModal {...props} />}</>
  );
}, isEqual);

export const CartModal = ({ items, summa, onSend }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const formattedSumma = formatPrice(summa);
  return (
    <>
      {items.length !== 0 && (
        // <div className="cart-toggle">
        <Button className="header-text basket-toggle-btn" onClick={handleShow}>
          <FontAwesomeIcon icon={faCartShopping} />
          <span
            className="px-4 basket-toggle-title
            "
          >
            Warenkorb
          </span>
          <span className="basket-toggle-price">{formattedSumma}</span>
        </Button>
        // </div>
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
        <Modal.Body>
          <CartBody items={items} />
        </Modal.Body>
        {items.length !== 0 && (
          <Modal.Footer>
            <CartFooter summa={summa} onSend={onSend} />
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

const CartCard = ({ items, summa, onSend }) => {
  return (
    <div className="cart">
      <Card.Body>
        <CartBody items={items} />
      </Card.Body>
      {items.length !== 0 && (
        <Card.Footer>
          <CartFooter summa={summa} onSend={onSend} />
        </Card.Footer>
      )}
    </div>
  );
};

const CartBody = ({ items }) => {
  return (
    <>
      {items.length ? (
        items?.map((i) => <CartItem key={i.id} {...i} />)
      ) : (
        <div className="p-5 d-flex flex-column">
          <FontAwesomeIcon
            className="pb-4 text-primary"
            size="4x"
            icon={faBasketShopping}
          />
          <div className="text-center font-small fw-bold">
            Füllen Sie Ihren Warenkorb mit den Produkten auf der linken Seite
          </div>
        </div>
      )}
    </>
  );
};
const CartFooter = ({ summa, onSend }) => {
  const formattedSumma = formatPrice(summa);
  return (
    <>
      <div className="d-flex w-100 pt-2">
        <Button variant="primary" onClick={onSend} className="m-auto">
          <span className="header-text">{formattedSumma}</span>
        </Button>
      </div>
    </>
  );
};
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
          {formatPrice(calculatedPrice)}
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
