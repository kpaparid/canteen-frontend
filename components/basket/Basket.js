import { isEqual } from "lodash";
import { memo, useEffect, useState } from "react";
import { Col, Nav, Tab } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useMediaQuery } from "react-responsive";
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
  const { summa, cartExists, items, sendOrder } = useCart();

  return (
    <>
      {isBigScreen ? (
        <BasketTabs
          {...{ orders, ordersExist, summa, cartExists, items, sendOrder }}
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
            <CartModal {...{ summa, cartExists, items, onSend: sendOrder }} />
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
                <Nav.Item className="flex-fill">
                  <Nav.Link
                    className="basket-tab"
                    as={Button}
                    eventKey="cart"
                    onClick={() => setActiveKey("cart")}
                  >
                    Warenkorb
                  </Nav.Link>
                </Nav.Item>
              )}
              {ordersExist && (
                <Nav.Item className="flex-fill">
                  <Nav.Link
                    className="basket-tab"
                    as={Button}
                    eventKey="orders"
                    onClick={() => setActiveKey("orders")}
                  >
                    Orders
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </div>
          <Col sm={12}>
            <Tab.Content>
              {cartIsVisible && activeKey === "cart" && (
                <Tab.Pane eventKey="cart">
                  <Cart items={items} summa={summa} onSend={sendOrder} />
                </Tab.Pane>
              )}
              {ordersExist && activeKey === "orders" && (
                <Tab.Pane eventKey="orders">
                  <Orders orders={orders} />
                </Tab.Pane>
              )}
            </Tab.Content>
          </Col>
        </div>
      </Tab.Container>
    </div>
  );
};
export default Basket;
