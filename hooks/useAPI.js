import { format } from "date-fns";
import { useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchOrders } from "../reducer/redux2";

const useAPI = () => {
  const { authenticatedFetch, currentUser } = useAuth();
  const fetchTodaysOrders = useCallback(() => {
    const date = format(new Date(), "yyyy-MM-dd") + "T00:00:00.000+02:00";
    const suffix = `?createdAt_gte=${date}`;
    return fetchOrders({ suffix, authenticatedFetch });
  }, [authenticatedFetch]);
  const fetchUserTodaysOrders = useCallback(() => {
    const date = format(new Date(), "yyyy-MM-dd") + "T00:00:00.000+02:00";
    const suffix = `?createdAt_gte=${date}&user.uid=${currentUser.uid}`;
    return fetchOrders({ suffix, authenticatedFetch });
  }, [authenticatedFetch, currentUser.uid]);

  return { fetchTodaysOrders, fetchUserTodaysOrders };
};
export default useAPI;
