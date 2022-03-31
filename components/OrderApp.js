import {
  faArrowRight,
  faBars,
  faFileLines,
  faGlobe,
  faHistory,
  faLeftLong,
  faListCheck,
  faLongArrowLeft,
  faLongArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import moment from "moment";
import { memo, useCallback, useEffect, useState } from "react";
import { Button, Card, Form, Modal, Spinner, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useSocket } from "../hooks/orderHooks";
import { fetchOrders, selectAllOrdersByCategory } from "../reducer/redux2";
export const formatPrice = (price) =>
  parseFloat(price)?.toLocaleString("de-DE", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

const StyledWhiteButton = styled(Button)`
  border-radius: 0;
  font-weight: 700;
  border-color: black;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
`;

const WhiteButton = ({ className = "", children, ...rest }) => (
  <StyledWhiteButton
    className={`${className} font-small`}
    variant="white"
    {...rest}
  >
    {children}
  </StyledWhiteButton>
);

export default function Dashboard() {
  const socket = useSocket();
  const [key, setKey] = useState("newOrders");
  const orders = useSelector(selectAllOrdersByCategory);

  useEffect(() => {
    socket?.emit("join_room", "admin");
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("received_order", (data) => {
        console.log(`received order in admin ${data}`);
        setOrders((old) => [...old, ...data]);
      });
    }
  }, [socket]);

  return (
    <div className="bg-darker-nonary d-flex flex-nowrap h-100">
      <div style={{ width: "60px", zIndex: 9000 }} className="h-100">
        <SideBar></SideBar>
      </div>
      <div className="h-100 d-flex flex-nowrap flex-fill">
        <Tab.Container activeKey={key}>
          <Tab.Content className="m-auto">
            <Tab.Pane eventKey="newOrders">
              <NewOrders orders={orders} />
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <NewOrders orders={orders} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
}

const NewOrders = memo(({ orders }) => {
  return (
    <div
      className="pt-3 mx-auto flex-fill overflow-auto"
      style={{ minWidth: "200px" }}
    >
      <div className="text-white fw-bolder">New Orders</div>
      {Object.keys(orders).map(
        (status) =>
          orders?.[status].length !== 0 && (
            <div className="w-100" key={status}>
              {orders?.[status]?.map((o) => (
                <OrderModal {...o} key={o.id} />
              ))}
            </div>
          )
      )}
    </div>
  );
}, isEqual);

const PrimaryTabModal = memo(
  ({ createdAt, pickupTime, user, id, items, onConfirm, setKey }) => {
    return (
      <>
        <Modal.Header>
          <div className="d-flex justify-content-between flex-nowrap flex-fill">
            <div>
              <div className="font-large fw-bolder">{user}</div>
              <div>{id}</div>
            </div>
            <div className="d-flex flex-wrap">
              <div className="pe-3 text-end">
                <div className="fw-bold">
                  Ordered at {moment(createdAt).format("HH:mm")}
                </div>
                <div>{pickupTime} min(s)</div>
              </div>
              <WhiteButton onClick={() => setKey("2")}>
                HELP
                <FontAwesomeIcon
                  className="ps-2"
                  icon={faGlobe}
                ></FontAwesomeIcon>
              </WhiteButton>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="p-0 overflow-visible">
          {items.map((i, index) => (
            <Item {...i} index={index} key={i.itemId} length={items.length} />
          ))}
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex pb-4">
          <WhiteButton className="m-auto" onClick={onConfirm}>
            Confirm Order
          </WhiteButton>
        </Modal.Footer>
      </>
    );
  },
  isEqual
);

const ModalContent = memo((props) => {
  const [key, setKey] = useState("1");
  return (
    <Tab.Container activeKey={key}>
      <Tab.Content className="">
        <Tab.Pane eventKey="1">
          <PrimaryTabModal {...props} setKey={setKey} />
        </Tab.Pane>
        <Tab.Pane eventKey="2">
          <HelpModal {...props} setKey={setKey} />
        </Tab.Pane>
        <Tab.Pane eventKey="3">
          <DelayOrder {...props} setKey={setKey} />
        </Tab.Pane>
        <Tab.Pane eventKey="4">
          <CancelOrder {...props} setKey={setKey} />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
}, isEqual);

const DelayOrder = memo(({ orderId, setKey }) => {
  return <></>;
}, isEqual);
const CustomInput = styled.input`
  outline: none;
  border: 1px solid black;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;
  &::placeholder {
    color: black;
    opacity: 0.5;
  }
`;
const CancelOrder = memo(({ orderId, setKey }) => {
  const [reason, setReason] = useState();
  const [extra, setExtra] = useState("");
  const CustomButton = ({ children }) => (
    <WhiteButton className="m-1" onClick={() => setReason(children)}>
      {children}
    </WhiteButton>
  );

  return (
    <>
      <Modal.Header className="justify-content-start">
        <Button
          variant="white"
          className="my-1 px-3 py-1 border-black rounded-0  font-large fw-bolder"
          onClick={() => setKey("2")}
        >
          <FontAwesomeIcon icon={faLongArrowLeft}></FontAwesomeIcon>
        </Button>
        <div className="ps-2 font-large fw-bolder">Cancel Order</div>
      </Modal.Header>
      <Modal.Body>
        <div className="font-small fw-bolder">
          Select a reason for cancelling
        </div>
        <div className="d-flex flex-wrap w-100 my-2">
          <CustomButton>Out of item(s)</CustomButton>
          <CustomButton>Kitchen closed</CustomButton>
          <CustomButton>Customer called to cancel</CustomButton>
          <CustomButton>Restaurant too busy</CustomButton>
          <CustomButton>Can't complete customer note</CustomButton>
          <CustomButton>Other</CustomButton>
        </div>
        <CustomInput
          className="border-dark rounded-0 font-small fw-bolder my-2 text-dark "
          placeholder="Anything else to add?"
          onChange={(e) => setExtra(e.target.value)}
          value={extra}
        ></CustomInput>
      </Modal.Body>
      <Modal.Footer>
        <WhiteButton onClick={() => setKey("2")}>
          <span className="fw-bolder">Back</span>
        </WhiteButton>
        <WhiteButton onClick={() => setKey("1")}>
          <span className="fw-bolder text-primary text-shadow">
            Cancel order
          </span>
        </WhiteButton>
      </Modal.Footer>
    </>
  );
}, isEqual);

const HelpModal = memo(({ orderId, setKey }) => {
  const CustomButton = ({ children, ...rest }) => (
    <WhiteButton
      className="w-100 border-0 border-bottom border-light d-flex justify-content-between py-3 align-items-center"
      {...rest}
    >
      {children}
    </WhiteButton>
  );
  return (
    <>
      <Modal.Header className="justify-content-start border-light">
        <WhiteButton onClick={() => setKey("1")}>
          <FontAwesomeIcon icon={faLongArrowLeft}></FontAwesomeIcon>
        </WhiteButton>
        <div className="ps-2 font-large fw-bolder">Help with {orderId}</div>
      </Modal.Header>
      <Modal.Body className="p-0 overflow-visible fw-bolder border-0">
        {/* <CustomButton onClick={() => setKey("4")}>
          <span className="fw-bolder">Delay order</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </CustomButton> */}
        <CustomButton onClick={() => setKey("4")}>
          <span className="fw-bolder text-primary text-shadow">
            Cancel order
          </span>
          <FontAwesomeIcon icon={faArrowRight} />
        </CustomButton>
      </Modal.Body>
    </>
  );
}, isEqual);
const OrderModal = memo((props) => {
  const { user, id = "FF4FSD", createdAt, onConfirm, setKey } = props;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = useCallback(() => {
    onConfirm(id);
    handleClose();
  }, []);

  return (
    <>
      <Button
        variant="senary text-dark"
        className="rounded-0 shadow-none w-100 my-2"
        onClick={handleShow}
      >
        <div className="d-flex px-2 justify-content-between align-items-center">
          <div className="text-start">
            <div className="fw-bold">{user}</div>
            <div className="fw-normal">{id}</div>
          </div>
          <div className="fw-bold">{moment(createdAt).format("HH:mm")}</div>
        </div>
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        contentClassName="shadow-none"
        dialogClassName="order bg-darker-nonary"
        className="text-dark p-0"
        backdropClassName="opacity-0"
        fullscreen
      >
        <ModalContent {...props} onConfirm={handleConfirm} />
      </Modal>
    </>
  );
}, isEqual);

const Item = memo(
  ({
    title,
    count,
    price,
    itemId,
    calculatedPrice,
    extras,
    length,
    index,
    comment,
  }) => {
    const calculatedSinglePrice = calculatedPrice / count;
    return (
      <div className="d-flex w-100 flex-wrap py-2">
        <div className="col-12 d-flex flex-nowrap fw-bolder px-4">
          <div className="text-center" style={{ minWidth: "50px" }}>
            {count}x
          </div>
          <div className="ps-2 fw-bolder flex-fill">{title}</div>
          <div className="ps-3 text-end" style={{ minWidth: "100px" }}>
            {formatPrice(price)} €
          </div>
        </div>
        {extras?.length !== 0 && (
          <div className="col-12">
            {extras.map((e) => (
              <div className="col-12 d-flex flex-nowrap fw-bold px-4">
                <div style={{ minWidth: "50px" }}></div>
                <div className="ps-2 flex-fill">{e.text}</div>
                <div className="ps-3 text-end" style={{ minWidth: "100px" }}>
                  {formatPrice(e.price || 0)} €
                </div>
              </div>
            ))}
            <div className="col-12 d-flex flex-nowrap fw-bold px-4 text-end justify-content-end">
              <div className="ps-1 text-end border-top border-2 border-dark">
                {parseInt(count) !== 1 &&
                  `${count}x ${formatPrice(calculatedSinglePrice)} € = `}
                <span className="fw-bolder">
                  {formatPrice(calculatedPrice)} €
                </span>
              </div>
            </div>
          </div>
        )}
        {comment && (
          <div className="col-12 d-flex flex-nowrap fw-bold px-4 pt-2">
            <div style={{ minWidth: "50px" }}></div>
            <i className="ms-2 ps-1 flex-fill bg-very-light-senary">
              {comment}
            </i>
            <div className="ps-3" style={{ minWidth: "100px" }}></div>
          </div>
        )}
        <div className="w-100 border-bottom pb-2 mx-4"></div>
      </div>
    );
  },
  isEqual
);

const SideBar = memo(({ onClick }) => {
  return (
    <div className="h-100 flex-fill d-flex flex-column">
      <div className="w-100 ratio ratio-1x1">
        <Button
          variant="nonary"
          className="w-100 shadow-none rounded-0 rounded-bottom"
          style={{ padding: "18px" }}
          onClick={() => onClick("home")}
        >
          <FontAwesomeIcon icon={faBars} className="h-100 w-100" />
        </Button>
      </div>
      <div className="d-flex flex-column flex-fill py-2">
        <div className="w-100 flex-fill">
          <Button
            variant="senary"
            className="w-100 h-100 rounded-0 rounded-top shadow-none"
            style={{ padding: "18px" }}
            onClick={() => onClick("newOrders")}
          >
            <FontAwesomeIcon icon={faFileLines} className="h-100 w-100" />
          </Button>
        </div>
        <div className="w-100 flex-fill">
          <Button
            variant="nonary"
            className="w-100 h-100 rounded-0 shadow-none"
            style={{ padding: "18px" }}
            onClick={() => onClick("activeOrders")}
          >
            <FontAwesomeIcon icon={faListCheck} className="h-100 w-100" />
          </Button>
        </div>

        <div className="w-100 flex-fill">
          <Button
            variant="nonary"
            className="w-100 h-100 rounded-0 rounded-bottom shadow-none"
            style={{ padding: "18px" }}
            onClick={() => onClick("finishedOrders")}
          >
            <FontAwesomeIcon icon={faListCheck} className="h-100 w-100" />
          </Button>
        </div>
      </div>
      <div className="w-100 ratio ratio-1x1">
        <Button
          variant="nonary"
          className="w-100 shadow-none rounded-0 rounded-top"
          style={{ padding: "18px" }}
          onClick={() => onClick("history")}
        >
          <FontAwesomeIcon icon={faHistory} className="h-100 w-100" />
        </Button>
      </div>
    </div>
  );
}, isEqual);
