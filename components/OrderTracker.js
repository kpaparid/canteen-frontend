import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import { memo } from "react";
import styledComponents from "styled-components";
import { useDurationHook } from "../utilities/utils.mjs";
import FinishedSvg from "./svg/FinishedSvg";
import OrderSvg from "./svg/OrderSvg";
import PendingSvg from "./svg/PendingSvg.js";
import ProcessingSvg from "./svg/ProcessingSvg";
import ProcessingSvg2 from "./svg/ProcessingSvg2";
import ReadySvg from "./svg/ReadySvg";
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
display: flex;
width: 100%;
flex-direction: column;
.item:first-child .bar:before{
    background-color: transparent;
}
.item:last-child .bar:after{
    background-color: transparent;
}
`;
const OrderTracker = memo(({ status, ...rest }) => {
  const index =
    status === "pending"
      ? 0
      : status === "confirmed"
      ? 2
      : status === "ready"
      ? 3
      : status === "finished"
      ? 4
      : -1;
  return (
    <div className="orders-wrapper">
      <Icon index={index} {...rest} />
      <RightSide className="orders-list">
        <Item
          title="Order Placed"
          description="We have received your order."
          weight={0}
          index={index}
        />
        {/* <Item
            title="Order Confirmed"
            subtitle="Your order has been confirmed."
            weight={1}
            index={index}
          /> */}
        <Item
          title="Order Confirmed"
          description="We are preparing your order."
          weight={2}
          index={index}
        />
        <Item
          title="Ready to Pickup"
          description="Your order is ready for pickup."
          weight={3}
          index={index}
        />
        <Item
          title="Order Finished"
          description="Your order was successful."
          weight={4}
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
      ) : index === 2 ? (
        <ProcessingSvg2 time={time}></ProcessingSvg2>
      ) : index === 3 ? (
        <ReadySvg />
      ) : (
        <FinishedSvg />
      )}
    </div>
  );
}, isEqual);

export default OrderTracker;
