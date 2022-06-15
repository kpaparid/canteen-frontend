import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import { memo, useEffect, useState } from "react";
import { Col, Nav, Tab } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import styledComponents from "styled-components";
import { selectShopIsOpen } from "../../reducer/redux2";
import { UserDropdown, UserModal } from "../User";
import Cart, { CartModal, useCart } from "./Cart";
import Orders, { OrdersModal, useOrders } from "./Orders";
// eslint-disable-next-line react/display-name

export const useRightSideBar = () => {
  const cart = useCart();
  const orders = useOrders();
  const shopEnabled = useSelector(selectShopIsOpen);
  return { cart, orders, shopEnabled };
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
  const shopEnabled = useSelector(selectShopIsOpen);
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
          shopEnabled,
        }}
      ></BasketTabs>
      <div className="w-100 d-flex justify-content-center align-items-center">
        <UserDropdown />
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
      color: var(--bs-gray-800);
      font-weight: 600;
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
      font-weight: 700;

    }
    .toggle-btn{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      // align-items: space-around;
      margin: 0 1rem;
      padding: 0;
      height: 100%;
      color: var(--bs-body-color);
      box-shadow:none;
    }
}
`;

const ModalToggle = memo(({ icon, text, onClick, disabled, number = 0 }) => {
  return (
    <Button
      variant="transparent"
      disabled={disabled}
      onClick={onClick}
      className="toggle-btn"
    >
      <div className="icon-btn">
        {icon && <FontAwesomeIcon icon={icon} />}
        {number !== 0 && <div className="number">{number}</div>}
      </div>
      <div className="text">{text}</div>
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
        <RightSide />
      ) : (
        <StyledBar>
          <UserModal renderToggle={renderToggle} />
          <OrdersModal {...{ orders, ordersExist, renderToggle }} />
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
  shopEnabled,
}) => {
  const cartIsVisible = !(ordersExist && !cartExists);
  const defaultKey = !cartIsVisible ? "orders" : "cart";
  const [activeKey, setActiveKey] = useState(defaultKey);

  useEffect(() => {
    cartIsVisible || !shopEnabled
      ? setActiveKey("cart")
      : setActiveKey("orders");
  }, [items, cartIsVisible, shopEnabled]);

  return (
    <Tab.Container activeKey={activeKey}>
      <div className="basket basket-card d-flex flex-column">
        <div className="basket-header w-100">
          <Nav>
            {(cartIsVisible || !shopEnabled) && (
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
          {(cartIsVisible || !shopEnabled) && activeKey === "cart" && (
            <Cart
              items={items}
              summa={summa}
              onSend={sendOrder}
              addTime={addTime}
              shopEnabled={shopEnabled}
            />
          )}
          {ordersExist && activeKey === "orders" && <Orders orders={orders} />}
        </Col>
      </div>
    </Tab.Container>
  );
};
export default Basket;
