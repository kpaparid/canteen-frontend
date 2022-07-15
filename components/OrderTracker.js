import {
  faEnvelopeOpenText,
  faFileLines,
  faPhone,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { isEqual } from "lodash";
import { memo, useCallback, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styledComponents from "styled-components";
import { formatPrice, useDurationHook } from "../utilities/utils.mjs";
import FinishedSvg, { CanceledSvg } from "./svg/FinishedSvg";
import OrderSvg from "./svg/OrderSvg";
import PendingSvg from "./svg/PendingSvg.js";
import ProcessingSvg from "./svg/ProcessingSvg";
import ProcessingSvg2 from "./svg/ProcessingSvg2";
import ReadySvg from "./svg/ReadySvg";
import useAPI from "../hooks/useAPI";
import { useSocket } from "../contexts/SocketContext.js";
const OrderTracker = memo(({ status, ...rest }) => {
  const index =
    status === "pending"
      ? 0
      : status === "confirmed"
      ? 1
      : status === "ready"
      ? 2
      : status === "finished"
      ? 3
      : status === "canceled"
      ? 4
      : -1;
  return (
    <div className="orders-wrapper">
      <div className="w-100 position-relative d-flex justify-content-center">
        <Icon index={index} {...rest} />
      </div>
      {index !== 4 && (
        <div className="d-flex flex-nowrap w-100 justify-content-center py-2 pb-4">
          <Ball bg={"light-primary"} active={index >= 0}></Ball>
          <Ball bg={"light-primary"} active={index >= 1}></Ball>
          <Ball bg={"light-primary"} active={index >= 2}></Ball>
          <Ball bg={"light-primary"} active={index >= 3}></Ball>
        </div>
      )}
      <RightSide className="orders-list">
        <StyledNumber>{rest.number}</StyledNumber>

        <Details {...rest} />
        {index === 0 && <Cancel {...rest} />}
        {index === 0 && (
          <Item
            title="Bestellung aufgegeben"
            description="Wir haben Ihre Bestellung erhalten."
            weight={0}
            index={index}
          />
        )}
        {index === 1 && (
          <Item
            title="Bestellung bestätigt"
            description="Wir bereiten Ihre Bestellung vor."
            weight={1}
            index={index}
          />
        )}
        {index === 2 && (
          <Item
            title="Abholbereit"
            description="Ihre Bestellung ist abholbereit."
            weight={2}
            index={index}
          />
        )}
        {index === 3 && (
          <Item
            title="Bestellung abgeschlossen"
            description="Ihre Bestellung wurde erfolgreich abgeschlossen."
            weight={3}
            index={index}
          />
        )}
        {index === 4 && (
          <Item
            title="Bestellung storniert"
            description={rest?.meta?.reason}
            details={rest?.meta?.message}
            weight={4}
            index={index}
          />
        )}
      </RightSide>
    </div>
  );
}, isEqual);

const Item = memo(({ title, description, details, index, weight }) => {
  return (
    <div className="item px-2">
      <div className={`order-status bg-light-primary`}>
        <div className="order-status-title">{title}</div>
        {description && (
          <div className="order-status-description">{description}</div>
        )}
        {details && <div className="order-status-description">{details}</div>}
      </div>
    </div>
  );
}, isEqual);

const Icon = memo(({ index, time }) => {
  return (
    <div className="lottie-wrapper">
      {index === 0 ? (
        <PendingSvg></PendingSvg>
      ) : index === 1 ? (
        <ProcessingSvg2 time={time}></ProcessingSvg2>
      ) : index === 2 ? (
        <ReadySvg />
      ) : index === 3 ? (
        <FinishedSvg />
      ) : (
        <CanceledSvg />
      )}
    </div>
  );
}, isEqual);

const Details = memo(({ number, user, time, items, price, phoneNumber }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <StyledDetailsBtn variant="light-primary" onClick={handleShow}>
        <FontAwesomeIcon icon={faFileLines} />
      </StyledDetailsBtn>
      <Modal
        show={show}
        onHide={handleClose}
        contentClassName="m-auto"
        dialogClassName="w-100 h-100 d-flex"
        backdropClassName="order-details-modal-backdrop"
      >
        <StyledDetailsModalBody className="w-100">
          <div className="info-wrapper">
            <div className="info">
              <div
                className="order-id fw-bolder"
                style={{ height: "fit-content", width: "fit-content" }}
              >
                {number}
              </div>
              {time && (
                <div className="time fw-bolder font-small">
                  <FontAwesomeIcon icon={faClock} className="pe-2" />
                  {time}
                </div>
              )}
            </div>
          </div>
          <div className="items">
            {items.map((props) => {
              return (
                <div
                  key={props.itemId}
                  className="item border-bottom border-gray-500 py-1"
                >
                  <div className="d-flex flex-nowrap title">
                    <span className="fw-bolder  font-small pe-2">
                      {props.count}x
                    </span>
                    <span className="fw-bolder text-truncate font-small">
                      {props.title}
                    </span>
                  </div>
                  {(props?.extras || props?.comment) && (
                    <div className="ps-4 text-break">
                      {props?.extras && (
                        <div className="d-flex flex-column">
                          {props?.extras.map((e) =>
                            e.options?.map((o) => (
                              <span className="font-small fw-bold" key={o.text}>
                                + {o.text}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                      {props?.comment && (
                        <span className="px-3 bg-light-senary text-dark fw-bold">
                          {props?.comment}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="price fw-bolder">{formatPrice(price)}</div>
        </StyledDetailsModalBody>
      </Modal>
    </>
  );
}, isEqual);
const Cancel = memo(({ number, id }) => {
  const [show, setShow] = useState(false);
  const { socket, connect } = useSocket();
  const { cancelOrderByUser } = useAPI();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCancel = useCallback(
    () =>
      cancelOrderByUser(id).then(() => {
        socket?.emit("send_order");
        setShow(false);
      }),
    [cancelOrderByUser, id, socket]
  );
  return (
    <>
      <StyledCancelBtn variant="light-primary" onClick={handleShow}>
        <FontAwesomeIcon icon={faX} />
      </StyledCancelBtn>
      <Modal
        show={show}
        onHide={handleClose}
        variant="primary"
        contentClassName="m-auto border-0"
        dialogClassName="w-100 h-100 d-flex"
        backdropClassName="order-cancel-modal-backdrop"
      >
        <Modal.Header className="bg-primary border-2 border-primary header-text text-white text-center d-flex justify-content-center">
          Bestellung Stornieren
        </Modal.Header>
        <Modal.Body className="fw-bold py-4">
          Sind Sie sicher, dass Sie diese Bestellung stornieren möchten?
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <div className="w-50 m-0 px-2">
            <Button className="w-100  header-text" onClick={handleClose}>
              Nein
            </Button>
          </div>
          <div className="w-50 m-0 px-2">
            <Button className="w-100 header-text" onClick={handleCancel}>
              Ja
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}, isEqual);
const StyledDetailsBtn = styledComponents(Button)`
  position: absolute;
  top: -5px;
  right: 24px;
  padding: 0;
  width: 30px;
  height: 30px;
  z-index: 100;
  &:focus{
    background-color: var(--bs-light-primary);
  }
`;
const StyledCancelBtn = styledComponents(Button)`
  position: absolute;
  top: -5px;
  right: 64px;
  padding: 0;
  width: 30px;
  height: 30px;
  z-index: 100;
  &:focus{
    background-color: var(--bs-light-primary);
  }
`;
const StyledNumber = styledComponents.div`
  position: absolute;
  top: -5px;
  left: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  height: 30px;
  z-index: 100;
  background-color: var(--bs-light-primary);
`;
const StyledDetailsModalBody = styledComponents(Modal.Body)`
min-width: 300px;
.info-wrapper{
  border-bottom: 2px solid var(--bs-body-color);
  padding-bottom: 0.5rem;
}
.items{
  border-bottom: 2px solid var(--bs-body-color);
  .item:last-child{
    border: 0 !important;
  }
  margin-bottom: 0.5rem;
}
`;
const Ball = styledComponents.div`
// background-color: ${(props) => "var(--bs-" + props.bg + ")"};
background-color: ${(props) =>
  props.active ? "var(--bs-light-primary)" : "var(--bs-gray-100)"};

height: 23px;
width: 23px;
border-radius: 2rem;
border: 4px solid white;
z-index: 900;
`;
const RightSide = styledComponents.div`
position: relative;
display: flex;
width: 100%;
flex-direction: column;
padding: 1.5rem 1rem;

.item:first-child .bar:before{
    background-color: transparent;
}
.item:last-child .bar:after{
    background-color: transparent;
}
`;
export default OrderTracker;
