import {
  faAngleDown,
  faArrowDown,
  faArrowRight,
  faBell,
  faClose,
  faEllipsisVertical,
  faGlobe,
  faLongArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import moment from "moment";
import { memo, useCallback, useEffect, useState } from "react";
import { Button, Modal, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useSocket } from "../hooks/orderHooks";
import {
  changeOrderStatus,
  fetchOrders,
  selectAllOrdersByCategory,
} from "../reducer/redux2";
import { formatPrice } from "../utilities/utils";
import SideBar from "./Sidebar";

const StyledWhiteButton = styled(Button)`
  border-radius: 0;
  font-weight: 700;
  border-color: black;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 700;
`;

const WhiteButton = ({ className = "", children, ...rest }) => (
  <StyledWhiteButton
    id="dashboard-btn"
    className={className}
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
      <div className="dashboard">
        <SideBar
          setActiveKey={setActiveKey}
          activeKey={activeKey}
          pendingCount={orders.pending.length}
        />
        <div className="dashboard-content">
          <Tab.Container activeKey={activeKey} className="w-100">
            <Tab.Content className="px-5 m-auto w-100">
              {activeKey === "pending" && (
                <Tab.Pane eventKey="pending">
                  <OrdersComponent
                    orders={orders?.pending}
                    title="New"
                    onNext={handleNext}
                    cancel={true}
                  />
                </Tab.Pane>
              )}
              {activeKey === "confirmed" && (
                <Tab.Pane eventKey="confirmed">
                  <OrdersComponent
                    orders={orders?.confirmed}
                    title="In Progress"
                    onNext={handleReady}
                    acceptText="Ready"
                  />
                </Tab.Pane>
              )}
              {activeKey === "ready" && (
                <Tab.Pane eventKey="ready">
                  <OrdersComponent
                    orders={orders?.ready}
                    title="Ready"
                    onNext={handleFinish}
                    acceptText="Finish"
                  />
                </Tab.Pane>
              )}
              {activeKey === "archived" && (
                <Tab.Pane eventKey="archived">
                  <OrdersComponent
                    orders={orders?.archived}
                    title="Archived"
                    onNext={handleNew}
                    acceptText="PLACEHOLDER"
                  />
                </Tab.Pane>
              )}
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
  const { user, id, number, createdAt, onNext, price, items } = rest;
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
        <div className="d-flex py-2 px-4 justify-content-between align-items-center">
          <div className="text-start">
            <div className="fw-bolder">{user}</div>
            <div className="text-truncate">{number}</div>
          </div>
          <div>
            <div className="fw-bold">{moment(createdAt).format("HH:mm")}</div>
            <div className="fw-bolder border border-dark">{items.length}</div>
          </div>
        </div>
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        contentClassName="shadow-none"
        dialogClassName="order bg-darker-nonary w-100 modal-dashboard"
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
  const [oldKey, setOldKey] = useState(key);
  const handleChangeKey = useCallback(
    (key) =>
      setKey((old) => {
        setOldKey(old);
        return key;
      }),
    []
  );
  return (
    <Tab.Container activeKey={key}>
      <Tab.Content className="">
        <Tab.Pane eventKey="1">
          <OrderOverview
            {...props}
            setKey={handleChangeKey}
            onCancel={() => setKey("4")}
          />
        </Tab.Pane>
        <Tab.Pane eventKey="2">
          <HelpModal {...props} setKey={handleChangeKey} />
        </Tab.Pane>
        <Tab.Pane eventKey="3">
          <DelayOrder {...props} setKey={handleChangeKey} />
        </Tab.Pane>
        <Tab.Pane eventKey="4">
          <CancelOrder {...props} setKey={handleChangeKey} oldKey={oldKey} />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
}, isEqual);
const OrderOverview = memo(
  ({
    createdAt,
    pickupTime,
    user,
    price,
    id,
    number,
    items,
    onNext,
    setKey,
    onCancel,
    cancel,
    acceptText = "Accept Order",
    cancelText = "Cancel Order",
  }) => {
    return (
      <>
        <Modal.Header className="border-dark">
          <div className="d-flex justify-content-between flex-nowrap flex-fill">
            <div>
              <div className="font-large fw-bolder">{user}</div>
              <div className="fw-bold">{number}</div>
            </div>
            <div className="d-flex flex-wrap justify-content-end align-items-center">
              <div className="pe-2">
                <div className="fw-bold">
                  {moment(createdAt).format("HH:mm")}
                </div>
              </div>
              <Button
                variant="transparent"
                onClick={() => setKey("2")}
                className="dashboard-btn-settings"
              >
                <FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon>
              </Button>
              <Button
                variant="transparent"
                onClick={() => setKey("2")}
                className="dashboard-btn-close"
              >
                <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
              </Button>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="p-0 overflow-visible">
          <div className="items-list">
            {items.map((i, index) => (
              <Item {...i} index={index} key={i.itemId} length={items.length} />
            ))}
          </div>
          <div className="d-flex justify-content-end mx-4 border-top border-dark py-3">
            <WhiteButton variant="dark">{formatPrice(price)}</WhiteButton>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex px-0 pb-4 justify-content-center align-items-center border-dark flex-wrap">
          {cancel && (
            <WhiteButton variant="white" onClick={onCancel}>
              {cancelText}
            </WhiteButton>
          )}
          <WhiteButton variant="dark fw-bold" onClick={onNext}>
            {acceptText}
          </WhiteButton>
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
const CancelOrder = memo(({ id, setKey, oldKey }) => {
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
    setKey(oldKey);
    clear();
  }, []);
  const handleClose = useCallback(() => {
    setKey(oldKey);
    clear();
  }, []);

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
    calculatedPrice,
    extras,
    comment,
    length,
    menuId,
  }) => {
    const calculatedSinglePrice = calculatedPrice / count;
    const [showPrice, setShowPrice] = useState(false);
    return (
      <>
        <div className="item-row">
          <div className="d-flex justify-content-center align-items-center">
            <WhiteButton>
              <div style={{ minWidth: "25px" }}>{count}x</div>
            </WhiteButton>
          </div>
          <div className="px-4 flex-fill d-flex flex-column justify-content-center">
            <TitleRow menuId={menuId} title={title} />
            {extras?.length !== 0 && (
              <>
                <Extras
                  extras={extras}
                  showPrice={showPrice}
                  count={count}
                  calculatedPrice={calculatedPrice}
                  calculatedSinglePrice={calculatedSinglePrice}
                />
              </>
            )}
            {comment && <Comment comment={comment} />}
          </div>
          {length > 1 && (
            <div className="item-price">
              <WhiteButton variant="white">
                {formatPrice(calculatedPrice)}
              </WhiteButton>
            </div>
          )}
        </div>
      </>
    );
  },
  isEqual
);

const TitleRow = memo(
  ({ title, menuId }) => (
    <>
      <div className="flex-fill d-flex flex-nowrap px-1">
        <div className="flex-fill d-flex align-items-center">
          <span className="fw-bolder">{title}</span>
          <span className="bg-dark fw-bold ms-2 px-2 text-white">{menuId}</span>
        </div>
      </div>
    </>
  ),
  isEqual
);

const Extras = memo(
  ({ extras, showPrice, count, calculatedPrice, calculatedSinglePrice }) => {
    return (
      <>
        <div className="flex-fill">
          {extras?.map((e) => (
            <div className="col-12 d-flex flex-nowrap px-1">
              <div className="flex-fill">{e.text}</div>
            </div>
          ))}
        </div>
      </>
    );
  },
  isEqual
);
const Comment = memo(({ comment }) => {
  return (
    <div className="w-100 d-flex flex-nowrap fw-bold px-1 pt-2">
      <span className="px-3 bg-very-light-senary">{comment}</span>
    </div>
  );
}, isEqual);
