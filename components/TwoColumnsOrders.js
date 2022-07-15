import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faBars, faPhone, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  addMinutes,
  format,
  intervalToDuration,
  isAfter,
  parse,
} from "date-fns";
import { isEqual } from "lodash";
import Image from "next/image";
import { memo, useCallback, useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import styledComponents from "styled-components";
import useAPI from "../hooks/useAPI";
import { fetchMealsThunk, selectShopIsOpen } from "../reducer/redux2";
import { formatPrice, useDurationHook } from "../utilities/utils.mjs";
import DismissibleAlert from "./Alert";
import RegisterUser from "./Register";
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
  width: 90px;
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
      .info-wrapper{
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--bs-gray-500);
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
      .info{
        text-align: left;
      }
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
    padding-top: 50px;
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
      flex-direction: column;
      width: 100%;
      margin: 0;
      max-width: initial;
      background-color: var(--bs-light-nonary);
      height: calc(100% - 35px);
      border-radius: 0;
    }
    .orders-list-wrapper{
      &:first-child, &:nth-child(2){
        height: calc(100% - 110px);
        max-width: 49%;
        min-width: 49%;
        margin: 0;
      }        
      &:last-child{
        width: 100%;
        height: 110px;
        flex-direction: row;
        flex-wrap: nowrap;
        .orders-list{
          width: 100%;
          align-items: center;
          height: 100% !important;
          display: flex;
          flex-wrap: nowrap;
          flex-direction: row;
          .right-item{
            min-width: 185px;
          }
        }
        .orders-title{
          display: none;
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

const TwoColumnsOrders = memo(
  ({ orders, loading, onChangeOrderStatus, onChangeShopStatus }) => {
    const pendingColumn = orders?.pending;
    const confirmedColumn = orders?.confirmed;
    const readyColumn = orders?.ready;
    const archivedColumn = orders?.archived;
    const [showLoading, setShowLoading] = useState();

    const shopEnabled = useSelector(selectShopIsOpen);
    const [error, setError] = useState();
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

    const handleShopStatusChange = useCallback(
      () =>
        shopEnabled
          ? orders?.pending?.length +
              orders?.confirmed?.length +
              orders?.ready?.length ===
            0
            ? onChangeShopStatus(!shopEnabled).catch((r) => {
                console.log(r);
                setError(r.message);
                return r;
              })
            : setError(
                "Υπάρχουν ακόμα εκκρεμείς παραγγελίες. Μετακινήστε τις παραγγελίες στην λίστα με τις ολοκληρωμένες και προσπαθήστε ξανα."
              )
          : onChangeShopStatus(!shopEnabled).catch((r) => {
              console.log(r);
              setError(r.message);
              return r;
            }),
      [onChangeShopStatus, shopEnabled, orders]
    );
    const handleAccept = useCallback(
      (userId, orderId, body) => {
        return onChangeOrderStatus(userId, orderId, {
          status: "confirmed",
          ...body,
        });
      },
      [onChangeOrderStatus]
    );
    const handleTimeAndAccept = useCallback(
      (userId, orderId, minutes) => {
        const time = format(addMinutes(new Date(), minutes), "HH:mm");
        return onChangeOrderStatus(userId, orderId, {
          status: "confirmed",
          time,
        });
      },
      [onChangeOrderStatus]
    );
    const handleNew = useCallback(
      (userId, orderId, body) => {
        return onChangeOrderStatus(userId, orderId, {
          status: "pending",
          ...body,
        });
      },
      [onChangeOrderStatus]
    );
    const handleReady = useCallback(
      (userId, orderId, body) => {
        return onChangeOrderStatus(userId, orderId, {
          status: "ready",
          ...body,
        });
      },
      [onChangeOrderStatus]
    );
    const handleFinish = useCallback(
      (userId, orderId, body) => {
        return onChangeOrderStatus(userId, orderId, {
          status: "finished",
          ...body,
        });
      },
      [onChangeOrderStatus]
    );
    const handleCancel = useCallback(
      (userId, orderId, body) => {
        return onChangeOrderStatus(userId, orderId, {
          status: "canceled",
          ...body,
        });
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
        <Modal
          show={error}
          onHide={() => setError()}
          centered
          contentClassName=" bg-transparent d-flex justify-content-center align-items-center border-0 shadow-none"
        >
          <Modal.Body className="p-0 bg-transparent">
            <DismissibleAlert title="Σφάλμα" message={error} show={true} />
          </Modal.Body>
        </Modal>
        <TopBar
          archivedColumn={archivedColumn}
          onReady={handleReady}
          onConfirmed={handleAccept}
          onPending={handleNew}
          shopEnabled={shopEnabled}
          onClick={handleShopStatusChange}
        />
        <ColumnsWrapper className="px-2">
          {shopEnabled ? (
            <>
              <OrdersList
                orders={pendingColumn}
                title="Εισερχόμενες"
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
                            onClick={() =>
                              handleAccept(props.user.uid, props.id)
                            }
                          >
                            Accept
                          </Button>
                        ) : (
                          <AcceptModal
                            {...footerProps}
                            onClick={(minutes) =>
                              handleTimeAndAccept(
                                props.user.uid,
                                props.id,
                                minutes
                              )
                            }
                          />
                        )}
                        <RejectModal
                          {...footerProps}
                          onClick={(body) =>
                            handleCancel(props.user.uid, props.id, body)
                          }
                        />
                      </div>
                    )}
                  />
                )}
              />
              <OrdersList
                orders={confirmedColumn}
                title="Επιβεβαιωμένες"
                renderItem={(props) => (
                  <LeftItem
                    details={false}
                    interval
                    key={props.id}
                    {...props}
                    renderFooter={() => (
                      <div className="d-flex flex-nowrap w-100 mt-3">
                        <Button
                          variant="ready"
                          className="text-white flex-fill"
                          onClick={() => handleReady(props.user.uid, props.id)}
                        >
                          Παραγγελία Έτοιμη
                        </Button>
                      </div>
                    )}
                  />
                )}
              />
              <OrdersList
                orders={readyColumn}
                col={2}
                title="Έτοιμες"
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
                          Παραγγελία Ολοκληρώθηκε
                        </Button>
                      </div>
                    )}
                  ></ReadyItem>
                )}
              />
            </>
          ) : (
            <div className="d-flex flex-fill">
              <Button
                variant="success"
                className="p-4 m-auto"
                onClick={handleShopStatusChange}
              >
                <h3 className="text-white header-text m-0">Άνοιγμα</h3>
              </Button>
            </div>
          )}
        </ColumnsWrapper>
      </div>
    );
  },
  isEqual
);
const TopBar = memo(
  ({
    onClick,
    shopEnabled,
    onReady,
    onConfirmed,
    onPending,
    archivedColumn,
  }) => {
    return (
      <StyledNavBar>
        <Sidebar />
        {shopEnabled && (
          <FinishedListModal
            orders={archivedColumn}
            onReady={onReady}
            onConfirmed={onConfirmed}
            onPending={onPending}
          />
        )}
        <div
          className="shop-status d-flex flex-nowrap align-items-center justify-content-around p-1"
          onClick={onClick}
        >
          <div>{shopEnabled ? "Ανοιχτά" : "Κλειστά"}</div>
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
        <Button
          variant="transparent"
          onClick={handleShow}
          className="shadow-none"
        >
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
          <RegisterUser btnText="Εγγραφή Χρήστη" />
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
    duration === 0 || isAfter(start, end) ? "τώρα" : duration + " min";
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
            <span>τώρα</span>
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
    user: { email, displayName, phoneNumber },
    createdAt,
    items,
    price,
    renderFooter = () => <></>,
    interval,
    itemDisabled,
    details = true,
  }) => {
    return (
      <StyledLeftItem className="left-item">
        {details && (
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
              {pickupTime &&
                (interval ? (
                  <TimeComponent time={pickupTime} />
                ) : (
                  <div className="round-timer">{pickupTime}</div>
                ))}
            </div>
          </div>
        )}
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="items flex-fill">
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
          {!details && (
            <div className="timer ps-3">
              {pickupTime &&
                (interval ? (
                  <TimeComponent time={pickupTime} />
                ) : (
                  <div className="round-timer">{pickupTime}</div>
                ))}
            </div>
          )}
        </div>
        {details && <div className="price">{formatPrice(price)}</div>}
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
  const { fetchMeal } = useAPI();
  const [item, setItem] = useState();
  useEffect(() => {
    if (!item && show) {
      fetchMeal(itemId).then((r) => setItem(r.data[0]));
    }
  }, [item, show, itemId, fetchMeal]);

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
const RejectModal = memo(({ onClick }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [reason, setReason] = useState();
  const [extra, setExtra] = useState("");
  const CustomButton = ({ value, label }) => (
    <Button
      className="m-1"
      variant={reason === value ? "senary" : "gray-500"}
      onClick={() => setReason(value)}
    >
      {label}
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
    onClick({
      meta: { reason: reason === "Other" ? "" : reason, message: extra },
    });
    handleClose();
  }, [handleClose, onClick, extra, reason]);
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
        {/* Reject */}
        Απόρριψη
      </Button>
      <Modal show={show} onHide={handleClose} centered className="p-0">
        <Modal.Header className="justify-content-start">
          <div className="ps-2 font-large fw-bolder">
            {/* Cancel Order */}
            Απόρριψη Παραγγελίας
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="font-small fw-bolder">
            Επιλέξτε έναν λόγο για την ακύρωση
          </div>
          <div className="d-flex flex-wrap w-100 my-2 justify-content-center">
            <CustomButton
              value="Nicht genug Zutaten."
              label="Ελλειψη υλικών"
            ></CustomButton>
            <CustomButton
              value="Küche ist geschlossen."
              label="Η Κουζίνα είναι κλειστή"
            ></CustomButton>
            <CustomButton
              value="Kunde angerufen, um zu stornieren."
              label="Ο πελάτης κάλεσε για ακύρωση"
            ></CustomButton>
            <CustomButton
              value="Kundennotiz kann nicht abgeschlossen werden."
              label="Δεν είναι δυνατή η ολοκλήρωση της σημείωσης της παραγγελίας"
            ></CustomButton>
            <CustomButton value="Sonstiges" label="Άλλο"></CustomButton>
          </div>
          <CustomInput
            className={`font-small fw-bold my-2 text-dark ${
              reason !== "Other" ? "shadow-none" : ""
            } ${extra ? "bg-senary shadow-none" : ""}`}
            placeholder="Θέλετε κάτι άλλο να προσθέσετε;"
            onChange={handleTextChange}
            value={extra}
          ></CustomInput>
        </Modal.Body>
        <Modal.Footer className="justify-content-around">
          <Button
            onClick={handleCancel}
            disabled={!reason || (reason === "Other" && extra === "")}
            className="w-100"
            variant={reason ? "senary" : "gray-100"}
          >
            <span>Απόρριψη Παραγγελίας</span>
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
        {/* Accept */}
        Αποδοχή
      </Button>
      <Modal show={show} onHide={handleClose} centered className="p-0">
        <Modal.Header className="fw-bolder">
          {/* Ready in */}
          Έτοιμο σε
        </Modal.Header>
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
            <span>
              {/* Submit */}
              Αποδοχή
            </span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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
          <span className="fw-600">Ολοκληρωμένες</span>
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
const FinishItem = memo(
  ({ active, onPending, onConfirmed, onReady, onClose, ...rest }) => {
    const renderFooter = useCallback(() => {
      return active ? (
        <div className="d-flex flex-wrap w-100 justify-content-between">
          <Button
            variant="pending"
            className="mt-2"
            onClick={() => {
              onPending(rest.user.uid, rest.id, {
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
              onConfirmed(rest.user.uid, rest.id);
              onClose();
            }}
          >
            confirmed
          </Button>
          <Button
            variant="ready"
            className="mt-2"
            onClick={() => {
              onReady(rest.user.uid, rest.id);
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
      rest.user.uid,
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

export default TwoColumnsOrders;
