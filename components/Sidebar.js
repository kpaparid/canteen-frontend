import {
  faBars,
  faFileLines,
  faHistory,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import { memo, useCallback } from "react";
import Button from "react-bootstrap/Button";

const SideBar = memo(({ setActiveKey, activeKey, pendingCount }) => {
  const CustomButton = useCallback(
    ({
      icon,
      className = "",
      value,
      variant = activeKey === value ? "quaternary" : "nonary",
      padding = "18px",
      ...rest
    }) => (
      <Button
        {...rest}
        className={`${className} w-100 h-100 rounded-0 shadow-none`}
        style={{ padding }}
        onClick={() => setActiveKey(value)}
        variant={variant}
      >
        <FontAwesomeIcon icon={icon} className="h-100 w-100" />
      </Button>
    ),
    [activeKey]
  );

  return (
    <div className="h-100 flex-fill d-flex flex-column">
      <div className="w-100 ratio ratio-1x1">
        <CustomButton icon={faBars} value="home" variant="nonary" />
      </div>
      <div className="d-flex flex-column flex-fill py-2">
        <div className="w-100 flex-fill">
          <CustomButton
            icon={faFileLines}
            value="pending"
            variant={
              activeKey === "pending"
                ? "quaternary"
                : pendingCount
                ? "ds bg-pulse-nonary-pending "
                : "nonary"
            }
          />
        </div>
        <div className="w-100 flex-fill">
          <CustomButton icon={faListCheck} value="confirmed" />
        </div>

        <div className="w-100 flex-fill">
          <CustomButton icon={faListCheck} value="ready" />
        </div>
      </div>
      <div className="w-100 ratio ratio-1x1">
        <CustomButton icon={faHistory} value="archived" />
      </div>
    </div>
  );
}, isEqual);
export default SideBar;
