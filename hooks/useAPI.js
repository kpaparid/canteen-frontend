import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import {
  clearOrders,
  fetchCategoriesThunk,
  fetchMealsThunk,
  fetchOrdersThunk,
  fetchSettingsThunk,
  postOrders,
  postShopIsOpenThunk,
  updateOrderStatusThunk,
} from "../reducer/redux2";
import { customFetch } from "../utilities/utils.mjs";

const useAPI = () => {
  const { authenticatedFetch, currentUser, claims } = useAuth();
  const dispatch = useDispatch();
  const fetchMeals = useCallback(() => dispatch(fetchMealsThunk()), [dispatch]);
  const fetchMeal = useCallback(
    (itemId) => customFetch(process.env.BACKEND_URI + "meals?id=" + itemId),
    []
  );
  const fetchSettings = useCallback(
    () => dispatch(fetchSettingsThunk()),
    [dispatch]
  );
  const fetchCategories = useCallback(
    (payload) => dispatch(fetchCategoriesThunk(payload)),
    [dispatch]
  );
  const postShopIsOpen = useCallback(
    (value) =>
      dispatch(postShopIsOpenThunk({ value, fetch: authenticatedFetch })),
    [dispatch, authenticatedFetch]
  );

  const updateSettings = useCallback(
    (body) => {
      const entities = body.reduce((a, b) => ({ ...a, [b.id]: { ...b } }), {});
      const options = {
        method: "PUT",
        body: JSON.stringify(entities),
      };
      const url = process.env.BACKEND_URI + "settings/meal-category";
      return authenticatedFetch(url, options);
    },
    [authenticatedFetch]
  );
  const updateCategoriesAndMeals = useCallback(
    (body) => {
      const entities = body.reduce(
        (a, b) => ({
          ...a,
          [b.id]: {
            ...Object.keys(b)
              .filter((k) => k !== "itemIds")
              .reduce((c, d) => ({ ...c, [d]: b[d] }), {}),
          },
        }),
        {}
      );
      const ids = body.map(({ id }) => id);
      const options = {
        method: "PUT",
        body: JSON.stringify({ entities, ids }),
      };
      const url = process.env.BACKEND_URI + "settings/categories";
      return authenticatedFetch(url, options);
    },
    [authenticatedFetch]
  );
  const deleteMeal = useCallback(
    (id) => {
      const options = {
        method: "DELETE",
      };
      const url = process.env.BACKEND_URI + "meals/" + id;
      return authenticatedFetch(url, options);
    },
    [authenticatedFetch]
  );
  const postMeal = useCallback(
    (body) => {
      const options = {
        method: "POST",
        body: JSON.stringify(body),
      };
      const url = process.env.BACKEND_URI + "meals";
      return authenticatedFetch(url, options);
    },
    [authenticatedFetch]
  );
  const updateMeals = useCallback(
    (id, body) => {
      const options = {
        method: "PUT",
        body: JSON.stringify(body),
      };
      const url = process.env.BACKEND_URI + "meals/" + id;
      return authenticatedFetch(url, options);
    },
    [authenticatedFetch]
  );
  const updateAllMeals = useCallback(
    (ids, body) => {
      const options = {
        method: "PUT",
        body: JSON.stringify(body),
      };
      const url = process.env.BACKEND_URI + "meals/all/" + ids;
      return authenticatedFetch(url, options);
    },
    [authenticatedFetch]
  );

  const postUserOrders = useCallback(
    (body) => {
      return dispatch(
        postOrders({
          body: {
            ...body,
            user: { ...currentUser, phoneNumber: claims?.phoneNumber },
          },
          fetch: authenticatedFetch,
        })
      );
    },
    [authenticatedFetch, currentUser, claims, dispatch]
  );
  const updateOrderStatus = useCallback(
    (orderId, body) =>
      dispatch(
        updateOrderStatusThunk({
          id: orderId,
          body,
          fetch: authenticatedFetch,
        })
      ),
    [authenticatedFetch, dispatch]
  );
  const cancelOrderByUser = useCallback(
    (orderId) =>
      updateOrderStatus(orderId, {
        status: "canceled",
        meta: { reason: "Kundennotiz kann nicht abgeschlossen werden" },
      }),
    [updateOrderStatus]
  );

  const fetchTodaysOrders = useCallback(() => {
    const suffix = "";
    return dispatch(fetchOrdersThunk({ suffix }));
  }, [dispatch]);
  const fetchUserTodaysOrders = useCallback(() => {
    if (currentUser) {
      const suffix = `?user.uid=${currentUser?.uid}`;
      return dispatch(fetchOrdersThunk({ suffix, fetch: authenticatedFetch }));
    } else {
      return dispatch(clearOrders());
    }
  }, [authenticatedFetch, currentUser, dispatch]);

  return {
    dispatch,
    fetchSettings,
    fetchMeals,
    fetchMeal,
    fetchTodaysOrders,
    fetchUserTodaysOrders,
    fetchCategories,
    postUserOrders,
    updateMeals,
    updateAllMeals,
    updateSettings,
    updateCategoriesAndMeals,
    postMeal,
    deleteMeal,
    postShopIsOpen,
    updateOrderStatus,
    cancelOrderByUser,
  };
};
export default useAPI;
