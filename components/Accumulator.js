import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";

const Accumulator = ({ count, onIncrease, onDecrease }) => {
  return (
    <div className="count-wrapper">
      <Button
        disabled={!(count - 1)}
        className="rounded-circle p-0 fw-bolder d-flex"
        variant="light-tertiary"
        onClick={onDecrease}
      >
        <FontAwesomeIcon size="xs" className="m-auto" icon={faMinus} />
      </Button>
      <span className="px-2 fw-bold">{count}</span>
      <Button
        className="rounded-circle p-0 fw-bolder d-flex"
        variant="light-tertiary"
        onClick={onIncrease}
      >
        <FontAwesomeIcon size="xs" className="m-auto" icon={faPlus} />
      </Button>
    </div>
  );
};
export default Accumulator;
