import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import { memo } from "react";
import styledComponents from "styled-components";
import OrderSvg from "./svg/OrderSvg";
import ProcessingSvg from "./svg/ProcessingSvg";
import ProcessingSvg2 from "./svg/ProcessingSvg2";
import ReadySvg from "./svg/ReadySvg";
const Ball = styledComponents.div`
background-color: ${(props) => "var(--bs-" + props.bg + ")"};
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
flex-direction: column;
.item:first-child .bar:before{
    background-color: transparent;
}
.item:last-child .bar:after{
    background-color: transparent;
}
`;
const OrderTracker = memo(({ status }) => {
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
    <div className="d-flex flex-column justify-content-center align-items-center py-4 bg-white">
      <Icon index={index} />
      <div className="d-flex">
        <RightSide>
          <Item
            title="Order Placed"
            subtitle="We have received your order."
            weight={0}
            index={index}
          />
          <Item
            title="Order Confirmed"
            subtitle="Your order has been confirmed."
            weight={1}
            index={index}
          />
          <Item
            title="Order Processed"
            subtitle="We are preparing your order."
            weight={2}
            index={index}
          />
          <Item
            title="Ready to Pickup"
            subtitle="Your order is ready for pickup."
            weight={3}
            index={index}
          />
          <Item
            title="Order Finished"
            subtitle="Your order was successful."
            weight={4}
            index={index}
          />
        </RightSide>
      </div>
    </div>
  );
}, isEqual);
const Item = memo(({ title, subtitle, icon, index, weight }) => {
  const calcBg = (i, w) =>
    w === i ? "primary" : w > i ? "gray-100" : "primary";
  const bg = calcBg(index, weight);
  const bgAfter = calcBg(index - 1, weight);
  const active =
    index === weight ? "bg-light-primary" : index < weight ? "opacity-25" : "";

  return (
    <div className="item d-flex flex-nowrap align-items-center px-2">
      <div className="position-relative h-100" style={{ width: "30px" }}>
        <Ball bg={bg}></Ball>
        <Bar bgBefore={bg} bgAfter={bgAfter} className="bar" />
      </div>
      <div
        className={`px-3 py-3 d-flex justify-content-center flex-fill flex-column ${active}`}
      >
        <div className="fw-bolder">{title}</div>
        <div className="fw-bold">{subtitle}</div>
      </div>
    </div>
  );
}, isEqual);

const Icon = memo(({ index }) => {
  switch (index) {
    case 0:
      return (
        <>
          <div
            style={{ height: "150px", width: "200px" }}
            className="d-flex justify-content-center align-items-center"
          >
            <OrderSvg></OrderSvg>
          </div>
        </>
      );
    case 2:
      return (
        <>
          <div
            style={{ height: "250px", width: "250px" }}
            className="d-flex justify-content-center align-items-center"
          >
            <ProcessingSvg2></ProcessingSvg2>
          </div>
        </>
      );
    case 3:
      return (
        <div
          style={{ height: "150px", width: "200px" }}
          className="d-flex justify-content-center align-items-center"
        >
          <ReadySvg />
        </div>
      );

    default:
      return <></>;
  }
}, isEqual);

export default OrderTracker;
