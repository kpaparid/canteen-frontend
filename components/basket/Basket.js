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
height: calc(100vh - 50px);
top: 40px;
justify-content: space-between;
.basket{
  max-height: calc(100% - 70px);
  max-width: 350px;
  min-width: 350px;
  overflow: hidden;
}
.basket-body{
  max-height: calc(100% - 57px);
  overflow: auto;
}
.cart{
  height: 100%;
}
.cart.empty .card-body{
  max-height: 100% !important;
}
.accordion-order-list{
  height: 100%;
  overflow: auto;
}

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
    bottom: -1px;
    padding-bottom: 3px;
    border-top: 1px solid #eaeaea;
    height: 56px;
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-around;
    z-index: 900;
    .text{
      font-size: 12px;
    }
    .icon-btn{
      width: 100%;
      color: var(--bs-gray-900);
      position: relative;
      height: 30px;
      svg{
        transform: translateX(-50%);
        height: 21px;
        position: absolute;
        bottom: 0;
      }
    }
    .number{
      transform: translate(5%, 0%);
      position: absolute;
      top: 2px;
      left: 50%;
      color: var(--bs-white);
      font-size: 12px;
      line-height: 14px;
      border-radius: 5rem;
      background-color: var(--bs-primary);
      height: 22px;
      width: 22px;
      display:flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
}
`;

const ModalToggle = memo(({ icon, text, onClick, disabled, number = 0 }) => {
  return (
    <Button
      variant="transparent"
      disabled={disabled}
      onClick={onClick}
      className="toggle-btn d-flex flex-column justify-content-around align-items-around mx-2 p-0 h-100 text-body-color shadow-none"
    >
      <div className="icon-btn">
        {icon && <FontAwesomeIcon icon={icon} />}
        {number !== 0 && (
          <div className="number font-small fw-bolder">{number}</div>
        )}
      </div>
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
        // (cartExists || ordersExist) && (
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
        // )
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
    <Tab.Container activeKey={activeKey}>
      <div className="basket basket-card d-flex flex-column">
        <div className="basket-header w-100">
          <Nav>
            {cartIsVisible && (
              <Button
                className="basket-tab flex-fill"
                variant={activeKey === "cart" ? "primary header-text" : "white"}
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
        <Col sm={12} className="basket-body">
          {cartIsVisible && activeKey === "cart" && (
            <Cart
              items={items}
              summa={summa}
              onSend={sendOrder}
              addTime={addTime}
            />
          )}
          {ordersExist && activeKey === "orders" && <Orders orders={orders} />}
        </Col>
      </div>
    </Tab.Container>
  );
};
export default Basket;
