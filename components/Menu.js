import {
  faArrowUp,
  faBurger,
  faCheck,
  faChevronDown,
  faChevronUp,
  faEdit,
  faFile,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce, indexOf, isEqual } from "lodash";
import Image from "next/image";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import styledComponents from "styled-components";
import { useAuth } from "../contexts/AuthContext";
// import { menu } from "../data/menu";
import {
  itemAddedCart,
  selectAllActiveCategories,
  selectAllMealsByCategory,
} from "../reducer/redux2";
import { formatPrice } from "../utilities/utils.mjs";
import Basket from "./basket/Basket";
import Header from "./Header";
import Item, { EditableItem } from "./Item";
import useApi from "../hooks/useAPI";

export default function Menu(props) {
  const itemsRef = useRef([]);
  const ref = useRef();
  const dispatch = useDispatch();
  const { currentUser, currentRole } = useAuth();
  const isAdmin = currentRole.includes("admin");
  const [activeCategory, setActiveCategory] = useState();
  const categories = useSelector(selectAllActiveCategories);
  const menu = useSelector(selectAllMealsByCategory);
  const { fetchUserTodaysOrders } = useApi();
  const usedUIDs = useMemo(
    () =>
      Object.keys(menu).reduce(
        (a, b) => [...a, ...menu[b].data.map((i) => i.uid)],
        []
      ),
    [menu]
  );

  useEffect(() => {
    dispatch(fetchUserTodaysOrders());
  }, [fetchUserTodaysOrders, dispatch, currentUser]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, categories.length);
  }, [categories]);

  const addToCart = useCallback(
    (id, title, count, price, extras, comment, menuId) => {
      dispatch(
        itemAddedCart({ id, title, count, price, extras, comment, menuId })
      );
    },
    [dispatch]
  );
  const handleCategoryClick = useCallback(
    (id) => {
      itemsRef.current[id].scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    [itemsRef]
  );

  const handleScroll = useCallback(() => {
    itemsRef.current.forEach((current) => {
      const sectionId = current.getAttribute("id");
      var rect = current.getBoundingClientRect();
      var viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
      );
      const viewable = !(
        rect.bottom - viewHeight / 2 < 0 ||
        rect.top + viewHeight / 2 - viewHeight >= 0
      );
      if (viewable && activeCategory !== sectionId) {
        setActiveCategory((oldId) => {
          document
            .querySelector(".categories-navbar #" + oldId)
            ?.classList.remove("active");
          document
            .querySelector(".categories-navbar #" + sectionId)
            ?.classList.add("active");
          return sectionId;
        });
      }
    });
  }, [activeCategory]);
  const debouncedCallback = useMemo(
    () => debounce(handleScroll, 20),
    [handleScroll]
  );
  useEffect(() => {
    const ref = itemsRef.current[0];
    const sectionId = ref?.getAttribute("id");
    setActiveCategory(sectionId);
    document
      .querySelector(".categories-navbar #" + sectionId)
      ?.classList.add("active");
  }, []);
  return (
    <div className="h-100 overflow-auto" ref={ref} onScroll={debouncedCallback}>
      <Header />
      <div className="menu-banner">Speisekarte</div>
      <div className="d-flex bg-octonary">
        <div className="h-100 w-100 m-auto flex-column">
          <div className="menu-wrapper">
            {isAdmin ? (
              <EditableCategoriesNavbar
                categories={categories}
                onClick={handleCategoryClick}
              />
            ) : (
              <CategoriesNavbar
                categories={categories}
                onClick={handleCategoryClick}
              />
            )}
            <div className="menu">
              <div className="flex-fill">
                {menu &&
                  Object.keys(menu)?.map((i, index) => (
                    <SubCategory
                      key={i}
                      items={menu[i]}
                      isAdmin={isAdmin}
                      addToCart={addToCart}
                      categories={categories}
                      ref={(el) => (itemsRef.current[index] = el)}
                      usedUIDs={usedUIDs}
                    />
                  ))}
              </div>
            </div>
            <Basket />
          </div>
        </div>
      </div>
    </div>
  );
}
const CategoriesNavbar = memo(
  ({ categories, onClick, isAdmin = { isAdmin } }) => {
    return (
      <div className="categories-navbar">
        {categories?.map(({ id }, index) => (
          <div key={id} className="category">
            <Button
              variant="transparent"
              className="category-text"
              id={id}
              onClick={() => onClick(index)}
            >
              {id}
            </Button>
          </div>
        ))}
      </div>
    );
  },
  isEqual
);
const EditableCategoriesNavbar = memo(
  ({ categories: initialCategories, onClick }) => {
    const menu = useSelector(selectAllMealsByCategory);
    const { updateAllMeals } = useApi();

    const [changedMenu, setChangedMenu] = useState(
      Object.values(menu)?.reduce((a, b) => [...a, ...b.data], [])
    );
    const [categories, setCategories] = useState(initialCategories);
    const [changedCategories, setChangedCategories] =
      useState(initialCategories);
    const [editMode, setEditMode] = useState(false);
    const [active, setActive] = useState();
    const handleSave = useCallback(() => {
      updateAllMeals(
        changedMenu.map(({ id }) => id),
        changedMenu
      );
    }, [changedMenu, updateAllMeals]);

    const handleCancel = useCallback(() => {
      setChangedCategories(initialCategories);
      setCategories(initialCategories);
      setChangedMenu(menu);
      setActive();
      setEditMode(false);
    }, [initialCategories, menu]);
    const handleAdd = useCallback(() => {
      setChangedCategories((old) => {
        const newCategories = [
          ...old,
          { title: "", text: "", photoURL: "", itemIDs: [], id: "" },
        ];
        setCategories(newCategories);
        return newCategories;
      });
    }, []);
    const handleMove = useCallback(
      (f, t) =>
        setCategories((old) => {
          const from = changedCategories[f];
          const to = changedCategories[t];
          const newCategories = [...changedCategories];
          newCategories[f] = to;
          newCategories[t] = from;

          setChangedMenu((menu) => {
            const oldMenu = handleMenuCategoryChange(
              menu,
              old,
              changedCategories
            );
            const restMenu = oldMenu.filter(
              ({ category }) => category !== from.id && category !== to.id
            );
            const fromMenu = oldMenu
              .filter(({ category }) => category === from.id)
              .map((meal) => ({
                ...meal,
                uid: (meal.uid % 100) + (t + 1) * 100,
              }));
            const toMenu = oldMenu
              .filter(({ category }) => category === to.id)
              .map((meal) => ({
                ...meal,
                uid: (meal.uid % 100) + (f + 1) * 100,
              }));
            const newMenu = [...toMenu, ...fromMenu, ...restMenu];
            return newMenu;
          });
          setChangedCategories(newCategories);
          setActive(t);

          return newCategories;
        }),

      [changedCategories, handleMenuCategoryChange]
    );

    const handleMenuCategoryChange = useCallback((oldMenu, old, newCat) => {
      const newKeys = newCat.map(({ id }) => id);
      const oldKeys = old.map(({ id }) => id);
      const newMenu = newKeys.reduce((a, b) => {
        if (oldKeys.includes(b)) {
          return [...a, ...oldMenu.filter((meal) => meal.category === b)];
        } else {
          const index = newKeys.indexOf(b);
          const oldCategory = oldKeys[index];
          return [
            ...a,
            ...oldMenu
              .filter((meal) => meal.category === oldCategory)
              .map((meal) => ({ ...meal, category: b })),
          ];
        }
      }, []);
      return newMenu;
    }, []);

    const handleActiveChange = useCallback(
      (index) => {
        setActive(index);
        // const c = handleMenuCategoryChange(menu, changedCategories);
        // setCategories((old) => {
        //   changedCategories.map(({ id }, index) => {
        //     if (id !== old[index].id) {
        //       setChangedMenu((oldMenu) => {
        //         return [
        //           ...Object.keys(oldMenu).filter((k) => k !== old[index].id),
        //           id,
        //         ].reduce((a, b) => {
        //           if (b === id) {
        //             const newData = oldMenu[old[index].id].data?.map(
        //               (meal) => ({
        //                 ...meal,
        //                 category: id,
        //               })
        //             );
        //             return {
        //               ...a,
        //               [b]: { ...oldMenu[old[index].id], data: newData },
        //             };
        //           } else {
        //             return { ...a, [b]: oldMenu[b] };
        //           }
        //         }, {});
        //       });
        //       return null;
        //     }
        //   });
        //   return changedCategories;
        // });
      },
      [changedCategories]
    );

    const handleTitleChange = useCallback(
      (index, values) =>
        setChangedCategories((old) => {
          const newCategories = [...old];
          newCategories[index] = {
            ...newCategories[index],
            ...values,
          };
          return newCategories;
        }),
      []
    );

    return (
      <div className="d-flex flex-nowrap">
        <div className="categories-navbar">
          {categories?.map(({ title, id, ...rest }, index) => (
            <div
              key={id}
              className="category d-flex flex-nowrap align-items-center"
            >
              {editMode && active === index && (
                <div className="h-100 my-3 me-2 d-flex align-items-center flex-column justify-content-center">
                  {index === active && (
                    <Button
                      variant="primary"
                      className="p-0 my-2 text-center"
                      disabled={index === 0}
                      onClick={() => handleMove(index, index - 1)}
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "1rem",
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronUp} />
                    </Button>
                  )}
                  <Button
                    variant="light-primary"
                    className="p-0 text-center"
                    style={{
                      height: "30px",
                      width: "30px",
                      borderRadius: "1rem",
                    }}
                  >
                    {index}
                  </Button>
                  {index === active && (
                    <Button
                      variant="primary"
                      className="p-0 my-2 text-center"
                      disabled={index === categories.length - 1}
                      onClick={() => handleMove(index, index + 1)}
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "1rem",
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} />
                    </Button>
                  )}
                </div>
              )}
              {editMode && active === index ? (
                <FormInput
                  title={title}
                  id={id}
                  {...rest}
                  index={index}
                  onChange={handleTitleChange}
                ></FormInput>
              ) : (
                <Button
                  variant={
                    editMode ? "primary header-text my-2" : "transparent"
                  }
                  className="category-text"
                  id={id}
                  onClick={() =>
                    editMode ? handleActiveChange(index) : onClick(index)
                  }
                  style={{ height: "44px", borderRadius: "1rem" }}
                >
                  {title}
                </Button>
              )}
            </div>
          ))}
          {editMode && (
            <>
              <div className="w-100 d-flex justify-content-center pt-3">
                <Button
                  className="p-0 w-100 mx-2"
                  style={{
                    height: "44px",
                    width: "44px",
                    borderRadius: "1rem",
                  }}
                  onClick={handleAdd}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
              <div className="pt-3 d-flex flex-nowrap mx-2">
                <div className="w-100 d-flex justify-content-center pt-2 me-2">
                  <Button
                    className="p-0 w-100"
                    style={{
                      height: "44px",
                      width: "44px",
                      borderRadius: "1rem",
                    }}
                    onClick={handleSave}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </Button>
                </div>
                <div className="w-100 d-flex justify-content-center pt-2 ms-2">
                  <Button
                    className="p-0 w-100"
                    style={{
                      height: "44px",
                      width: "44px",
                      borderRadius: "1rem",
                    }}
                    onClick={handleCancel}
                  >
                    <FontAwesomeIcon icon={faX} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        {!editMode && (
          <div className="d-flex justify-content-end">
            <Button
              className="p-0"
              style={{ height: "44px", width: "44px", borderRadius: "1rem" }}
              onClick={() => setEditMode((old) => !old)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          </div>
        )}
      </div>
    );
  },
  isEqual
);
const FormInput = memo(
  ({
    title: initialTitle,
    index,
    onChange,
    text: initialText,
    id: initialId,
    photoURL: initialPhotoURL,
  }) => {
    const [title, setTitle] = useState(initialTitle);
    const [text, setText] = useState(initialText);
    const [id, setId] = useState(initialId);
    const [photoUrl, setPhotoURL] = useState(initialPhotoURL);

    const debouncedCallback = useMemo(
      () => debounce(onChange, 500),
      [onChange]
    );

    useEffect(() => {
      debouncedCallback(index, { title, text, id, photoUrl });
    }, [title, text, id, photoUrl, index, debouncedCallback]);

    return (
      <div className="d-flex flex-column">
        <div>
          <Form.Label className="font-small fw-bolder m-0">ID</Form.Label>
          <Form.Control
            style={{ height: "44px", borderRadius: "1rem" }}
            value={id}
            disabled
            className="bg-white"
          />
        </div>
        <div>
          <Form.Label className="font-small fw-bolder m-0 mt-3">
            Title
          </Form.Label>
          <Form.Control
            style={{ height: "44px", borderRadius: "1rem" }}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setId(e.target.value.toLowerCase());
            }}
          />
        </div>
        <div>
          <Form.Label className="font-small fw-bolder m-0 mt-3">
            Description
          </Form.Label>
          <Form.Control
            as="textarea"
            className="font-small"
            rows="7"
            style={{ borderRadius: "1rem" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-start flex-nowrap">
          <Form.Label className="font-small fw-bolder m-0 mt-3">
            photoURL
          </Form.Label>
          <OverlayTrigger
            trigger={["hover", "focus"]}
            overlay={
              <Tooltip>
                <a
                  className="px-3 text-light-primary"
                  href={photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {photoUrl}
                </a>
              </Tooltip>
            }
          >
            <Button
              variant={photoUrl ? "primary" : "light-primary"}
              size="sm"
              className="m-2"
            >
              <FontAwesomeIcon icon={faFile} />
            </Button>
          </OverlayTrigger>
        </div>
        <Form.Control type="file" />
      </div>
    );
  },
  isEqual
);
CategoriesNavbar.displayName = "CategoriesNavbar";
const SubCategory = forwardRef(({ items, category, onClick, ...rest }, ref) => {
  return (
    <div className="category-wrapper" ref={ref} id={items.id}>
      <CategoryTitle
        text={items.text}
        photoURL={items.photoURL}
        title={items.title}
      />
      <div className="rounded meal-list">
        {[...items?.data]
          .sort((a, b) => a.uid - b.uid)
          .map((i) => (
            <DetailsItem key={i.id} {...i} {...rest} />
          ))}
      </div>
    </div>
  );
});

SubCategory.displayName = "SubCategory";
function CategoryTitle({ title, text, photoURL }) {
  return (
    <>
      {!photoURL ? (
        <div className="category-title d-flex flex-column align-items-start">
          <h2>{title}</h2>
          <div className="bg-darker-primary text-white w-100 px-4 py-3">
            {text}
          </div>
        </div>
      ) : (
        <div
          className="bg-primary"
          style={{
            width: "100%",
            height: "200px",
            position: "relative",
            textShadow: "1px 1px 20px rgb(34 34 34)",
            boxShadow: "2px 2px 4px 3px rgb(0 0 0 / 13%)",
          }}
        >
          <div
            className="w-100 category-title d-flex justify-content-end align-items-start h-100 bg-transparent flex-column"
            style={{ position: "absolute", zIndex: 10 }}
          >
            <h2>{title}</h2>
            {text && (
              <div className="bg-darker-primary text-white w-100 px-4 py-3">
                {text}
              </div>
            )}
          </div>
          <Image alt="alt" src={photoURL} layout="fill" objectFit="cover" />
        </div>
      )}
    </>
  );
}

const DetailsItem = memo((props) => {
  const {
    name,
    description,
    photoURL,
    price,
    uid,
    withFoto = false,
    isAdmin,
  } = props;

  const formattedPrice = formatPrice(price);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="item-modal-toggle meal-item my-4 bg-gray-100 rounded">
        <div className="w-100 border-0 rounded-0 p-0" onClick={handleShow}>
          <div className=" d-flex flex-nowrap justify-content-between align-items-center p-3">
            <div className="text-left flex-fill pe-4 d-flex flex-column justify-content-around">
              <div className="fw-bolder text-gray-900 meal-title">
                {uid}. {name}
              </div>
              {description && (
                <p className="m-0 font-small fw-normal text-gray-800 meal-description">
                  {description}
                </p>
              )}
              {withFoto && (
                <span className="d-flex font-bolder text-white p-2 meal-price bg-primary rounded">
                  {formattedPrice}
                </span>
              )}
            </div>
            {!withFoto && (
              <div
                className="d-flex justify-content-center align-items-center font-bolder text-white meal-price bg-primary rounded text-center"
                style={{ minWidth: "75px", height: "40px" }}
              >
                <span className="text-center">{formattedPrice}</span>
              </div>
            )}
            {photoURL && withFoto && (
              <div className="d-flex meal-img">
                <div
                  className="mb-auto rounded overflow-hidden"
                  style={{ height: "100px" }}
                >
                  <Image src={photoURL} alt="error" width={150} height={100} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAdmin ? (
        <EditableItem
          {...props}
          show={show}
          onClose={handleClose}
          onShow={handleShow}
        />
      ) : (
        <Item
          {...props}
          show={show}
          onClose={handleClose}
          onShow={handleShow}
        />
      )}
    </>
  );
}, isEqual);
