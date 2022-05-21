import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faPhone, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, intervalToDuration } from "date-fns";
import { isEqual } from "lodash";
import Image from "next/image";
import { memo, useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { useDispatch } from "react-redux";
import styledComponents from "styled-components";
import { changeOrderStatus, fetchMeals } from "../reducer/redux2";
import { formatPrice } from "../utilities/utils";
const ColumnsWrapper = styledComponents.div`
height: 100%;
width: 100%;
display: flex;
justify-content: space-around;
flex-wrap: wrap;
margin: auto;
.orders-list-wrapper{
    width: 39%;
    &:last-child{
        width: 20%;
        .orders-list{
            background-color: transparent;
        }
    }
}
`;

const TwoColumnsOrders = memo(({ orders }) => {
  const dispatch = useDispatch();
  const leftColumn = orders?.pending;
  const middleColumn = orders?.confirmed;
  const rightColumn = orders?.ready;
  const handleStatusChange = useCallback((id, body) => {
    dispatch(changeOrderStatus({ id, body }));
  }, []);
  const handleAccept = useCallback((id) => {
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

  return (
    <div className="bg-darker-nonary h-100 w-100 d-flex">
      <ColumnsWrapper>
        <OrdersList
          orders={leftColumn}
          title="pending"
          renderItem={(props) => (
            <LeftItem
              {...props}
              footer={
                <div className="d-flex flex-nowrap w-100 mt-3">
                  <Button
                    variant="senary"
                    className="text-white flex-fill me-2"
                    onClick={() => handleAccept(props.id)}
                  >
                    Accept
                  </Button>
                  <Button variant="gray-500" className="flex-fill ms-2">
                    Reject
                  </Button>
                </div>
              }
            />
          )}
        />
        <OrdersList
          orders={middleColumn}
          title="confirmed"
          renderItem={(props) => (
            <LeftItem
              {...props}
              footer={
                <div className="d-flex flex-nowrap w-100 mt-3">
                  <Button
                    variant="ready"
                    className="text-white flex-fill me-2"
                    onClick={() => handleReady(props.id)}
                  >
                    Mark as Ready
                  </Button>
                </div>
              }
            />
          )}
        />
        <OrdersList
          orders={rightColumn}
          col={2}
          title="ready"
          renderItem={(props) => (
            <ReadyItem
              {...props}
              onClick={() => handleNew(props.id)}
            ></ReadyItem>
          )}
        />
      </ColumnsWrapper>
    </div>
  );
}, isEqual);

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

const ReadyItem = memo(
  ({
    id,
    number,
    user: { email, displayName, pickupTime = new Date() },
    createdAt,
    onClick,
  }) => {
    const interval = intervalToDuration({
      start: new Date(),
      end: pickupTime,
    }).minutes;
    const time = interval <= 0 ? "now" : interval + "min";
    return (
      <div className="mx-2 mb-2">
        <Button
          variant="light-nonary"
          className="w-100 d-flex flex-column rounded text-white justify-content-center align-items-center p-4"
          onClick={onClick}
        >
          <div className="rounded rounded-3 bg-gray-500 text-dark fw-bolder px-2 py-1">
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
  },
  isEqual
);
const LeftItem = memo(
  ({
    number,
    user: {
      email,
      displayName,
      pickupTime = new Date(),
      phoneNumber = "+15751275315",
    },
    createdAt,
    items,
    price,
    footer = <></>,
  }) => {
    const interval = intervalToDuration({
      start: new Date(),
      end: pickupTime,
    }).minutes;
    // const time = interval <= 0 ? "now" : interval + "min";
    const time = 60 + "min";
    return (
      <div className="text-dark m-2 d-flex flex-nowrap flex-column border-gray-white bg-white rounded text-white p-4">
        <div className="d-flex w-100 flex-sm-column flex-md-row justify-content-center">
          <div className="col d-flex flex-column align-items-sm-center align-items-md-start">
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
            <div
              className="border border-4 border-senary px-2 rounded-circle d-flex flex-column justify-content-center align-items-center"
              style={{ aspectRatio: "1", minWidth: "64px" }}
            >
              <span className="fw-bolder">{time}</span>
              <span className="font-small fw-bold text-gray-800">12:05</span>
            </div>
          </div>
        </div>
        <div className="mt-4 border-top border-gray-500">
          {items.map((props) => {
            return (
              <div className="border-bottom border-gray-500 py-1">
                <Item {...props} />
                {(props?.extras || props?.comment) && (
                  <div className="ps-4">
                    {props?.extras && (
                      <div className="d-flex flex-column">
                        {props?.extras.map((e) =>
                          e.options?.map((o) => (
                            <span className="font-small fw-bold">{o.text}</span>
                          ))
                        )}
                      </div>
                    )}
                    {props?.comment && (
                      <span className="px-3 bg-light-senary">
                        {props?.comment}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="fw-bold mt-3">{formatPrice(price)}</div>
        {footer}
      </div>
    );
  },
  isEqual
);
const StyledItemTitle = styledComponents.div`
&:hover{
  color: var(--bs-senary);
  cursor: pointer;
}`;
const Item = memo((props) => {
  const { count, title, comment, extras } = props;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <ItemModal {...props} name={title} show={show} onClose={handleClose} />
      <StyledItemTitle className="d-flex flex-nowrap" onClick={handleShow}>
        <span className="fw-bolder pe-2">{count}x</span>
        <span className="fw-bolder">{title}</span>
      </StyledItemTitle>
    </>
  );
}, isEqual);

const ItemModal = memo(({ show, onClose, itemId }) => {
  const [item, setItem] = useState();
  const dispatch = useDispatch();
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
    <Modal show={show} onHide={onClose} centered className="item-modal">
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
          <div className="font-big fw-bolder">{item?.name}</div>
          {item?.description && (
            <div className="font-small">{item?.description}</div>
          )}
          <div className="mt-2 text-primary fw-bolder">
            {formatPrice(item?.price)}
          </div>
        </div>
      </Modal.Header>
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
                    <div className="font-small fw-bold ps-3 d-flex flex-nowrap justify-content-between">
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

export default TwoColumnsOrders;
