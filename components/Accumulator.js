import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Button from "react-bootstrap/Button";

const Accumulator = ({ count, onIncrease, onDecrease }) => {
  const disabled = !(count - 1);
  return (
    <div className="count-wrapper expanded">
      <Button
        disabled={disabled}
        className="rounded-circle p-0 fw-bolder text-primary"
        variant={disabled ? "transparent" : "white"}
        onClick={onDecrease}
      >
        <FontAwesomeIcon size="xs" className="m-auto" icon={faMinus} />
      </Button>
      <span className="fw-bold text-primary">{count}</span>
      <Button
        className="rounded-circle p-0 fw-bolder text-primary"
        variant="white"
        onClick={onIncrease}
      >
        <FontAwesomeIcon size="sm" className="m-auto" icon={faPlus} />
      </Button>
    </div>
  );
};

export const ExpandableAccumulator = ({ count, onIncrease, onDecrease }) => {
  const [expanded, setExpanded] = useState(false);
  const disabled = !(count - 1);
  return (
    <div className={`count-wrapper ${expanded ? "expanded" : ""}`}>
      <Button
        disabled={disabled}
        className="rounded-circle p-0 fw-bolder text-primary"
        variant={disabled ? "transparent" : "white"}
        onClick={onDecrease}
      >
        <FontAwesomeIcon size="xs" className="m-auto" icon={faMinus} />
      </Button>
      <span
        className="fw-bold text-primary"
        onClick={(e) => setExpanded((old) => !old)}
      >
        {count}
      </span>
      <Button
        className="rounded-circle p-0 fw-bolder text-primary"
        variant="white"
        onClick={onIncrease}
      >
        <FontAwesomeIcon size="sm" className="m-auto" icon={faPlus} />
      </Button>
    </div>
  );
};

export default Accumulator;
