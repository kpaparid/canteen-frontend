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
      const calculatedExtras =
        data &&
        Object.keys(data).reduce((a, b) => [...a, ...data[b].options], []);
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
        addToCart(id, name, count, price, calculatedExtras, comment);
        onClose();
      }
      function handleClose() {
        clearState();
        onClose();
      }
      return (
        <Modal
          show={show}
          onHide={handleClose}
          centered
          className="item-modal"
          fullscreen="md-down"
          // dialogClassName="p-0"
        >
          <div
            className="modal-wrapper"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            {photoURL && (
              <div
              //  style={{ height: "400px" }}
              >
                <Image
                  src={photoURL}
                  alt="alt-img"
                  width="460px"
                  height="350px"
                />
              </div>
            )}
            <Modal.Header closeButton={false} className="p-0">
              <div className="p-3 w-100">
                <div className="font-medium fw-bolder">{name}</div>
                {description && (
                  <div className="font-small text-septenary">{description}</div>
                )}
                <div className="mt-2 font-medium fw-bolder">
                  {formatPrice(price)} €
                </div>
              </div>
            </Modal.Header>
            <Modal.Body className="bg-octonary">
              <Form.Group className="d-flex flex-column">
                {extras?.map((e, index) => (
                  <Fragment key={e.title}>
                    <Form.Label className="pt-1 text-dark font-small fw-bold">
                      {e.title}
                    </Form.Label>
                    <FormComponent
                      key={e.title}
                      {...e}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </Fragment>
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
                className="m-0 header-text"
                variant="primary"
                onClick={handleAddToCart}
              >
                {formattedPrice} €
              </Button>
            </Modal.Footer>
          </div>
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
      <Form.Label className="pt-3 text-dark font-small fw-bold">
        Anmerkung hinzufügen
      </Form.Label>
      <div className="px-2">
        <Form.Control
          className="border-0 font-small"
          onChange={handleChange}
          as="textarea"
          rows={3}
          resize={false}
          maxLength={160}
          value={text}
        />
      </div>
      <div className="m-auto mt-1 me-2 font-small">{length}</div>
    </>
  );
}
function FormSelect({ options, onChange }) {
  function getText({ text, price }) {
    const formattedPrice = formatPrice(price);
    return price ? text + " (+" + formattedPrice + " €)" : text;
  }
  function handleChange(e) {
    const obj = JSON.parse(e.target.value);
    onChange(obj.price, obj.text);
  }
  return (
    <>
      <div className="px-2">
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
function FormMultiCheckbox({ options, onChange }) {
  function getText({ text, price }) {
    const formattedPrice = price?.toLocaleString("de-DE", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    return price ? text + " (+" + formattedPrice + " €)" : text;
  }
  function handleClick(e, o) {
    onChange(o.price, o.text, e.target.checked);
  }
  return (
    <>
      <div className="px-2 d-flex flex-wrap w-100">
        {options?.map((o) => (
          <div className="w-100 font-small checkbox-wrapper mb-2" key={o.text}>
            <Form.Check className="fw-light w-100" type="checkbox" onC>
              <div className="p-2 bg-white d-flex flex-nowrap align-items-center">
                <Form.Check.Input onClick={(e) => handleClick(e, o)} />
                <Form.Check.Label className="ps-2 fw-normal text-dark">
                  {getText(o)}
                </Form.Check.Label>
              </div>
            </Form.Check>
          </div>
        ))}
      </div>
    </>
  );
}

function FormComponent({ type, onChange, ...rest }) {
  const [_, setState] = useState({ price: 0, options: [] });
  function handleSelectChange(price, option) {
    const obj = { price, options: [{ text: option, price }] };
    setState(obj);
    onChange && onChange(obj);
  }
  function handleMultiCheckbox(price, text, checked) {
    checked
      ? setState((old) => {
          const newState = {
            price: old.price + price,
            options: [...old.options, { text, price }],
          };
          onChange && onChange(newState);
          return newState;
        })
      : setState((old) => {
          const newState = {
            price: old.price - price,
            options: old.options.filter((o) => o.text !== text),
          };
          onChange && onChange(newState);
          return newState;
        });
  }

  switch (type) {
    case "selection":
      return <FormSelect {...rest} onChange={handleSelectChange} />;
    case "multi-checkbox":
      return <FormMultiCheckbox {...rest} onChange={handleMultiCheckbox} />;
    default:
      return <></>;
  }
}
export default Item;
