import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faBars, faPhone, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addMinutes, format, intervalToDuration } from "date-fns";
import { isEqual } from "lodash";
import Image from "next/image";
import { memo, useCallback, useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { useDispatch, useSelector } from "react-redux";
import styledComponents from "styled-components";
import {
  fetchSettings,
  openCloseShop,
  selectShopIsOpen,
} from "../reducer/redux2";
import { formatPrice, useDurationHook } from "../utilities/utils.mjs";
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
height: calc(100% - 50px);
background-color: var(--bs-gray-white);
border-radius: 0.25rem;

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
const ColumnsWrapper = styledComponents.div`
height: calc(100% - 50px);
width: 100%;
display: flex;
justify-content: space-around;
flex-wrap: wrap;
margin: auto;
.orders-list-wrapper{
    // width: 40%;
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
`;
const StyledNavBar = styledComponents.div`
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
  cursor: pointer;
  &:hover{
    color: white;
  }
}
`;
const TwoColumnsOrders = memo(
  ({ orders, loading, socket, onChangeOrderStatus }) => {
    // const dispatch = useDispatch();
    const leftColumn = orders?.pending;
    const middleColumn = orders?.confirmed;
    const rightColumn = orders?.ready;
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
      (userId, orderId) => {
        onChangeOrderStatus(userId, orderId, { status: "confirmed" });
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
      (userId, orderId) => {
        onChangeOrderStatus(userId, orderId, { status: "pending" });
      },
      [onChangeOrderStatus]
    );
    const handleReady = useCallback(
      (userId, orderId) => {
        onChangeOrderStatus(userId, orderId, { status: "ready" });
      },
      [onChangeOrderStatus]
    );
    const handleFinish = useCallback(
      (userId, orderId) => {
        onChangeOrderStatus(userId, orderId, { status: "finished" });
      },
      [onChangeOrderStatus]
    );
    const handleDeclined = useCallback(
      (userId, orderId) => {
        onChangeOrderStatus(userId, orderId, { status: "declined" });
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
        <TopBar />
        <ColumnsWrapper className="px-2">
          <OrdersList
            orders={leftColumn}
            title="pending"
            renderItem={(props) => (
              <LeftItem
                key={props.id}
                {...props}
                renderFooter={(footerProps) => (
                  <div className="d-flex flex-nowrap w-100 mt-3">
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
            orders={middleColumn}
            title="confirmed"
            renderItem={(props) => (
              <LeftItem
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
            orders={rightColumn}
            col={2}
            title="ready"
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
                        handleNew(props.user.uid, props.id);
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
const TopBar = memo(() => {
  const dispatch = useDispatch();
  const shopEnabled = useSelector(selectShopIsOpen);
  const handleClick = useCallback(
    () =>
      dispatch(openCloseShop(!shopEnabled)).then((r) =>
        dispatch(fetchSettings({ suffix: "?uid=shopIsOpen" }))
      ),
    [shopEnabled]
  );
  return (
    <StyledNavBar className="px-4">
      <div className="h-100" style={{ padding: "0.85rem 0" }}>
        <FontAwesomeIcon className="h-100" icon={faBars} />
      </div>
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
}, isEqual);
const OrdersList = memo(({ orders, title, renderItem }) => {
  return (
    <div className={`orders-list-wrapper d-flex flex-column h-100`}>
      <StyledTitle>
        <span className="title">{title}</span>
        <span className="count">{orders?.length}</span>
      </StyledTitle>
      <StyledOrderList className="orders-list">
        <Scrollbars style={{ width: "100%", height: "100%" }}>
          {orders?.map((o) => renderItem(o))}
        </Scrollbars>
      </StyledOrderList>
    </div>
  );
}, isEqual);

const ReadyItem = memo((props) => {
  const {
    number,
    user: { email, displayName, pickupTime = new Date() },
  } = props;
  const interval = intervalToDuration({
    start: new Date(),
    end: pickupTime,
  }).minutes;
  const time = interval <= 0 ? "now" : interval + "min";
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="ms-2 mb-2">
      <FinishModal show={show} onClose={handleClose} {...props} />
      <Button
        variant="light-nonary"
        className="w-100 d-flex flex-column rounded text-white justify-content-center align-items-center p-4"
        onClick={handleShow}
      >
        <div className="rounded rounded-3 bg-gray-500 text-nonary fw-bolder px-2 py-1">
          {number}
        </div>
        <div className="text-truncate text-break w-100 text-center my-2">
          {displayName || email}
        </div>
        {interval > 0 && (
          <div className="text-center font-small text-gray-white">
            Pickup in
          </div>
        )}
        <div className="rounded bg-very-light-nonary px-2 py-1 text-center">
          {time}
        </div>
      </Button>
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
  }) => {
    const duration = useDurationHook(pickupTime);

    return (
      <div className="text-body-color m-2 d-flex flex-nowrap flex-column border-gray-white bg-white rounded p-4">
        <div className="d-flex w-100 flex-md-row flex-column justify-content-center align-items-center">
          <div className="col d-flex flex-column align-items-center align-items-md-start">
            <div
              className="fw-bolder rounded rounded-3 bg-gray-500 py-1 px-2"
              style={{ height: "fit-content", width: "fit-content" }}
            >
              {number}
            </div>
            <div className="fw-bolder text-truncate mt-2">
              {displayName || email}
            </div>
            {phoneNumber && (
              <div className="font-small fw-bold text-gray-800">
                <FontAwesomeIcon icon={faPhone} className="pe-2" />
                {phoneNumber}
              </div>
            )}
            <div className="font-small fw-bold text-gray-800">
              <FontAwesomeIcon icon={faClock} className="pe-2" />
              {format(new Date(createdAt), "HH:mm")}
            </div>
          </div>
          <div
            className="d-flex justify-content-center"
            style={{ height: "fit-content" }}
          >
            {duration && (
              <div
                className="border border-4 border-senary px-2 rounded-circle d-flex flex-column justify-content-center align-items-center"
                style={{
                  aspectRatio: "1",
                  minWidth: "64px",
                  height: "fit-content",
                }}
              >
                {Object.keys(duration).map((k) => {
                  const { value, unit } = duration[k];
                  return (
                    <div className="d-flex" key={k}>
                      <div className="fw-bolder">{value}</div>
                      {unit && <div className="fw-bolder">{unit}</div>}
                    </div>
                  );
                })}
                <span className="font-small fw-bold text-gray-800">
                  {pickupTime}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 border-top border-gray-500">
          {items.map((props) => {
            return <Item {...props} key={props?.itemId} />;
          })}
        </div>
        <div className="fw-bold mt-3">{formatPrice(price)}</div>
        {renderFooter()}
      </div>
    );
  },
  isEqual
);

const Item = memo((props) => {
  const { count, title } = props;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <ItemModal {...props} name={title} show={show} onClose={handleClose} />
      <StyledItem
        className="border-bottom border-gray-500 py-1"
        onClick={handleShow}
      >
        <div className="d-flex flex-nowrap title">
          <span className="fw-bolder pe-2">{count}x</span>
          <span className="fw-bolder">{title}</span>
        </div>
        {(props?.extras || props?.comment) && (
          <div className="ps-4">
            {props?.extras && (
              <div className="d-flex flex-column">
                {props?.extras.map((e) =>
                  e.options?.map((o) => (
                    <span className="font-small fw-bold" key={o.text}>
                      +{o.text}
                    </span>
                  ))
                )}
              </div>
            )}
            {props?.comment && (
              <span className="px-3 bg-light-senary">{props?.comment}</span>
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
  }, [item, show]);

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
    <Modal show={show} onHide={onClose} centered className="p-0">
      <Modal.Body className="bg-white p-0">
        <LeftItem {...rest} renderFooter={renderFooter} />
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

TwoColumnsOrders.displayName = "TwoColumnsOrders";

RejectModal.displayName = "RejectModal";

AcceptModal.displayName = "AcceptModal";

FinishModal.displayName = "FinishModal";

ItemModal.displayName = "ItemModal";

Item.displayName = "Item";

LeftItem.displayName = "LeftItem";

ReadyItem.displayName = "ReadyItem";

TopBar.displayName = "TopBar";

OrdersList.displayName = "OrdersList";
