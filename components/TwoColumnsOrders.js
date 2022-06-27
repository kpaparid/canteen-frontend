import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faBars, faPhone, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "@reduxjs/toolkit";
import {
  addMinutes,
  format,
  intervalToDuration,
  isAfter,
  parse,
} from "date-fns";
import { isEqual } from "lodash";
import Image from "next/image";
import RegisterUser from "./Register";
import {
  memo,
  useCallback,
  useEffect,
  useState,
  useRef,
  forwardRef,
} from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import styledComponents from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchSettings,
  openCloseShop,
  selectShopIsOpen,
} from "../reducer/redux2";
import {
  formatPrice,
  useDurationHook,
  validateEmail,
} from "../utilities/utils.mjs";
const CustomInput = styledComponents.input`
  outline: none;
  border: 0;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 0.5rem;
  width: 100%;
  background: var(--bs-gray-500);
    box-shadow: 0px 0px 5px 1px var(--bs-senary);
  &::placeholder {
    color: black;
    opacity: 0.5;
  }
`;
const StyledItem = styledComponents.div`
  &:hover{
    .title { 
      // color: var(--bs-senary);
    }
    background-color: var(--bs-gray-500);
    cursor: pointer;
  }`;
const StyledOrderList = styledComponents.div`
height: ${(props) =>
  props.footer ? "calc(100% - 100px);" : "calc(100% - 50px);"}
background-color: var(--bs-gray-white);
border-radius: 0.25rem;
overflow: auto;
.right-item{
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
}


`;
const StyledTitle = styledComponents.div`
    height: 50px;
    color: var(--bs-gray-white);
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: capitalize;
    font-weight: 600;
    .title{
        color: var(--bs-gray-white);
    }
    .count{
        padding-left: 0.45rem;
        color: white;
    }

`;

const StyledNavBar = styledComponents.div`
padding: 0 1rem;
.finished-btn{
  display: none;
}
 @media (max-width: 768px) {
  .finished-btn{
    display: block;
    padding: 0.5rem;
    width: fit-content;
    button{
      padding: 0 0.5rem;
      border-radius: 0.25rem;
    }
  }
   border: 0;
   position: fixed;
   top: 0;
   left: 0;
 }
display: flex;
flex-wrap: nowrap;
justify-content: space-between;
align-items: center;
width: 100%;
height: 50px;
border-bottom: 2px solid var(--bs-gray-900);
color: var(--bs-gray-white);
font-weight: 600;
.ball{
  height: 13px;
  width: 13px;
}
.shop-status{
  width: 70px;
  cursor: pointer;
  &:hover{
    color: white;
  }
}
`;
const StyledSidebar = styledComponents.div`
height: 100%;
.settings{
  padding: 0.5rem;
  height: 100%;
  width: 70px;
  display: flex;
  align-items: center;
  button{
    display: flex;
    svg{
      margin: auto;
    }
    width: fit-content;
    padding: 0;
    width: 25px;
    color: var(--bs-gray-white);
  }
}
          // className="h-100 w-100 text-gray-white shadow-none"
          // style={{ padding: "0.85rem 0", width: "70px" }}
`;
const StyledFinishedItems = styledComponents.div`
width: 100%;
height: 50px;
padding-top: 10px;
padding-left: 0.5rem;
button{
  width: 100%;
  height: 100%;
  padding:0;
  border-radius: 0.25rem 0.25rem 0 0rem;
}
span{
  font-weight: 700;
  color: nonary;
}
`;
const StyledLeftItem = styledComponents.div`
      color: var(--body-color);
      margin: 0.5rem;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: column;
      border-radius: 0.5rem;
      background-color: white;
      padding: 1.5rem; 
      .info-wrapper{
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: start;
      }
      .price{
        font-weight: 700;
        margin-top: 1rem;
        font-size: 1.4rem;
      }
      .items{
        margin-top: 1.5rem;
        border-top: 1px solid var(--bs-gray-500);
      }
      .timer{
        display: flex;
        justify-content: center;
        height: fit-content;
      }
      .circle-time{
        // padding: 0 1.5rem;

        border: 0.4rem solid var(--bs-senary);
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        aspect-ratio: 1;
        minWidth: 64px;
        height: 90px;
      }
      .round-timer{
        font-weight: 700;
        background-color: var(--bs-nonary);
        color: white;
        padding: 0.5rem;
        border-radius: 0.3rem;
      }
      .duration{
        font-weight: 700;
        height: fit-content;
        line-height: 15px;
        font-size: 18px;
      }
      .time{
        font-size: 1rem;
        color: var(--bs-gray-800);
        font-weight: 600;
        line-height: 15px;
      }
      .minutes{
        padding-left: 0.15rem;
      }
      .infos{
        display: flex;
        flex-direction: column;
        align-items: start;
        flex: 1 0;
      }
      .info{
        flex: 1 auto;
        max-width: 100%;
      }
      .order-id{
        font-weight: 700;
        border-radius: 0.25rem;
        background-color: var(--bs-gray-500);
        padding: 0.25rem 0.5rem;
      }
`;
const StyledFinishedModalBody = styledComponents(Modal.Body)`
      padding: 1.5rem;
      background-color: var(--bs-nonary);
      .left-item{
        background-color: transparent;
        padding: 0 0.75rem;
        margin: 0;
      }
`;
const ColumnsWrapper = styledComponents.div`
height: calc(100% - 50px);
width: 100%;
display: flex;
justify-content: space-around;
flex-wrap: nowrap;
margin: auto;
.footer{
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  margin-top: 1rem;
}
.orders-list-wrapper{
  height: 100%;
  display: flex;
  flex-direction: column;
    width: 40%;
    flex: 1;
    &:first-child{
      margin-right: 0.25rem;
    }
    &:nth-child(2){
      margin-left: 0.25rem;
    }
    &:last-child{
        flex: unset;
        width: 20%;
        .orders-list{
            background-color: transparent;
        }
    }
}
  @media (max-width: 768px) {
    .left-item{
      padding: 0.45rem !important;
    }
    padding-top: 55px;
    height: 100% !important;
    flex-wrap: wrap;
    .info-wrapper{
      flex-wrap: wrap !important;
    }
    .footer{
      flex-direction: column;
      button{
        margin: 0 !important;
        &:first-child{
          margin-bottom: 0.5rem !important;
        }
      }
    }
    .left-item:first-child{
      margin-top: 0.25rem;
    }
    .orders-title{
      background-color: var(--bs-light-nonary);
      border-radius: 0.5rem 0.5rem 0 0;
      height: 35px;
    }
    .orders-list{
      background-color: var(--bs-light-nonary);
      height: calc(100% - 35px);
    }
    .orders-list-wrapper{
      &:first-child, &:nth-child(2){
        height: calc(100% - 110px);
        max-width: 49%;
        min-width: 49%;
        margin: 0;
      }        
      &:last-child{
        // position: relative;
        width: 100%;
        height: 110px;
        .orders-list{
          // position: absolute;
          // top:0;
          // left: 30px;
          width: 100%;
          align-items: center;
          height: 100% !important;
          display: flex;
          flex-wrap: nowrap;
          // background-color: var(--bs-nonary);
        }
        .title, .count{
          // transform: rotate(-90deg);
        }
        .orders-title{
          display: none;
          // background-color: var(--bs-nonary);
          // position: absolute;
          // bottom: 0;
          // left: 0;
          // height: 32px;
          // width: 100px;
          // transform: rotate(-90deg) translate(39px, -32px);
        }
      }
    .finished-btn{
      display: none;
    }
  }
  .right-item{
    width: fit-content;
    margin: auto;
    padding: 0 0.5rem 0 0;
  }
    .timer{
      flex: 1 0;
      margin-top: 0.25rem;
    }
  }
`;
const FinishItem = memo(
  ({ active, onPending, onConfirmed, onReady, onClose, ...rest }) => {
    const renderFooter = useCallback(() => {
      return active ? (
        <div className="d-flex flex-wrap w-100 justify-content-around">
          <Button
            variant="pending"
            className="mt-2"
            onClick={() => {
              onPending(rest.user.userId, rest.id, {
                status: "pending",
                time: null,
              });
              onClose();
            }}
          >
            pending
          </Button>
          <Button
            variant="confirmed"
            className="mt-2"
            onClick={() => {
              onConfirmed(rest.user.userId, rest.id);
              onClose();
            }}
          >
            confirmed
          </Button>
          <Button
            variant="ready"
            className="mt-2"
            onClick={() => {
              onReady(rest.user.userId, rest.id);
              onClose();
            }}
          >
            ready
          </Button>
        </div>
      ) : (
        <></>
      );
    }, [
      active,
      onClose,
      onPending,
      onConfirmed,
      onReady,
      rest.user.userId,
      rest.id,
    ]);
    return (
      <LeftItem
        itemDisabled
        {...rest}
        key={rest.id}
        renderFooter={renderFooter}
      />
    );
  },
  isEqual
);

const FinishedListModal = memo(({ orders = [], ...rest }) => {
  const [show, setShow] = useState();
  const onClose = useCallback(() => {
    setShow(false);
    setActive();
  }, []);
  const onShow = useCallback(() => setShow(true), []);
  const [active, setActive] = useState();
  return (
    <>
      <StyledFinishedItems className="finished-btn">
        <Button variant="gray-white" onClick={onShow}>
          <span className="fw-600">Finished</span>
          <span className="fw-600 ps-2">{orders?.length}</span>
        </Button>
      </StyledFinishedItems>
      <Modal
        show={show && orders.length !== 0}
        onHide={onClose}
        centered
        className="p-0"
        contentClassName="w-100"
      >
        <StyledFinishedModalBody>
          {orders.map((o) => (
            <Button
              onClick={() => setActive(o.id)}
              key={o.id}
              variant="gray-500"
              className="w-100 my-2"
            >
              <FinishItem
                {...rest}
                {...o}
                active={o.id === active}
                onClose={onClose}
              />
            </Button>
          ))}
        </StyledFinishedModalBody>
      </Modal>
    </>
  );
}, isEqual);
const TwoColumnsOrders = memo(
  ({ orders, loading, onChangeOrderStatus, onChangeShopStatus }) => {
    // const dispatch = useDispatch();
    const pendingColumn = orders?.pending;
    const confirmedColumn = orders?.confirmed;
    const readyColumn = orders?.ready;
    const archivedColumn = orders?.archived;
    const [showLoading, setShowLoading] = useState();

    useEffect(() => {
      if (loading) {
        const timer = setTimeout(() => setShowLoading(true), 1 * 1000);
        return () => {
          clearTimeout(timer);
        };
      } else {
        setShowLoading(false);
      }
    }, [loading]);
    const handleAccept = useCallback(
      (userId, orderId, body) => {
        onChangeOrderStatus(userId, orderId, { status: "confirmed", ...body });
      },
      [onChangeOrderStatus]
    );
    const handleTimeAndAccept = useCallback(
      (userId, orderId, minutes) => {
        const time = format(addMinutes(new Date(), minutes), "HH:mm");
        onChangeOrderStatus(userId, orderId, { status: "confirmed", time });
      },
      [onChangeOrderStatus]
    );
    const handleNew = useCallback(
      (userId, orderId, body) => {
        onChangeOrderStatus(userId, orderId, { status: "pending", ...body });
      },
      [onChangeOrderStatus]
    );
    const handleReady = useCallback(
      (userId, orderId, body) => {
        onChangeOrderStatus(userId, orderId, { status: "ready", ...body });
      },
      [onChangeOrderStatus]
    );
    const handleFinish = useCallback(
      (userId, orderId, body) => {
        onChangeOrderStatus(userId, orderId, { status: "finished", ...body });
      },
      [onChangeOrderStatus]
    );
    const handleDeclined = useCallback(
      (userId, orderId) => {
        onChangeOrderStatus(userId, orderId, { status: "declined", ...body });
      },
      [onChangeOrderStatus]
    );

    return (
      <div className="bg-darker-nonary h-100 w-100 d-flex flex-column">
        <Modal
          show={showLoading}
          onHide={() => setLoading(false)}
          centered
          contentClassName="bg-transparent d-flex justify-content-center align-items-center border-0 shadow-none"
        >
          <Modal.Body className="bg-transparent p-0">
            <Spinner animation="border" variant="darker-nonary" />
          </Modal.Body>
        </Modal>
        <TopBar
          archivedColumn={archivedColumn}
          onChangeShopStatus={onChangeShopStatus}
          onReady={handleReady}
          onConfirmed={handleAccept}
          onPending={handleNew}
        />
        <ColumnsWrapper className="px-2">
          <OrdersList
            orders={pendingColumn}
            title="pending"
            renderItem={(props) => (
              <LeftItem
                interval
                key={props.id}
                {...props}
                renderFooter={(footerProps) => (
                  <div className="footer">
                    {props?.time ? (
                      <Button
                        variant="senary"
                        className="flex-fill me-2"
                        onClick={() => handleAccept(props.user.uid, props.id)}
                      >
                        Accept
                      </Button>
                    ) : (
                      <AcceptModal
                        {...footerProps}
                        onClick={(minutes) =>
                          handleTimeAndAccept(props.user.uid, props.id, minutes)
                        }
                      />
                    )}
                    <RejectModal
                      {...footerProps}
                      onClick={() => handleAccept(props.user.uid, props.id)}
                    />
                  </div>
                )}
              />
            )}
          />
          <OrdersList
            orders={confirmedColumn}
            title="confirmed"
            renderItem={(props) => (
              <LeftItem
                interval
                key={props.id}
                {...props}
                renderFooter={() => (
                  <div className="d-flex flex-nowrap w-100 mt-3">
                    <Button
                      variant="ready"
                      className="text-white flex-fill me-2"
                      onClick={() => handleReady(props.user.uid, props.id)}
                    >
                      Mark as Ready
                    </Button>
                  </div>
                )}
              />
            )}
          />
          <OrdersList
            orders={readyColumn}
            col={2}
            title="ready"
            footer={
              <FinishedListModal
                orders={archivedColumn}
                onReady={handleReady}
                onConfirmed={handleAccept}
                onPending={handleNew}
              />
            }
            renderItem={(props) => (
              <ReadyItem
                key={props.id}
                {...props}
                renderFooter={(footerProps) => (
                  <div className="d-flex flex-nowrap w-100 mt-3">
                    <Button
                      variant="ready"
                      className="text-white flex-fill me-2"
                      onClick={() => {
                        footerProps?.onClick();
                        handleFinish(props.user.uid, props.id);
                      }}
                    >
                      Mark as Finished
                    </Button>
                  </div>
                )}
              ></ReadyItem>
            )}
          />
        </ColumnsWrapper>
      </div>
    );
  },
  isEqual
);
const TopBar = memo(
  ({
    onChangeShopStatus,
    handleReady,
    handleAccept,
    handleNew,
    archivedColumn,
  }) => {
    const shopEnabled = useSelector(selectShopIsOpen);
    const handleClick = useCallback(
      () => onChangeShopStatus(!shopEnabled),
      [onChangeShopStatus, shopEnabled]
    );
    return (
      <StyledNavBar>
        <Sidebar />
        <FinishedListModal
          orders={archivedColumn}
          onReady={handleReady}
          onConfirmed={handleAccept}
          onPending={handleNew}
        />
        <div
          className="shop-status d-flex flex-nowrap align-items-center p-1"
          onClick={handleClick}
        >
          <div>{shopEnabled ? "Open" : "Closed"}</div>
          <div
            className={`ball ms-2 rounded-circle ${
              shopEnabled ? "bg-ready" : "bg-primary"
            }`}
          />
        </div>
      </StyledNavBar>
    );
  },
  isEqual
);
const OrdersList = memo(({ orders, title, renderItem, footer }) => {
  return (
    <div className={`orders-list-wrapper`}>
      <StyledTitle className="orders-title">
        <span className="title">{title}</span>
        <span className="count">{orders?.length}</span>
      </StyledTitle>
      <StyledOrderList className="orders-list" footer={footer}>
        {orders?.map((o) => renderItem(o))}
      </StyledOrderList>
      {footer}
    </div>
  );
}, isEqual);

const Sidebar = memo(() => {
  const [show, setShow] = useState();
  const handleShow = useCallback(() => setShow(true), []);
  const handleClose = useCallback(() => setShow(false), []);
  return (
    <StyledSidebar>
      <div className="settings">
        <Button variant="transparent" onClick={handleShow}>
          <FontAwesomeIcon className="h-100" icon={faBars} />
        </Button>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="p-0"
        dialogClassName="side-bar-dialog"
        contentClassName="w-100 h-100"
      >
        <Modal.Body className="bg-gray-white p-3">
          <RegisterUser />
          {/* <div>hi</div> */}
        </Modal.Body>
      </Modal>
    </StyledSidebar>
  );
}, isEqual);

const ReadyItem = memo((props) => {
  const {
    number,
    time: pickupTime,
    user: { email, displayName },
  } = props;
  const start = new Date();
  const end = parse(pickupTime, "HH:mm", new Date());
  const duration = intervalToDuration({
    start,
    end,
  }).minutes;
  const time =
    duration === 0 || isAfter(start, end) ? "now" : duration + " min";
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="right-item">
      <FinishModal show={show} onClose={handleClose} {...props} />
      <Button
        variant="light-nonary"
        className="w-100 d-flex flex-column rounded text-white justify-content-center align-items-center p-2"
        onClick={handleShow}
      >
        <div className="d-flex flex-wrap justify-content-center w-100">
          <div
            className="rounded rounded-3 mt-2 bg-gray-500 text-nonary fw-bolder px-2 py-1 h-auto mx-2"
            style={{ height: "fit-content" }}
          >
            {number}
          </div>
          <div
            className="rounded bg-very-light-nonary mt-2 px-2 py-1 text-center mx-2"
            style={{ height: "fit-content" }}
          >
            {time}
          </div>
        </div>
        <div className="text-truncate text-break w-100 text-center my-2">
          {displayName || email}
        </div>
      </Button>
    </div>
  );
}, isEqual);
const TimeComponent = memo(({ time }) => {
  const duration = useDurationHook(time);
  return (
    <div className="circle-time">
      <div className="d-flex">
        <div className="duration">
          {duration === 0 ? (
            <span>now</span>
          ) : (
            <>
              <span>{duration}</span>
              <span className="minutes">min</span>
            </>
          )}
        </div>
      </div>
      <span className="time">{time}</span>
    </div>
  );
}, isEqual);
const LeftItem = memo(
  ({
    number,
    time: pickupTime,
    user: { email, displayName, phoneNumber = "+15751275315" },
    createdAt,
    items,
    price,
    renderFooter = () => <></>,
    interval,
    itemDisabled,
  }) => {
    return (
      <StyledLeftItem className="left-item">
        <div className="info-wrapper">
          <div className="info">
            <div
              className="order-id"
              style={{ height: "fit-content", width: "fit-content" }}
            >
              {number}
            </div>
            <div className="name fw-bolder text-truncate mt-2">
              {displayName || email}
            </div>
            {phoneNumber && (
              <div className="phone font-small text-truncate fw-bold text-gray-800">
                <FontAwesomeIcon icon={faPhone} className="pe-2" />
                {phoneNumber}
              </div>
            )}
            <div className="created-time font-small fw-bold text-gray-800">
              <FontAwesomeIcon icon={faClock} className="pe-2" />
              {format(new Date(createdAt), "HH:mm")}
            </div>
          </div>
          <div className="timer">
            {interval ? (
              pickupTime && <TimeComponent time={pickupTime} />
            ) : (
              <div className="round-timer">{pickupTime}</div>
            )}
          </div>
        </div>
        <div className="items">
          {items.map((props) => {
            return (
              <Item
                {...props}
                key={props?.itemId}
                itemDisabled={itemDisabled}
              />
            );
          })}
        </div>
        <div className="price">{formatPrice(price)}</div>
        {renderFooter()}
      </StyledLeftItem>
    );
  },
  isEqual
);

const Item = memo(({ itemDisabled, ...rest }) => {
  const { count, title } = rest;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      {!itemDisabled && (
        <ItemModal {...rest} name={title} show={show} onClose={handleClose} />
      )}
      <StyledItem
        className="border-bottom border-gray-500 py-1"
        onClick={handleShow}
      >
        <div className="d-flex flex-nowrap title">
          <span className="fw-bolder pe-2">{count}x</span>
          <span className="fw-bolder text-truncate">{title}</span>
        </div>
        {(rest?.extras || rest?.comment) && (
          <div className="ps-4 text-break">
            {rest?.extras && (
              <div className="d-flex flex-column">
                {rest?.extras.map((e) =>
                  e.options?.map((o) => (
                    <span className="font-small fw-bold" key={o.text}>
                      +{o.text}
                    </span>
                  ))
                )}
              </div>
            )}
            {rest?.comment && (
              <span className="px-3 bg-light-senary">{rest?.comment}</span>
            )}
          </div>
        )}
      </StyledItem>
    </>
  );
}, isEqual);

const ItemModal = memo(({ show, onClose, itemId }) => {
  const [item, setItem] = useState();
  useEffect(() => {
    const url = process.env.BACKEND_URI + "meals?id=" + itemId;
    !item &&
      show &&
      fetch(url).then((i) =>
        i.json().then((r) => {
          setItem(r.data[0]);
        })
      );
  }, [item, show, itemId]);

  return (
    <Modal
      show={item && show}
      onHide={onClose}
      centered
      className="item-modal"
      contentClassName={!item && "bg-transparent"}
    >
      {item?.photoURL && (
        <div>
          <Image
            src={item?.photoURL}
            alt="alt-img"
            width="460px"
            height="350px"
          />
        </div>
      )}
      {item && (
        <Modal.Header closeButton={false} className="p-0">
          <Button
            variant="white"
            style={{ height: "27px", width: "27px" }}
            className={`close-modal-btn rounded-circle p-0
              `}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
          </Button>
          <div className="p-3 w-100">
            <div className="font-medium fw-bolder">
              {item?.uid}. {item?.name}
            </div>
            {item?.description && (
              <div className="font-small">{item?.description}</div>
            )}
            <div className="mt-2 text-primary fw-bolder">
              {formatPrice(item?.price)}
            </div>
          </div>
        </Modal.Header>
      )}
      {item?.extras?.length !== 0 && (
        <Modal.Body className="bg-white pt-0">
          <Form.Group className="d-flex flex-column pt-2  border-top border-gray-100">
            {item?.extras?.map((e, index) => (
              <div key={e.title} className="pb-3">
                <Form.Label className="font-small fw-bolder m-0">
                  {e.title}
                </Form.Label>
                <div className="d-flex flex-column">
                  {e.options.map((o) => (
                    <div
                      className="font-small fw-bold ps-3 d-flex flex-nowrap justify-content-between"
                      key={o.text}
                    >
                      <span>+{o.text}</span>
                      {o.price && <span>{formatPrice(o.price)}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Form.Group>
        </Modal.Body>
      )}
    </Modal>
  );
}, isEqual);

const FinishModal = memo(({ show, onClose, ...rest }) => {
  const renderFooter = useCallback(
    () => rest?.renderFooter({ onClick: onClose }),
    [onClose, rest?.renderFooter]
  );
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="p-0"
      contentClassName="w-100"
    >
      <Modal.Body className="bg-white p-0">
        <LeftItem interval {...rest} renderFooter={renderFooter} />
      </Modal.Body>
    </Modal>
  );
}, isEqual);

const RejectModal = memo(({ ...rest }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch();
  const [reason, setReason] = useState();
  const [extra, setExtra] = useState("");
  const CustomButton = ({ children }) => (
    <Button
      className="m-1"
      variant={reason === children ? "senary" : "gray-500"}
      onClick={() => setReason(children)}
    >
      {children}
    </Button>
  );
  const clear = useCallback(() => {
    setReason();
    setExtra("");
  }, []);
  const handleTextChange = useCallback((e) => {
    setExtra(e.target.value);
  }, []);
  const handleCancel = useCallback(() => {
    console.log("post cancel");
    // dispatch(
    //   changeOrderStatus({ id, body: { status: "canceled", reason, extra } })
    // );
    handleClose();
  }, [handleClose]);
  const handleClose = useCallback(() => {
    setShow(false);
    clear();
  }, [clear]);
  return (
    <>
      <Button
        variant="gray-500"
        className="flex-fill ms-2"
        onClick={handleShow}
      >
        Reject
      </Button>
      <Modal show={show} onHide={handleClose} centered className="p-0">
        <Modal.Header className="justify-content-start">
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
            <CustomButton>Cannot complete customer note</CustomButton>
            <CustomButton>Other</CustomButton>
          </div>
          <CustomInput
            className={`font-small fw-bold my-2 text-dark ${
              reason !== "Other" ? "shadow-none" : ""
            } ${extra ? "bg-senary shadow-none" : ""}`}
            placeholder="Anything else to add?"
            onChange={handleTextChange}
            value={extra}
          ></CustomInput>
        </Modal.Body>
        <Modal.Footer className="justify-content-around">
          <Button
            onClick={handleCancel}
            disabled={!reason}
            className="w-100"
            variant={reason ? "senary" : "gray-100"}
          >
            <span>Cancel order</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}, isEqual);
const AcceptModal = memo(({ onClick, ...rest }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [minutes, setMinutes] = useState();
  const CustomButton = ({ children }) => (
    <Button
      className="m-1"
      variant={minutes === children ? "senary" : "gray-500"}
      onClick={() => setMinutes(children)}
    >
      {children}
    </Button>
  );
  const clear = useCallback(() => {
    setMinutes();
  }, []);
  const handleSubmit = useCallback(() => {
    onClick(parseInt(minutes));
    handleClose();
  }, [handleClose, minutes, onClick]);
  const handleClose = useCallback(() => {
    setShow(false);
    clear();
  }, [clear]);
  return (
    <>
      <Button variant="senary" className="flex-fill me-2" onClick={handleShow}>
        Accept
      </Button>
      <Modal show={show} onHide={handleClose} centered className="p-0">
        <Modal.Header className="fw-bolder">Ready in </Modal.Header>
        <Modal.Body className="d-flex flex-wrap w-100 justify-content-center">
          <CustomButton>2min</CustomButton>
          <CustomButton>5min</CustomButton>
          <CustomButton>10min</CustomButton>
          <CustomButton>15min</CustomButton>
          <CustomButton>20min</CustomButton>
          <CustomButton>30min</CustomButton>
          <CustomButton>45min</CustomButton>
        </Modal.Body>
        <Modal.Footer className="justify-content-around">
          <Button
            onClick={handleSubmit}
            disabled={!minutes}
            className="w-100"
            variant={minutes ? "senary" : "gray-100"}
          >
            <span>Submit</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}, isEqual);

export default TwoColumnsOrders;
