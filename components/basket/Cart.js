import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
  faBasketShopping,
  faClose,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce, isEqual } from "lodash";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import useAPI from "../../hooks/useAPI";
import {
  addCommentCart,
  removeItemCart,
  selectCart,
  updateItemCountCart,
  addTime,
} from "../../reducer/redux2";
import { formatPrice } from "../../utilities/utils.mjs";
import Accumulator from "../Accumulator";
import PickupTimeModal from "../PickupTimerModal";
import ClosedSvg from "../svg/ClosedSvg";
import { UserModal } from "../User";
// eslint-disable-next-line react/display-name
export const useCart = () => {
  const { socket } = useSocket();
  // const { currentUser } = useAuth();
  const items = useSelector(selectCart);
  const time = useSelector((state) => state.shop.cart.time);
  const cartExists = items?.length !== 0;
  const empty = !items?.length !== 0;
  const summa = items && items?.reduce((a, b) => a + b.calculatedPrice, 0);
  const { postUserOrders, dispatch } = useAPI();

  const handleSendOrder = useCallback(async () => {
    postUserOrders({
      items: items,
      time,
    }).then(() => {
      socket?.emit("send_order");
    });
  }, [socket, items, time, postUserOrders]);

  const handleAddTime = useCallback(
    (value) => {
      dispatch(addTime(value));
    },
    [dispatch]
  );

  return {
    summa,
    items,
    empty,
    sendOrder: handleSendOrder,
    cartExists,
    addTime: handleAddTime,
  };
};
const Cart = memo((props) => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 767.97px)" });

  return (
    <>{isBigScreen ? <CartCard {...props} /> : <CartModal {...props} />}</>
  );
}, isEqual);

export const CartModal = ({
  fullscreen = true,
  items,
  summa,
  onSend,
  addTime,
  renderToggle = () => <></>,
  ...rest
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const formattedSumma = formatPrice(summa);

  const number = items.reduce((a, b) => a + b.count, 0);
  return (
    <>
      {renderToggle &&
        renderToggle({
          icon: faShoppingBag,
          text: "Warenkorb",
          onClick: handleShow,
          disabled: number === 0,
          number,
        })}
      <Modal
        show={show}
        onHide={handleClose}
        fullscreen={fullscreen}
        contentClassName="cart w-100"
      >
        <Modal.Header closeVariant="white" className="bg-primary" closeButton>
          <span>Warenkorb</span>
        </Modal.Header>
        <Modal.Body className="d-flex align-items-center">
          <CartBody items={items} {...rest} />
        </Modal.Body>
        {items.length !== 0 && (
          <Modal.Footer>
            <CartFooter
              number={number}
              summa={summa}
              onSend={onSend}
              addTime={addTime}
            />
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

const CartCard = ({ items, summa, onSend, addTime, shopEnabled }) => {
  const number = items.reduce((a, b) => a + b.count, 0);
  const footer = items.length !== 0;
  return (
    <div className={`cart ${!footer ? "empty" : ""}`}>
      <Card.Body>
        <CartBody items={items} shopEnabled={shopEnabled} />
      </Card.Body>
      {footer && (
        <Card.Footer className="p-3">
          <CartFooter
            number={number}
            summa={summa}
            onSend={onSend}
            addTime={addTime}
          />
        </Card.Footer>
      )}
    </div>
  );
};

const CartBody = ({ items, shopEnabled }) => {
  return (
    <>
      {!shopEnabled ? (
        <div className="h-100 align-items-center justify-content-center d-flex">
          <div
            className="py-3 d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "150px", maxHeight: "250px", height: "50vh" }}
          >
            <ClosedSvg />
            <div className="text-center fw-bold pt-4">
              Zurzeit sind wir geschlossen.
            </div>
          </div>
        </div>
      ) : items.length ? (
        items?.map((i) => <CartItem key={i.id} {...i} />)
      ) : (
        <div
          className="py-3 d-flex flex-column aling-items-center justify-content-center"
          style={{ minHeight: "150px", maxHeight: "250px", height: "50vh" }}
        >
          <FontAwesomeIcon
            className="pb-4 text-primary"
            size="4x"
            icon={faBasketShopping}
          />
          <div className="text-center fw-bold font-small">
            F??llen Sie Ihren Warenkorb mit den Produkten auf der linken Seite
          </div>
        </div>
      )}
    </>
  );
};
const CartFooter = ({ number, summa, onSend, addTime }) => {
  const formattedSumma = formatPrice(summa);
  const { currentUser } = useAuth();
  // const shopEnabled = useSelector(selectShopIsOpen);

  return (
    <div className="w-100 d-flex flex-nowrap">
      <PickupTimeModal onChange={addTime}>
        <div className="px-3 d-flex align-items-center">
          <FontAwesomeIcon icon={faClock} fontSize="20" />
        </div>
      </PickupTimeModal>
      {currentUser ? (
        <Button
          className="w-100 d-flex justify-content-between"
          onClick={onSend}
          style={{ borderRadius: "0 1rem 1rem 0" }}
        >
          <div className="flex-fill d-flex flex-nowrap align-items-center">
            <span
              className="me-2 fw-bolder px-2 bg-white text-primary"
              style={{ borderRadius: "35%", height: "fit-content" }}
            >
              {number}
            </span>
            <span className="header-text">Bestellen</span>
          </div>
          <div className="header-text">{formattedSumma}</div>
        </Button>
      ) : (
        <UserModal
          fullscreen={false}
          renderToggle={(props) => (
            <Button
              className="w-100 d-flex justify-content-between"
              style={{ borderRadius: "0 1rem 1rem 0" }}
              {...props}
            >
              <div className="flex-fill d-flex flex-nowrap align-items-center">
                <span
                  className="me-2 fw-bolder px-2 bg-white text-primary"
                  style={{ borderRadius: "35%", height: "fit-content" }}
                >
                  {number}
                </span>
                <span className="header-text">Bestellen</span>
              </div>
              <div className="header-text">{formattedSumma}</div>
            </Button>
          )}
        />
      )}
    </div>
  );
};

// eslint-disable-next-line react/display-name
const CartItem = memo(
  ({
    count: count = 1,
    extras,
    id,
    calculatedPrice,
    title,
    menuId,
    comment,
  }) => {
    const dispatch = useDispatch();
    const extrasText = extras.map(({ title, options }) => ({
      title,
      options: options.map((o) => o.text)?.join(", "),
    }));
    const handleIncrease = (v) =>
      dispatch(updateItemCountCart({ id, add: true }));
    const handleDecrease = (v) =>
      dispatch(updateItemCountCart({ id, add: false }));
    const handleDelete = (v) => dispatch(removeItemCart(id));
    const handleCommentChange = (comment) => {
      return dispatch(addCommentCart({ id, comment }));
    };

    return (
      <div className="cart-item">
        <div className="flex-fill m-0 d-flex align-items-end fw-bolder text-gray-900">
          {menuId + ". "}
          {title}
        </div>
        <div className="text-end d-flex justify-content-end">
          <Button
            variant="transparent"
            className="p-1 rounded-circle d-flex"
            style={{ width: "25px", height: "25px" }}
            onClick={handleDelete}
          >
            <FontAwesomeIcon className="m-auto" icon={faClose} />
          </Button>
        </div>
        <div className="w-100">
          {extrasText.length !== 0 &&
            extrasText.map((e) => (
              <div className="font-small text-gray-700" key={e.title}>
                <span style={{ whiteSpace: "nowrap" }} className="fw-bold">
                  {e.title}:
                </span>
                <div className="ms-4 text-break text-wrap">{e.options}</div>
              </div>
            ))}
        </div>
        <Comment text={comment} onChange={handleCommentChange} />
        <div className="flex-fill d-flex flex-nowrap justify-content-between">
          <Accumulator
            count={count}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
          <div className="flex-fill fw-bold text-end d-flex align-items-end justify-content-end">
            {formatPrice(calculatedPrice)}
          </div>
        </div>
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
        className="m-0 p-0 text-light-blue font-small fw-bold"
      >
        Anmerkung {!show && text ? "bearbeiten" : "hinzuf??gen"}
      </Form.Label>
      <div className={`textarea-wrapper overflow-hidden`}>
        <div className={`h-100 pt-1 ps-4 w-100`}>
          <Form.Control
            className={`border-1 font-small w-100`}
            onChange={handleDirectChange}
            as="textarea"
            rows={3}
            resize="false"
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
