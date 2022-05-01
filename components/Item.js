import { fa0, faCircleXmark, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import isEqual from "lodash/isEqual";
import Image from "next/image";
import { Fragment, memo, useState } from "react";
import Button from "react-bootstrap/Button";
// import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { formatPrice } from "../utilities/utils";
import Accumulator from "./Accumulator";
// eslint-disable-next-line react/display-name
const Item = memo(
  ({
    photoURL,
    name,
    description,
    price = 0,
    show,
    onClose,
    extras,
    count: initialCount = 1,
    addToCart,
    id,
    uid: menuId,
    ...rest
  }) => {
    {
      const [comment, setComment] = useState();
      const [count, setCount] = useState(initialCount);
      const [data, setData] = useState(
        extras
          ?.map((e, index) => ({
            [index]:
              e.type === "select"
                ? { price: e.options[0].price, options: [e.options[0].text] }
                : { price: 0, options: [] },
          }))
          .reduce((a, b) => ({ ...a, ...b }), {})
      );
      const calculatedPrice = data
        ? Object.keys(data).reduce((a, b) => a + data[b].price, price)
        : price;
      // const calculatedExtras =
      //   data && Object.keys(data).reduce((a, b) => [...a, ...data[b]], []);

      // const calculatedExtras =
      //   data && Object.keys(data).reduce((a, b) => {}, []);
      const formattedPrice = formatPrice(calculatedPrice * count);
      const clearState = () => {
        setCount(initialCount);
        setComment("");
        setData(
          extras
            ?.map((e, index) => ({
              [index]:
                e.type === "select"
                  ? { price: e.options[0].price, options: [e.options[0].text] }
                  : { price: 0, options: [] },
            }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        );
      };
      function handleIncrease() {
        setCount((old) => old + 1);
      }
      function handleDecrease() {
        setCount((old) => old - 1 || 1);
      }
      function handleChange(state, index) {
        setData((old) => ({ ...old, [index]: state }));
      }
      function handleAddToCart() {
        clearState();
        const calculatedExtras = Object.values(data).filter(
          (e) => e.options?.length !== 0
        );
        addToCart(id, name, count, price, calculatedExtras, comment, menuId);
        onClose();
      }
      function handleClose() {
        clearState();
        onClose();
      }
      return (
        <Modal show={show} onHide={handleClose} centered className="item-modal">
          {photoURL && (
            <div>
              <Image
                src={photoURL}
                alt="alt-img"
                width="460px"
                height="350px"
              />
            </div>
          )}
          <Modal.Header
            closeButton={false}
            className="p-0 border-bottom border-gray-100"
          >
            <Button
              variant="white"
              style={{ height: "27px", width: "27px" }}
              className={`close-modal-btn rounded-circle p-0
              `}
              onClick={handleClose}
            >
              <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
            </Button>
            <div className="p-3 w-100">
              <div className="font-big fw-bolder">{name}</div>
              {description && <div className="font-small">{description}</div>}
              <div className="mt-2 text-primary fw-bolder">
                {formatPrice(price)}
              </div>
            </div>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Form.Group className="d-flex flex-column">
              {extras?.map((e, index) => (
                <div key={e.title} className="pb-3">
                  <Form.Label className="font-small fw-bolder m-0">
                    {e.title}
                  </Form.Label>
                  <FormComponent
                    key={e.title}
                    {...e}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
              ))}
              <FormTextarea text={comment || ""} onChange={setComment} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="justify-content-around">
            <Accumulator
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              count={count}
            />
            <Button
              className="m-0 header-text flex-fill ms-2 justify-content-between d-flex"
              variant="primary"
              onClick={handleAddToCart}
            >
              <span>Zum Warenkorb</span>
              <span>{formattedPrice}</span>
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
  },
  isEqual
);

export function FormTextarea({ text, onChange }) {
  const length = `${text.length}/160`;

  const handleChange = (e) => onChange(e.target.value);
  return (
    <>
      <Form.Label className="font-small fw-bolder">
        Anmerkung hinzufügen
      </Form.Label>
      <Form.Control
        className="font-small"
        onChange={handleChange}
        as="textarea"
        rows={3}
        resize={false}
        maxLength={160}
        value={text}
      />
      <div className="m-auto mt-1 me-2 font-small">{length}</div>
    </>
  );
}
function FormSelect({ options, onChange }) {
  function getText({ text, price }) {
    const formattedPrice = formatPrice(price);
    return price ? text + " (+" + formattedPrice + ")" : text;
  }
  function handleChange(e) {
    const obj = JSON.parse(e.target.value);
    onChange(obj.price, obj.text);
  }
  return (
    <>
      <div className="px-2 pt-1">
        <Form.Select className="border-0" onChange={handleChange}>
          {options?.map((o) => (
            <option key={o.text} value={JSON.stringify(o)}>
              {getText(o)}
            </option>
          ))}
        </Form.Select>
      </div>
    </>
  );
}

function FormRadio({ options, onChange }) {
  const [clicked, setClicked] = useState();
  function handleClick(e, o) {
    onChange(o.price, o.text, e.target.checked);
    setClicked(o.text);
  }
  return (
    <>
      <div className="px-2 d-flex flex-wrap w-100">
        {options?.map((o) => (
          <div className="w-100 font-small checkbox-wrapper" key={o.text}>
            <Form.Check className="fw-light w-100" type="checkbox" onC>
              <div className="pt-2 d-flex flex-nowrap align-items-center">
                <Form.Check.Input
                  type="radio"
                  onClick={(e) => handleClick(e, o)}
                  checked={clicked === o.text}
                />
                <Form.Check.Label className="ps-3 fw-normal d-flex justify-content-between flex-fill">
                  <span className="fw-bold">{o.text}</span>
                  {o.price && <span>+{formatPrice(o.price)}</span>}
                </Form.Check.Label>
              </div>
            </Form.Check>
          </div>
        ))}
      </div>
    </>
  );
}

function FormMultiCheckbox({ options, onChange }) {
  function handleClick(e, o) {
    onChange(o.price, o.text, e.target.checked);
  }
  return (
    <>
      <div className="px-2 d-flex flex-wrap w-100">
        {options?.map((o) => (
          <div className="w-100 font-small checkbox-wrapper" key={o.text}>
            <Form.Check className="fw-light w-100" type="checkbox" onC>
              <div className="pt-2 d-flex flex-nowrap align-items-center">
                <Form.Check.Input onClick={(e) => handleClick(e, o)} />
                <Form.Check.Label className="ps-3 fw-normal d-flex justify-content-between flex-fill">
                  <span className="fw-bold">{o.text}</span>
                  {o.price && <span>+{formatPrice(o.price)}</span>}
                </Form.Check.Label>
              </div>
            </Form.Check>
          </div>
        ))}
      </div>
    </>
  );
}

function FormComponent({ type, onChange, title, ...rest }) {
  const [_, setState] = useState({ price: 0, options: [] });
  function handleSelectChange(price, option) {
    const obj = { price, title, options: [{ text: option, price }] };
    setState(obj);
    onChange && onChange(obj);
  }
  function handleMultiCheckbox(price, text, checked) {
    checked
      ? setState((old) => {
          const newState = {
            price: old.price + price,
            options: [...old.options, { text, price }],
            title,
          };
          onChange && onChange(newState);
          return newState;
        })
      : setState((old) => {
          const newState = {
            price: old.price - price,
            options: old.options.filter((o) => o.text !== text),
            title,
          };
          onChange && onChange(newState);
          return newState;
        });
  }

  switch (type) {
    case "selection":
      return <FormRadio {...rest} onChange={handleSelectChange} />;
    case "multi-checkbox":
      return <FormMultiCheckbox {...rest} onChange={handleMultiCheckbox} />;
    default:
      return <></>;
  }
}
export default Item;
