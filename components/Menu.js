import { debounce, isEqual } from "lodash";
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
import Header from "./Header";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
// import { menu } from "../data/menu";
import {
  itemAddedCart,
  selectAllCategories,
  selectAllMealsByCategory,
} from "../reducer/redux2";
import { formatPrice, useIntersection } from "../utilities/utils";
import Cart from "./Cart";
import Item from "./Item";

export default function Menu({}) {
  const itemsRef = useRef([]);
  const ref = useRef();

  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const menu = useSelector(selectAllMealsByCategory);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, categories.length);
  }, [categories]);

  const addToCart = useCallback(
    (id, title, count, price, extras, comment) => {
      dispatch(itemAddedCart({ id, title, count, price, extras, comment }));
    },
    [dispatch]
  );
  const handleCategoryClick = useCallback(
    (id) => {
      itemsRef.current[id].scrollIntoView({
        behavior: "smooth",
        top: itemsRef.current[id].offsetTop - 70,
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
      console.log(viewHeight);
      const viewable = !(
        rect.bottom - viewHeight / 2 < 0 ||
        rect.top + viewHeight / 2 - viewHeight >= 0
      );
      if (viewable) {
        document
          .querySelector(".categories-navbar #" + sectionId)
          .classList.add("fw-bolder");
      } else {
        document
          .querySelector(".categories-navbar #" + sectionId)
          .classList.remove("fw-bolder");
      }
    });
  }, []);
  const debouncedCallback = useMemo(
    () => debounce(handleScroll, 20),
    [handleScroll]
  );
  return (
    <div className="h-100 overflow-auto" ref={ref} onScroll={debouncedCallback}>
      <Header />
      <div
        className="p-4 d-flex bg-octonary"
        // style={{ height: "calc(100% - 300px)" }}
      >
        <div className="h-100 m-auto flex-column bg-orange mb-2 flex-fill">
          <div className="d-flex flex-nowrap justify-content-center">
            <CategoriesNavbar
              categories={categories}
              onClick={handleCategoryClick}
            />
            <div
              className="d-flex flex-column flex-fill"
              style={{ maxWidth: "780px" }}
            >
              <div className="flex-fill">
                {menu &&
                  Object.keys(menu)?.map((i, index) => (
                    <SubCategory
                      key={i}
                      items={menu[i]}
                      addToCart={addToCart}
                      ref={(el) => (itemsRef.current[index] = el)}
                    />
                  ))}
              </div>
            </div>
            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
}
const CategoriesNavbar = memo(({ categories, onClick }) => {
  return (
    <div className="d-flex flex-nowrap flex-column categories-navbar">
      <div className="p-0 py-2">
        {categories?.map(({ id, text }, index) => (
          <div
            key={id}
            className="py-1 category"
            onClick={() => onClick(index)}
          >
            <div className="px-4 text-dark category-text" id={id}>
              {text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}, isEqual);

CategoriesNavbar.displayName = "CategoriesNavbar";
const SubCategory = forwardRef(({ items, onClick, ...rest }, ref) => {
  return (
    <div className="pb-4 category-wrapper" ref={ref} id={items.id}>
      <div className=" font-big pb-2 fw-bolder">{items?.text}</div>
      <div className="bg-white rounded meal-list">
        {items?.data.map((i) => (
          <ItemModal key={i.id} {...i} {...rest} />
        ))}
      </div>
    </div>
  );
});

SubCategory.displayName = "SubCategory";

function ItemModal(props) {
  const { name, description, photoURL, price } = props;
  const formattedPrice = formatPrice(price);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <div className="item-modal-toggle meal-item border-bottom">
        <div className="w-100 border-0 rounded-0 p-0" onClick={handleShow}>
          <div className=" d-flex flex-nowrap justify-content-between p-3">
            <div className="text-left flex-fill">
              <div className="fw-bolder text-gray-900 meal-title">{name}</div>
              {description && (
                <p className="m-0 font-small fw-normal text-gray-800 meal-description">
                  {description}
                </p>
              )}
              <div className="font-bolder text-gray-900 py-2 meal-price">
                {formattedPrice} €
              </div>
            </div>
            {photoURL && (
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

      <Item {...props} show={show} onClose={handleClose} onShow={handleShow} />
    </>
  );
}
