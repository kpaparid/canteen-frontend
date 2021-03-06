import { isEqual } from "lodash";
import { memo, useEffect } from "react";
import { Alert } from "react-bootstrap";

const DismissibleAlert = memo(
  ({
    className = "",
    title = "Oh snap! You got an error!",
    message,
    show,
    onClose,
    variant = "danger",
  }) => {
    useEffect(() => {
      const timer1 = setTimeout(() => onClose && onClose(), 10000);
      return () => {
        clearTimeout(timer1);
      };
    }, [onClose]);
    if (show) {
      return (
        <Alert
          className={`m-0 ${className}`}
          variant={variant}
          onClose={onClose}
          dismissible
        >
          <Alert.Heading>{title}</Alert.Heading>
          {message && <p className="fw-bold">{message}</p>}
        </Alert>
      );
    }
    return <></>;
  },
  isEqual
);
export default DismissibleAlert;
