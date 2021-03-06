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

const SideBar = memo(
  ({ setActiveKey, activeKey, pendingCount, shopEnabled }) => {
    const CustomButton = useCallback(
      ({
        icon,
        className = "",
        value,
        variant = activeKey === value ? "quaternary" : "nonary",
        ...rest
      }) => (
        <Button
          {...rest}
          className={`${className} dashboard-sidebar-btn`}
          onClick={() => setActiveKey(value)}
          variant={variant}
        >
          <FontAwesomeIcon icon={icon} />
        </Button>
      ),
      [activeKey]
    );

    return (
      <div className="dashboard-sidebar">
        <CustomButton icon={faBars} value="home" />
        <div className="dashboard-sidebar-btn-group">
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
            disabled={!shopEnabled}
          />
          <CustomButton
            icon={faListCheck}
            value="confirmed"
            disabled={!shopEnabled}
          />
          <CustomButton
            icon={faListCheck}
            value="ready"
            disabled={!shopEnabled}
          />
        </div>
        <CustomButton
          icon={faHistory}
          value="archived"
          disabled={!shopEnabled}
        />
      </div>
    );
  },
  isEqual
);

export default SideBar;
