import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { Col, Nav, Tab } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useMediaQuery } from "react-responsive";
import styledComponents from "styled-components";
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

const StyledRightSide = styledComponents.div`
display: flex;
flex-direction: column;
position: sticky;
z-index: 900;
height: 90vh;
top: 5%;
justify-content: space-between;

`;
const RightSide = memo(({ props }) => {
  const { orders, ordersExist } = useOrders();
  const { summa, cartExists, items, sendOrder, addTime } = useCart();
  return (
    <StyledRightSide>
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
      ></BasketTabs>
      <div className="w-100 d-flex justify-content-center align-items-center">
        <Button
          className="w-100 header-text"
          style={{
            boxShadow: "2px 2px 4px 3px rgb(0 0 0 / 13%)",
            borderRadius: "1rem",
          }}
        >
          {false ? (
            <div>Login</div>
          ) : (
            <div className="d-flex flex-nowrap justify-content-between px-2 align-items-center">
              <div>Kostas Paparidis</div>
              <FontAwesomeIcon className="ps-2" icon={faUser} />
            </div>
          )}
        </Button>
      </div>
    </StyledRightSide>
  );
}, isEqual);

const StyledBar = styledComponents.div`
    box-shadow: 0 0px 4px 3px rgb(0 0 0 / 13%);
    background-color: white;
    flex-direction: row;
    width: 100%;
    padding-bottom: 5px;
    padding-top: 6px;
    bottom: -1px;
    border-top: 1px solid #eaeaea;
    justify-content: space-around;
    height: 56px;
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-around;
    z-index: 900;
    .text{
      font-size: 12px;
    }
}
`;

const ModalToggle = memo(({ icon, text, onClick, disabled }) => {
  return (
    <Button
      variant="white"
      disabled={disabled}
      onClick={onClick}
      className="d-flex flex-column justify-content-around align-items-center mx-2 p-0 h-100 text-body-color"
    >
      {icon && <FontAwesomeIcon className="icon" icon={icon} />}
      <div className="text font-small text-gray-800 fw-bold">{text}</div>
    </Button>
  );
}, isEqual);

const Basket = memo(() => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 992px)" });
  const { orders, ordersExist } = useOrders();
  const { summa, cartExists, items, sendOrder, addTime } = useCart();
  const renderToggle = (props) => <ModalToggle {...props} />;
  return (
    <>
      {isBigScreen ? (
        // <BasketTabs
        //   {...{
        //     orders,
        //     ordersExist,
        //     summa,
        //     cartExists,
        //     items,
        //     sendOrder,
        //     addTime,
        //   }}
        // />
        <RightSide />
      ) : (
        (cartExists || ordersExist) && (
          <StyledBar
          // className={`cart-toggle ${
          //   cartExists && ordersExist ? "double" : ""
          // }`}
          >
            {renderToggle({ text: "User", icon: faUser })}
            <OrdersModal {...{ orders, ordersExist, renderToggle }} />
            {/* {cartExists && ordersExist && <div className="divider"></div>} */}
            <CartModal
              {...{
                summa,
                cartExists,
                items,
                onSend: sendOrder,
                addTime,
                renderToggle,
              }}
            />
          </StyledBar>
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
