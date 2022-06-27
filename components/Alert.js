import { isEqual } from "lodash";
import { memo, useEffect } from "react";
import { Alert } from "react-bootstrap";

const DismissibleAlert = memo(
  ({
    className,
    title = "Oh snap! You got an error!",
    message = "",
    show,
    onClose,
  }) => {
    useEffect(() => {
      const timer1 = setTimeout(() => onClose(), 8000);
      return () => {
        clearTimeout(timer1);
      };
    }, [onClose]);
    if (show) {
      return (
        <Alert
          className={className}
          variant="danger"
          onClose={onClose}
          dismissible
        >
          <Alert.Heading>{title}</Alert.Heading>
          <p>{message}</p>
        </Alert>
      );
    }
    return <></>;
  },
  isEqual
);
export default DismissibleAlert;