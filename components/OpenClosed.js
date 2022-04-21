import { isEqual } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { openCloseShop, selectShopIsOpen } from "../reducer/redux2";

const OpenClosed = memo(({ value }) => {
  const dispatch = useDispatch();
  const v = useSelector(selectShopIsOpen);
  const [clicked, setClicked] = useState(v);
  const [pending, setPending] = useState(false);
  const handleClick = useCallback(() => {
    setPending(true);
    dispatch(openCloseShop(!clicked)).then((r) => {
      setPending(false);
    });
  }, [clicked]);
  useEffect(() => {
    setClicked(v);
  }, [v]);

  const status = (pending ? "pending" : "") + (!clicked ? " enabled" : "");
  return (
    <div className="open-closed-shop">
      <div className={`container ${status}`}>
        <Button
          className="shadow-none"
          variant="transparent"
          disabled={pending}
          onClick={handleClick}
        >
          <div className="top">
            <div className="pin">
              <div className="rope left"></div>
              <div className="rope right"></div>
            </div>
          </div>
          <div className="bottom">
            <div className="side open">OPEN</div>
            <div className="side closed">CLOSED</div>
          </div>
        </Button>
      </div>
    </div>
  );
}, isEqual);
export default OpenClosed;
