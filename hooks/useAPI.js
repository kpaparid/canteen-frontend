import { format } from "date-fns";
import { useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchOrders, clearOrders, postOrders } from "../reducer/redux2";

const useAPI = () => {
  const { authenticatedFetch, currentUser } = useAuth();

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
      return postOrders({ ...body, user: currentUser }, authenticatedFetch);
    },
    [authenticatedFetch, currentUser]
  );

  const fetchTodaysOrders = useCallback(() => {
    const date = format(new Date(), "yyyy-MM-dd") + "T00:00:00.000+02:00";
    const suffix = `?createdAt_gte=${date}`;
    return fetchOrders({ suffix, authenticatedFetch });
  }, [authenticatedFetch]);
  const fetchUserTodaysOrders = useCallback(() => {
    if (currentUser) {
      const date = format(new Date(), "yyyy-MM-dd") + "T00:00:00.000+02:00";
      const suffix = `?createdAt_gte=${date}&user.uid=${currentUser?.uid}`;
      // const suffix = `?user.uid=${currentUser?.uid}`;
      return fetchOrders({ suffix, authenticatedFetch });
    } else {
      return clearOrders();
    }
  }, [authenticatedFetch, currentUser]);

  return {
    fetchTodaysOrders,
    fetchUserTodaysOrders,
    postUserOrders,
    updateMeals,
    updateAllMeals,
    updateSettings,
    updateCategoriesAndMeals,
    postMeal,
    deleteMeal,
  };
};
export default useAPI;
