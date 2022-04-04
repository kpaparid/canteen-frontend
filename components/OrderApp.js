import {
  faArrowRight,
  faBars,
  faBell,
  faFileLines,
  faGlobe,
  faHistory,
  faLeftLong,
  faListCheck,
  faLongArrowLeft,
  faLongArrowRight,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import moment from "moment";
import { memo, useCallback, useEffect, useState } from "react";
import { Button, Card, Form, Modal, Spinner, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useSocket } from "../hooks/orderHooks";
import {
  changeOrderStatus,
  fetchOrders,
  selectAllOrdersByCategory,
} from "../reducer/redux2";
import SideBar from "./Sidebar";
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
  const [activeKey, setActiveKey] = useState("pending");
  const orders = useSelector(selectAllOrdersByCategory);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();
  const handleStatusChange = useCallback((id, body) => {
    dispatch(changeOrderStatus({ id, body }));
  }, []);
  const handleNext = useCallback((id) => {
    handleStatusChange(id, { status: "confirmed" });
  }, []);
  const handleNew = useCallback((id) => {
    handleStatusChange(id, { status: "pending" });
  }, []);
  const handleReady = useCallback((id) => {
    handleStatusChange(id, { status: "ready" });
  }, []);
  const handleFinish = useCallback((id) => {
    handleStatusChange(id, { status: "finished" });
  }, []);

  useEffect(() => {
    socket?.emit("join_room", "admin");
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("received_order", (data) => {
        console.log(`received order in admin ${data}`);
        dispatch(fetchOrders()).then(() => setShow(true));
      });
    }
  }, [socket]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        fullscreen
        contentClassName="d-flex justify-content-center align-items-center bg-pulse-nonary-pending"
      >
        <div className="h-100 w-100 d-flex" onClick={handleClose}>
          <FontAwesomeIcon
            className="swing m-auto"
            icon={faBell}
            size="9x"
          ></FontAwesomeIcon>
        </div>
      </Modal>
      <div className="bg-darker-nonary d-flex flex-nowrap h-100">
        <div
          style={{ minWidth: "60px", maxWidth: "60px", zIndex: 9000 }}
          className="h-100"
        >
          <SideBar
            setActiveKey={setActiveKey}
            activeKey={activeKey}
            pendingCount={orders.pending.length}
          ></SideBar>
        </div>
        <div
          className="h-100 d-flex flex-nowrap overflow-auto"
          style={{ width: "calc(100% - 60px)" }}
        >
          <Tab.Container activeKey={activeKey} classNamew="w-100">
            <Tab.Content className="px-5 m-auto w-100">
              <Tab.Pane eventKey="pending">
                <OrdersComponent
                  orders={orders?.pending}
                  title="New"
                  onNext={handleNext}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="confirmed">
                <OrdersComponent
                  orders={orders?.confirmed}
                  title="In Progress"
                  onNext={handleReady}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="ready">
                <OrdersComponent
                  orders={orders?.ready}
                  title="Ready"
                  onNext={handleFinish}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="archived">
                <OrdersComponent
                  orders={orders?.archived}
                  title="Archived"
                  onNext={handleNew}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </>
  );
}

const OrdersComponent = memo(({ orders, title, ...rest }) => {
  return (
    <div className="pt-3 mx-auto flex-fill overflow-auto">
      <div className="text-white fw-bolder">{title}</div>
      <div className="w-100">
        {orders?.map((o) => (
          <OrderModal {...o} key={o.id} {...rest} />
        ))}
      </div>
    </div>
  );
}, isEqual);

const OrderModal = memo(({ status, ...rest }) => {
  const variant = status === "finished" ? "ready" : status;
  const { user, id = "FF4FSD", createdAt, onNext } = rest;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleNext = useCallback(() => {
    onNext(id);
    handleClose();
  }, []);

  return (
    <>
      <Button
        variant={variant}
        className="rounded-0 w-100 my-2 text-dark p-0"
        onClick={handleShow}
      >
        <div className="d-flex px-2 justify-content-between align-items-center">
          <div className="text-start">
            <div className="fw-bold">{user}</div>
            <div className="fw-normal text-truncate">{id}</div>
          </div>
          <div className="fw-bold">{moment(createdAt).format("HH:mm")}</div>
        </div>
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        contentClassName="shadow-none"
        dialogClassName="order bg-darker-nonary w-100"
        className="text-dark p-0"
        backdropClassName="opacity-0"
        fullscreen
      >
        <OrderContent {...rest} onNext={handleNext} />
      </Modal>
    </>
  );
}, isEqual);

const OrderContent = memo((props) => {
  const [key, setKey] = useState("1");
  return (
    <Tab.Container activeKey={key}>
      <Tab.Content className="">
        <Tab.Pane eventKey="1">
          <OrderOverview {...props} setKey={setKey} />
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
const OrderOverview = memo(
  ({ createdAt, pickupTime, user, id, items, onNext, setKey }) => {
    return (
      <>
        <Modal.Header>
          <div className="d-flex justify-content-between flex-nowrap flex-fill">
            <div>
              <div className="font-large fw-bolder">{user}</div>
              <div>{id}</div>
            </div>
            <div className="d-flex flex-wrap justify-content-end">
              <div className="text-end">
                <div className="fw-bold">
                  Ordered at {moment(createdAt).format("HH:mm")}
                </div>
                <div>{pickupTime} min(s)</div>
              </div>
              <WhiteButton onClick={() => setKey("2")} className="ms-3">
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
        <Modal.Footer className="border-0 d-flex pb-4 justify-content-center align-items-center">
          <WhiteButton onClick={onNext}>Confirm Order</WhiteButton>
        </Modal.Footer>
      </>
    );
  },
  isEqual
);
const DelayOrder = memo(({ id, setKey }) => {
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
const CancelOrder = memo(({ id, setKey }) => {
  const dispatch = useDispatch();
  const [reason, setReason] = useState();
  const [extra, setExtra] = useState("");
  const CustomButton = ({ children }) => (
    <WhiteButton
      className="m-1"
      variant={children === reason ? "senary text-dark" : "white"}
      onClick={() => setReason(children)}
    >
      {children}
    </WhiteButton>
  );
  const clear = useCallback(() => {
    setReason();
    setExtra("");
  });
  const handleTextChange = useCallback((e) => {
    setExtra(e.target.value);
  }, []);
  const handleCancel = useCallback(() => {
    console.log("post cancel");
    dispatch(
      changeOrderStatus({ id, body: { status: "canceled", reason, extra } })
    );
    handleClose();
  }, []);
  const handleBack = useCallback(() => {
    setKey("2");
    clear();
  }, []);
  const handleClose = useCallback(() => {
    setKey("1");
    clear();
  }, []);
  console.log({ extra });
  console.log({ reason });

  return (
    <>
      <Modal.Header className="justify-content-start">
        <Button
          variant="white"
          className="my-1 px-3 py-1 border-black rounded-0  font-large fw-bolder"
          onClick={handleBack}
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
          className="border-dark rounded-0 font-small fw-bold my-2 text-dark "
          placeholder="Anything else to add?"
          onChange={handleTextChange}
          value={extra}
        ></CustomInput>
      </Modal.Body>
      <Modal.Footer className="justify-content-around">
        <WhiteButton onClick={handleBack}>
          <span className="fw-bolder">Back</span>
        </WhiteButton>
        <WhiteButton onClick={handleCancel} disabled={!reason} variant="senary">
          <span className="fw-bolder">Cancel order</span>
        </WhiteButton>
      </Modal.Footer>
    </>
  );
}, isEqual);

const HelpModal = memo(({ orderId, setKey }) => {
  const CustomButton = ({ children, ...rest }) => (
    <WhiteButton
      className="w-100 border-0 border-bottom border-light d-flex justify-content-between py-3 align-items-center px-5"
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
          <span className="fw-bolder text-primary">Cancel order</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </CustomButton>
      </Modal.Body>
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
