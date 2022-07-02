import {
  faEnvelopeOpenText,
  faFileLines,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { isEqual } from "lodash";
import { memo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styledComponents from "styled-components";
import { formatPrice, useDurationHook } from "../utilities/utils.mjs";
import FinishedSvg from "./svg/FinishedSvg";
import OrderSvg from "./svg/OrderSvg";
import PendingSvg from "./svg/PendingSvg.js";
import ProcessingSvg from "./svg/ProcessingSvg";
import ProcessingSvg2 from "./svg/ProcessingSvg2";
import ReadySvg from "./svg/ReadySvg";

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
      : -1;
  return (
    <div className="orders-wrapper">
      <div className="w-100 position-relative d-flex justify-content-center">
        <Icon index={index} {...rest} />
      </div>
      <RightSide className="orders-list">
        <StyledNumber>{rest.number}</StyledNumber>
        <Details {...rest} />
        <Item
          title="Bestellung aufgegeben"
          description="Wir haben Ihre Bestellung erhalten."
          weight={0}
          index={index}
        />
        <Item
          title="Bestellung bestätigt"
          description="Wir bereiten Ihre Bestellung vor."
          weight={1}
          index={index}
        />
        <Item
          title="Abholbereit"
          description="Ihre Bestellung ist abholbereit"
          weight={2}
          index={index}
        />
        <Item
          title="Bestellung abgeschlossen"
          description="Ihre Bestellung wurde erfolgreich abgeschlossen."
          weight={3}
          index={index}
        />
      </RightSide>
    </div>
  );
}, isEqual);

const Item = memo(({ title, description, icon, index, weight }) => {
  const calcBg = (i, w) =>
    w === i ? "light-primary" : w > i ? "gray-100" : "gray-100";
  const bg = calcBg(index, weight);
  const bgAfter = calcBg(index - 1, weight);
  const active =
    index === weight
      ? "bg-light-primary font-normal"
      : index < weight
      ? "opacity-25 font-small"
      : "bg-light-primary opacity-50 font-small";
  const active2 =
    index === weight ? "active" : index < weight ? "pending" : "finished";

  return (
    <div className="item d-flex flex-nowrap align-items-center px-2">
      <div
        className="position-relative h-100"
        style={{ minWidth: "30px", maxWidth: "30px" }}
      >
        <Ball bg={bg} active2={active2}></Ball>
        <Bar
          active2={active2}
          bgBefore={bg}
          bgAfter={bgAfter}
          className="bar"
        />
      </div>
      <div className={`order-status ${active}`}>
        <div className="order-status-title">{title}</div>
        <div className="order-status-description">{description}</div>
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
      ) : (
        <FinishedSvg />
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
const StyledNumber = styledComponents.div`
  position: absolute;
  top: -5px;
  left: 36px;
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
  props.active2 === "pending"
    ? "var(--bs-gray-100)"
    : "var(--bs-light-primary)"};

opacity: ${(props) => (props.active2 === "pending" ? "50%%" : "100%")};

height: 23px;
width: 23px;
border-radius: 2rem;
border: 4px solid white;
z-index: 900;
top: 50%;
transform: translateY(-50%);
position: absolute;
`;
const Bar = styledComponents.div`
position: absolute;
left: 7.5px;
top: 0;
bottom: 0;
&:before{
    position: absolute;
    top: 0;
    bottom: 50%;
    width: 5px;
    content: "";
    display: block;
    background-color: ${(props) => "var(--bs-" + props.bgBefore + ")"};
    z-index: 600;
}
&:after{
    position: absolute;
    top: 50%;
    bottom: 0;
    width: 5px;
    content: "";
    display: block;
    background-color: ${(props) => "var(--bs-" + props.bgAfter + ")"};
    z-index: 600;
}
`;
const RightSide = styledComponents.div`
position: relative;
display: flex;
width: 100%;
flex-direction: column;
padding-bottom: 1.5rem;
padding-top: 25px;
.order-status{
  margin-right: 15px;
}

.item:first-child .bar:before{
    background-color: transparent;
}
.item:last-child .bar:after{
    background-color: transparent;
}
`;
export default OrderTracker;
