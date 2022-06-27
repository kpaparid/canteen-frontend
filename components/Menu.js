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
  fetchCategories,
  fetchMeals,
  fetchSettings,
  itemAddedCart,
  selectAllActiveCategories,
  selectAllMealsByCategory,
} from "../reducer/redux2";
import { formatPrice } from "../utilities/utils.mjs";
import Basket from "./basket/Basket";
import Header from "./Header";
import Item, { EditableItem } from "./Item";
import useApi from "../hooks/useAPI";
import { CategoriesNavbar, EditableCategoriesNavbar } from "./CategoriesNavBar";

export default function Menu(props) {
  const itemsRef = useRef([]);
  const ref = useRef();
  const dispatch = useDispatch();
  const { currentUser, currentRole } = useAuth();
  const isAdmin = currentRole?.includes("admin");
  const [activeCategory, setActiveCategory] = useState();
  const categories = useSelector(selectAllActiveCategories);
  const menu = useSelector(selectAllMealsByCategory);
  const { fetchUserTodaysOrders } = useApi();
  const usedUIDs = useMemo(
    () =>
      Object.keys(menu).reduce(
        (a, b) => [...a, ...menu[b].data.filter((i) => i).map((i) => i.uid)],
        []
      ),
    [menu]
  );

  useEffect(() => {
    dispatch(fetchUserTodaysOrders());
  }, [fetchUserTodaysOrders, dispatch, currentUser]);

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
      if (current) {
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
      }
    });
  }, [activeCategory]);
  const debouncedCallback = useMemo(
    () => debounce(handleScroll, 10),
    [handleScroll]
  );
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, categories.length);
    const ref = itemsRef.current[0];
    const sectionId = ref?.getAttribute("id");
    setActiveCategory(sectionId);
    document
      .querySelector(".categories-navbar #" + sectionId)
      ?.classList.add("active");
  }, [categories]);
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
                {isAdmin && <AddItem categories={categories} />}
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
const AddItem = memo(({ categories }) => {
  const dispatch = useDispatch();
  const { postMeal } = useApi();

  const handleAddNewItem = useCallback(() => {
    const body = {
      name: "New Item",
      category: categories[0].id,
      uid: 0,
      price: 0,
    };
    postMeal(body).then((r) => {
      dispatch(fetchMeals()).then(({ payload }) =>
        dispatch(fetchCategories(payload))
      );
    });
  }, [categories, postMeal, dispatch]);
  return (
    <div className="w-100 d-flex justify-content-center align-content-center my-2">
      <Button
        onClick={handleAddNewItem}
        style={{
          borderRadius: "1rem",
          width: "30px",
          height: "30px",
          padding: 0,
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
    </div>
  );
}, isEqual);
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
            maxWidth: "100%",
            width: "100%",
            minHeight: "200px",
            aspectRatio: 3,
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
