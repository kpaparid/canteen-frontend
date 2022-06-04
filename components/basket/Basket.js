import { isEqual } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { Col, Nav, Tab } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import Cart, { CartModal, useCart } from "./Cart";
import Orders, { OrdersModal, useOrders } from "./Orders";
// eslint-disable-next-line react/display-name

export const useRightSideBar = () => {
  const cart = useCart();
  const orders = useOrders();
  return { cart, orders };
};

const Basket = memo((props) => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 992px)" });
  const { orders, ordersExist } = useOrders();
  const { summa, cartExists, items, sendOrder, addTime } = useCart();

  return (
    <>
      {isBigScreen ? (
        <BasketTabs
          {...{
            orders,
            ordersExist,
            summa,
            cartExists,
            items,
            sendOrder,
            addTime,
          }}
        />
      ) : (
        (cartExists || ordersExist) && (
          <div
            className={`cart-toggle ${
              cartExists && ordersExist ? "double" : ""
            }`}
          >
            <OrdersModal {...{ orders, ordersExist }} />
            {cartExists && ordersExist && <div className="divider"></div>}
            <CartModal
              {...{ summa, cartExists, items, onSend: sendOrder, addTime }}
            />
          </div>
        )
      )}
    </>
  );
}, isEqual);

const BasketTabs = ({
  orders,
  ordersExist,
  summa,
  cartExists,
  items,
  sendOrder,
  addTime,
}) => {
  const cartIsVisible = !(ordersExist && !cartExists);
  const defaultKey = !cartIsVisible ? "orders" : "cart";
  const [activeKey, setActiveKey] = useState(defaultKey);

  useEffect(() => {
    cartIsVisible ? setActiveKey("cart") : setActiveKey("orders");
  }, [items, cartIsVisible]);

  return (
    <div>
      <Tab.Container activeKey={activeKey}>
        <div className="basket basket-card d-flex flex-column">
          <div className="basket-header w-100">
            <Nav>
              {cartIsVisible && (
                <Button
                  className="basket-tab flex-fill"
                  variant={
                    activeKey === "cart" ? "primary header-text" : "white"
                  }
                  onClick={() => setActiveKey("cart")}
                >
                  Warenkorb
                </Button>
              )}
              {ordersExist && (
                <Button
                  className="basket-tab flex-fill"
                  variant={
                    activeKey === "orders" ? "primary header-text" : "white"
                  }
                  onClick={() => setActiveKey("orders")}
                >
                  Orders
                </Button>
              )}
            </Nav>
          </div>
          <Col sm={12}>
            {cartIsVisible && activeKey === "cart" && (
              <Cart
                items={items}
                summa={summa}
                onSend={sendOrder}
                addTime={addTime}
              />
            )}
            {ordersExist && activeKey === "orders" && (
              <Orders orders={orders} />
            )}
          </Col>
        </div>
      </Tab.Container>
    </div>
  );
};
export default Basket;
