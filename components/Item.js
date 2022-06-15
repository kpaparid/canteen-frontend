import {
  faCartArrowDown,
  faCartPlus,
  faEdit,
  faPlus,
  faX,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce } from "lodash";
import isEqual from "lodash/isEqual";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Overlay, ToastBody, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap/Button";
// import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { useAuth } from "../contexts/AuthContext.js";
import useAPI from "../hooks/useAPI.js";
import { selectShopIsOpen } from "../reducer/redux2.js";
import { formatPrice } from "../utilities/utils.mjs";
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
      const target = useRef(null);
      const [showTooltip, setShowTooltip] = useState(false);
      const shopEnabled = useSelector(selectShopIsOpen);
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
        if (shopEnabled) {
          clearState();
          const calculatedExtras = Object.values(data).filter(
            (e) => e.options?.length !== 0
          );
          addToCart(id, name, count, price, calculatedExtras, comment, menuId);
          onClose();
        } else {
          setShowTooltip((old) => !old);
        }
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
              <span className="fw-bolder">{menuId}. </span>
              <span className="fw-bolder">{name}</span>
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
              variant={"primary"}
              onClick={handleAddToCart}
              onBlur={() => setShowTooltip(false)}
              ref={target}
            >
              <>
                <div className="d-block d-sm-none">Hinzufügen</div>
                <div className="d-none d-sm-block d-flex align-items-center">
                  Zum Warenkorb
                </div>
                <span>{formattedPrice}</span>
              </>
            </Button>
            <Overlay target={target.current} show={showTooltip} placement="top">
              {(props) => (
                <Tooltip {...props} className="text-break text-wrap">
                  Zurzeit sind wir geschlossen.
                </Tooltip>
              )}
            </Overlay>
          </Modal.Footer>
        </Modal>
      );
    }
  },
  isEqual
);
export const EditableItem = memo(
  ({
    id,
    photoURL: initialPhotoURL,
    name: initialName,
    description: initialDescription,
    price: initialPrice = 0,
    extras: initialExtras,
    uid: initialMenuId,
    category: initialCategory,
    count: initialCount = 1,
    addToCart,
    show,
    categories,
    onClose,
    usedUIDs = [],
    ...rest
  }) => {
    const { updateMeals } = useAPI();
    const [photoURL, setPhotoURL] = useState(initialPhotoURL);
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [price, setPrice] = useState(initialPrice);
    const [menuId, setMenuId] = useState(initialMenuId);
    const [extras, setExtras] = useState(initialExtras);
    const [category, setCategory] = useState(initialCategory);
    const menuIdOptions = Array.from(Array(100).keys())
      .map((n) => n + (categories.map((c) => c.id).indexOf(category) + 1) * 100)
      .filter((n) => !usedUIDs.includes(n));

    const target = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const shopEnabled = useSelector(selectShopIsOpen);
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
    const formattedPrice = formatPrice(calculatedPrice * count);
    const clearState = () => {
      setPhotoURL(initialPhotoURL);
      setName(initialName);
      setDescription(initialDescription);
      setPrice(initialPrice);
      setMenuId(initialMenuId);
      setExtras(initialExtras);
      setCategory(initialCategory);
      setEditMode(false);

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
      if (shopEnabled) {
        clearState();
        const calculatedExtras = Object.values(data).filter(
          (e) => e.options?.length !== 0
        );
        addToCart(id, name, count, price, calculatedExtras, comment, menuId);
        onClose();
      } else {
        setShowTooltip((old) => !old);
      }
    }
    function handleClose() {
      clearState();
      onClose();
    }
    const handleExtraDelete = useCallback(
      (index) => setExtras((old) => [...old].filter((e, i) => i !== index)),
      []
    );
    const handleAddExtra = useCallback(
      () =>
        setExtras((old) => [
          ...old,
          {
            title: "",
            type: "multi-checkbox",
            options: [
              { price: 0, text: "" },
              { price: 0, text: "" },
            ],
          },
        ]),
      []
    );
    const handleAddOption = useCallback(
      (index) =>
        setExtras((old) => {
          var newExtras = [...old];
          var newOptions = [
            ...newExtras[index].options,
            { price: 0, text: "" },
          ];
          newExtras[index] = {
            ...newExtras[index],
            options: newOptions,
          };
          return newExtras;
        }),
      []
    );
    const handleSave = useCallback(() => {
      const body = {
        extras,
        name,
        description,
        price,
        uid: menuId,
        photoURL,
        category,
        id,
      };
      updateMeals(id, body);
    }, [
      extras,
      name,
      description,
      price,
      id,
      photoURL,
      category,
      menuId,
      updateMeals,
    ]);

    return (
      <Modal show={show} onHide={handleClose} centered className="item-modal">
        {photoURL && (
          <div>
            <Image src={photoURL} alt="alt-img" width="460px" height="350px" />
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
            <div className="w-100 d-flex justify-content-between">
              {editMode ? (
                <>
                  <div className="d-flex flex-column justify-content-end">
                    <Form.Label className="font-small fw-bolder m-0 mt-2">
                      Category
                    </Form.Label>
                    <Form.Select
                      className="px-5"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option defaultValue key={c.id}>
                          {c.id}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-end mb-3">
                    <Button
                      style={{ height: "fit-content" }}
                      onClick={() => {
                        clearState();
                        setEditMode(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </div>
                </>
              )}
            </div>
            {editMode && (
              <>
                <Form.Label className="font-small fw-bolder m-0 mt-2">
                  Photo
                </Form.Label>
                <Form.Control className="font-small" type="file" />
              </>
            )}
            {editMode ? (
              <div className="d-flex flex-nowrap">
                <div style={{ width: " 70px" }}>
                  <Form.Label
                    className="font-small fw-bolder m-0 mt-2"
                    type="number"
                  >
                    ID
                  </Form.Label>
                  <Form.Select onChange={(e) => setMenuId(e.target.value)}>
                    {menuIdOptions.map((o) => (
                      <option key={"menu-id-option-" + o}>{o}</option>
                    ))}
                  </Form.Select>
                </div>

                <div className="flex-fill ps-3">
                  <Form.Label className="font-small fw-bolder m-0 mt-2">
                    Title
                  </Form.Label>
                  <Form.Control
                    className="font-small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <>
                <span className="fw-bolder">{menuId}. </span>
                <span className="fw-bolder">{name}</span>
              </>
            )}
            {editMode ? (
              <>
                <Form.Label className="font-small fw-bolder m-0 mt-2">
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className="font-small"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </>
            ) : (
              description && <div className="font-small">{description}</div>
            )}

            {editMode ? (
              <>
                <Form.Label className="font-small fw-bolder m-0 mt-2">
                  Price
                </Form.Label>
                <Form.Control
                  className="font-small"
                  type="text"
                  value={price || 0}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </>
            ) : (
              <div className="mt-2 text-primary fw-bolder">
                {formatPrice(price)}
              </div>
            )}
          </div>
        </Modal.Header>
        <Modal.Body className="bg-white">
          <div className="d-flex flex-column">
            {extras?.map((e, index) => (
              <div key={e.title} className="pb-3">
                {editMode ? (
                  <>
                    <div className="w-100 d-flex flex-nowrap justify-content-between align-items-end pb-2">
                      <Form.Label className="font-small fw-bolder m-0">
                        Extra {index}
                      </Form.Label>
                      <div style={{ height: "25px", width: "25px" }}>
                        <Button
                          className="h-100 w-100 p-0 rounded-circle"
                          onClick={() => handleExtraDelete(index)}
                        >
                          <FontAwesomeIcon size="xs" icon={faX} />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-light-primary p-3">
                      <ExtrasTitle
                        index={index}
                        title={e.title}
                        onChange={setExtras}
                      />
                      <ExtrasType
                        index={index}
                        type={e.type}
                        onChange={setExtras}
                      />
                      <div>
                        {e.options.map(({ price, text }, optionsIndex) => (
                          <Option
                            key={"option" + optionsIndex}
                            index={index}
                            optionsIndex={optionsIndex}
                            text={text}
                            price={price}
                            onChange={setExtras}
                          />
                        ))}
                        <div className="w-100 d-flex justify-content-start">
                          <Button
                            variant="primary rounded-circle"
                            className="p-0 mt-3"
                            style={{ height: "30px", width: "30px" }}
                            onClick={() => handleAddOption(index)}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="w-100 d-flex justify-content-center">
                      <Button
                        variant="primary"
                        className="rounded-circle p-0 mt-3"
                        style={{ height: "30px", width: "30px" }}
                        onClick={handleAddExtra}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Form.Label className="font-small fw-bolder m-0">
                      {e.title}
                    </Form.Label>
                    <FormComponent
                      key={e.title}
                      {...e}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </>
                )}
              </div>
            ))}
            {!editMode && (
              <FormTextarea text={comment || ""} onChange={setComment} />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-around">
          {editMode ? (
            <div className="w-100 d-flex align-items-end mt-5 justify-content-around">
              <Button className="header-text" onClick={handleSave}>
                Save
              </Button>
              <Button
                className="header-text"
                style={{ height: "fit-content" }}
                onClick={() => {
                  setEditMode(false);
                  clearState();
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <Accumulator
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                count={count}
              />
              <Button
                className="m-0 header-text flex-fill ms-2 justify-content-between d-flex"
                variant={"primary"}
                onClick={handleAddToCart}
                onBlur={() => setShowTooltip(false)}
                ref={target}
              >
                <>
                  <div className="d-block d-sm-none">Hinzufügen</div>
                  <div className="d-none d-sm-block d-flex align-items-center">
                    Zum Warenkorb
                  </div>
                  <span>{formattedPrice}</span>
                </>
              </Button>
              <Overlay
                target={target.current}
                show={showTooltip}
                placement="top"
              >
                {(props) => (
                  <Tooltip {...props} className="text-break text-wrap">
                    Zurzeit sind wir geschlossen.
                  </Tooltip>
                )}
              </Overlay>
            </>
          )}
        </Modal.Footer>
      </Modal>
    );
  },
  isEqual
);
const Option = memo(
  ({
    index,
    optionsIndex,
    text: initialText,
    price: initialPrice,
    onChange,
  }) => {
    const [text, setText] = useState(initialText);
    const [price, setPrice] = useState(initialPrice);
    const handleChange = useCallback(
      (text, price) => {
        onChange((old) => {
          var newExtras = [...old];
          var newOptions = [...newExtras[index].options];
          newOptions[optionsIndex] = {
            text,
            price,
          };
          newExtras[index] = {
            ...newExtras[index],
            options: newOptions,
          };
          return newExtras;
        });
      },
      [index, optionsIndex, onChange]
    );
    const handleClick = useCallback(
      () =>
        onChange((old) => {
          var newExtras = [...old];
          var newOptions = [...newExtras[index].options].filter(
            (e, i) => i !== optionsIndex
          );
          newExtras[index] = {
            ...newExtras[index],
            options: newOptions,
          };
          return newExtras;
        }),
      [onChange, optionsIndex, index]
    );
    const debouncedCallback = useMemo(
      () => debounce(handleChange, 500),
      [handleChange]
    );

    useEffect(() => {
      debouncedCallback(text, price);
    }, [price, text, debouncedCallback]);
    const handleText = useCallback((e) => setText(e.target.value), []);
    const handlePrice = useCallback((e) => setPrice(e.target.value), []);
    return (
      <div className="d-flex flex-nowrap align-items-center">
        <div className="flex-fill">
          <Form.Label className="font-small fw-bolder m-0">
            Option {optionsIndex}
          </Form.Label>
          <Form.Control
            className="font-small mb-3"
            type="text"
            value={text || ""}
            onChange={handleText}
          />
        </div>
        <div className="ps-3" style={{ width: "100px" }}>
          <Form.Label className="font-small fw-bolder m-0">
            Price {optionsIndex}
          </Form.Label>
          <Form.Control
            className="font-small mb-3 text-center"
            type="number"
            value={price || 0}
            onChange={handlePrice}
          />
        </div>
        <div className="ps-2 ">
          <Button
            className=" mt-2 p-0 d-flex align-items-center justify-content-center rounded-circle"
            style={{ height: "25px", width: "25px" }}
            onClick={handleClick}
          >
            <FontAwesomeIcon size="xs" icon={faX} />
          </Button>
        </div>
      </div>
    );
  },
  isEqual
);
const ExtrasTitle = memo(({ index, title: initialTitle, onChange }) => {
  const [title, setTitle] = useState(initialTitle);
  const handleChange = useCallback(
    (title) => {
      onChange((old) => {
        var newExtras = [...old];
        newExtras[index] = {
          ...newExtras[index],
          title,
        };
        return newExtras;
      });
    },
    [index, onChange]
  );

  const debouncedCallback = useMemo(
    () => debounce(handleChange, 500),
    [handleChange]
  );

  useEffect(() => {
    debouncedCallback(title);
  }, [title, debouncedCallback]);
  const handleTitle = useCallback((e) => setTitle(e.target.value), []);
  return (
    <>
      <Form.Label className="font-small fw-bolder m-0">Title</Form.Label>
      <Form.Control
        className="font-small mb-3"
        type="text"
        defaultValue={title}
        onChange={handleTitle}
      />
    </>
  );
}, isEqual);
const ExtrasType = memo(({ index, type: initialType, onChange }) => {
  const [type, setType] = useState(initialType);
  const handleChange = useCallback(
    (type) => {
      onChange((old) => {
        var newExtras = [...old];
        newExtras[index] = {
          ...newExtras[index],
          type,
        };
        return newExtras;
      });
    },
    [index, onChange]
  );

  const debouncedCallback = useMemo(
    () => debounce(handleChange, 500),
    [handleChange]
  );

  useEffect(() => {
    debouncedCallback(type);
  }, [type, debouncedCallback]);
  const handleType = useCallback((e) => setType(e.target.value), []);
  return (
    <div className="mb-2">
      <Form.Label className="font-small fw-bolder">Type</Form.Label>
      <Form.Select onChange={handleType}>
        <option defaultValue={initialType === "multi-checkbox"}>
          multi-checkbox
        </option>
        <option defaultValue={initialType === "selection"}>selection</option>
      </Form.Select>
    </div>
  );
}, isEqual);
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
        resize="false"
        maxLength={160}
        value={text}
      />
      <div className="m-auto mt-1 me-2 font-small">{length}</div>
    </>
  );
}

function FormRadio({ options, onChange }) {
  const [clicked, setClicked] = useState();
  function handleClick(e, o) {
    onChange(o.price || 0, o.text, e.target.checked);
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
  function handleSelectChange(initialPrice, option) {
    const price = initialPrice === null ? 0 : initialPrice;
    const obj = { price, title, options: [{ text: option, price: price }] };
    setState(obj);
    onChange && onChange(obj);
  }
  function handleMultiCheckbox(initialPrice, text, checked) {
    const price = initialPrice === null ? 0 : initialPrice;
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
