import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import { memo } from "react";
import { Modal } from "react-bootstrap";

const BellAlertModal = memo(({ show, onClose }) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      fullscreen
      contentClassName="d-flex justify-content-center align-items-center bg-pulse-nonary-pending"
    >
      <div className="h-100 w-100 d-flex" onClick={onClose}>
        <FontAwesomeIcon
          className="swing m-auto"
          icon={faBell}
          size="9x"
        ></FontAwesomeIcon>
      </div>
    </Modal>
  );
}, isEqual);
export default BellAlertModal;
