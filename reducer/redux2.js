import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { mapSettingsToCategories, shopToState } from "../utilities/dataMapper";
import { customFetch } from "../utilities/utils.mjs";
const mealsAdapter = createEntityAdapter();
const categoriesAdapter = createEntityAdapter();
const cartItemsAdapter = createEntityAdapter();
const ordersAdapter = createEntityAdapter();
const settingsAdapter = createEntityAdapter();

export const fetchMealsThunk = createAsyncThunk(
  "data/fetchMealsThunk",
  async (props) => {
    const fetch = props?.fetch || customFetch;
    const url = process.env.BACKEND_URI + "meals";
    return await fetch(url).then((res) => res.data);
  }
);

export const fetchCategoriesThunk = createAsyncThunk(
  "data/fetchCategoriesThunk",
  async (props) => {
    const fetch = props?.fetch || customFetch;
    const url = process.env.BACKEND_URI + "settings?uid=meal-category";
    return await fetch(url).then((res) => res.data[0]);
  }
);
export const fetchSettingsThunk = createAsyncThunk(
  "data/fetchSettingsThunk",
  async (props) => {
    const suffix = props?.suffix || "";
    const fetch = props?.fetch || customFetch;
    const url = process.env.BACKEND_URI + "settings" + suffix;
    return await fetch(url).then((res) => res.data);
  }
);
export const fetchOrdersThunk = createAsyncThunk(
  "data/fetchOrders",
  async (props) => {
    const suffix = props?.suffix || "";
    const fetch = props?.fetch || customFetch;
    const url = process.env.BACKEND_URI + "orders" + suffix;
    return await fetch(url).then((res) => res.data);
  }
);

export const postShopIsOpenThunk = createAsyncThunk(
  "data/postShopIsOpenThunk",
  async (props) => {
    const value = props?.value;
    const fetch = props?.fetch || customFetch;
    const body = {
      uid: "shopIsOpen",
      entity: {
        value,
        id: "value",
      },
    };
    const url = process.env.BACKEND_URI + "settings";
    const options = {
      method: "POST",
      body: JSON.stringify(body),
    };
    return await fetch(url, options).then((res) => res.data);
  }
);
export const postOrders = createAsyncThunk("data/postOrders", async (props) => {
  const body = props?.body;
  const fetch = props?.fetch || customFetch;
  const url = process.env.BACKEND_URI;
  const options = {
    method: "POST",
    body: JSON.stringify(body),
  };
  return await fetch(url + "orders", options).then((res) => {
    return res.data;
  });
});
export const updateOrderStatusThunk = createAsyncThunk(
  "data/updateOrderStatusThunk",
  async (props) => {
    const body = props?.body;
    const fetch = props?.fetch || customFetch;
    const id = props?.id;
    const url = `${process.env.BACKEND_URI}orders/${id}`;
    const options = {
      method: "PUT",
      body: JSON.stringify(body),
    };
    return await fetch(url, options).then((res) => res.data);
  }
);

export const subjectSlice = createSlice({
  name: "shop",
  initialState: {
    meals: mealsAdapter.getInitialState(),
    categories: categoriesAdapter.getInitialState(),
    cart: { items: cartItemsAdapter.getInitialState(), time: null },
    orders: ordersAdapter.getInitialState(),
    settings: ordersAdapter.getInitialState(),
    error: false,
  },
  reducers: {
    addTime: (state, action) => {
      state.cart.time = action.payload;
    },
    addCommentCart: (state, action) => {
      const alreadyExists = cartItemsAdapter
        .getSelectors()
        .selectById(state.cart.items, action.payload.id);
      alreadyExists &&
        cartItemsAdapter.upsertOne(state.cart.items, action.payload);
    },
    itemAddedCart: (state, action) => {
      const { id: itemId, count, price, extras, comment } = action.payload;
      const singleItemPrice = extras.reduce(
        (a, b) => a + (b.price || 0),
        price
      );
      const old = cartItemsAdapter
        .getSelectors()
        .selectAll(state.cart.items)
        ?.find(
          (item) =>
            item?.itemId === itemId &&
            isEqual(
              [...(item?.extras || [])]?.sort(),
              [...(extras || [])]?.sort()
            ) &&
            item.comment === comment
        );
      old
        ? cartItemsAdapter.upsertOne(state.cart.items, {
            ...old,
            count: old.count + count,
            calculatedPrice: singleItemPrice * (count + old.count),
          })
        : cartItemsAdapter.upsertOne(state.cart.items, {
            ...action.payload,
            id: nanoid(),
            itemId,
            calculatedPrice: count * singleItemPrice,
          });
    },
    removeItemCart: (state, action) => {
      cartItemsAdapter.removeOne(state.cart.items, action.payload);
    },
    updateItemCountCart: (state, action) => {
      const { id, add } = action.payload;
      const old = cartItemsAdapter
        .getSelectors()
        .selectById(state.cart.items, id);
      const count = old.count + (add ? 1 : -1);
      cartItemsAdapter.upsertOne(state.cart.items, {
        id,
        calculatedPrice: count * old.price,
        count,
      });
    },
    clearOrders: (state) => {
      ordersAdapter.removeAll(state.orders);
    },
    clearCart: (state) => {
      cartItemsAdapter.removeAll(state.cart.items);
      state.cart.time = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.shop,
      };
    },
    [fetchMealsThunk.fulfilled](state, { payload }) {
      mealsAdapter.removeAll(state.meals);
      mealsAdapter.upsertMany(state.meals, payload || []);
    },
    [fetchMealsThunk.rejected](state, params) {
      state.error = params.error.message;
    },
    [fetchCategoriesThunk.fulfilled](state, { payload, meta: { arg } }) {
      const categories = mapSettingsToCategories({
        entities: payload.entities,
        ids: payload.ids,
        meals: arg,
      });
      categoriesAdapter.removeAll(state.categories);
      categoriesAdapter.upsertMany(state.categories, categories);
    },
    [fetchSettingsThunk.fulfilled](state, { payload, meta }) {
      const settings = shopToState(payload);
      settingsAdapter.upsertMany(state.settings, settings);
    },
    [fetchOrdersThunk.fulfilled](state, { payload }) {
      payload && ordersAdapter.upsertMany(state.orders, payload);
    },
    [fetchOrdersThunk.rejected](state, { payload }) {
      const orders = [
        {
          id: 100,
          status: "pending",
          user: "kostas",
          number: "XSADF",
          price: 20,
          items: [
            {
              title: "KostasMock",
              count: 2,
              price: 10,
              comment: "hihihihihi",
              itemId: 200,
              calculatedPrice: 20,
            },
          ],
        },
        {
          id: 200,
          status: "confirmed",
          user: "kostas",
          number: "XSADF",
          price: 20,
          items: [
            {
              title: "KostasMock",
              count: 2,
              price: 10,
              comment: "hihihihihi",
              itemId: 200,
              calculatedPrice: 20,
            },
          ],
        },
        {
          id: 300,
          status: "ready",
          user: "kostas",
          number: "XSADF",
          price: 20,
          items: [
            {
              title: "KostasMock",
              count: 2,
              price: 10,
              comment: "hihihihihi",
              itemId: 200,
              calculatedPrice: 20,
            },
          ],
        },
      ];
      ordersAdapter.upsertMany(state.orders, orders);
    },
    [postOrders.fulfilled](state, { payload }) {
      ordersAdapter.upsertMany(state.orders, payload);
      cartItemsAdapter.removeAll(state.cart.items);
      state.cart.time = null;
    },

    [postShopIsOpenThunk.fulfilled](
      state,
      {
        meta: {
          arg: { value },
        },
      }
    ) {
      settingsAdapter.upsertOne(state.settings, {
        id: "shopIsOpen",
        value,
      });
    },
    [postShopIsOpenThunk.rejected](state, { error }) {
      console.log(error);
      state.error = error.message;
    },
    [updateOrderStatusThunk.fulfilled](state, { payload, meta }) {
      const { body, id } = meta.arg;
      // const items = cartItemsSelectors.selectAll(state);
      ordersAdapter.upsertOne(state.orders, { id, ...body });
      // cartItemsAdapter.removeAll(state.cart.items);
    },
  },
});

const { actions, reducer } = subjectSlice;
export const {
  itemAddedCart,
  removeItemCart,
  updateItemCountCart,
  addCommentCart,
  addTime,
  clearOrders,
  clearCart,
  clearError,
} = actions;
const makeStore = () =>
  configureStore({
    reducer: {
      [subjectSlice.name]: subjectSlice.reducer,
    },
    devTools: true,
  });

export const fetchSubject = (id) => async (dispatch) => {
  const timeoutPromise = (timeout) =>
    new Promise((resolve) => setTimeout(resolve, timeout));

  await timeoutPromise(200);

  dispatch(
    subjectSlice.actions.setEnt({
      [id]: {
        id,
        name: `Subject ${id}`,
      },
    })
  );
};

export const wrapper = createWrapper(makeStore);

export const cartItemsSelectors = cartItemsAdapter.getSelectors(
  (state) => state.cart.items
);

export const ordersSelectors = ordersAdapter.getSelectors(
  (state) => state.orders
);

export const mealsSelectors = mealsAdapter.getSelectors((state) => state.meals);
export const settingsSelectors = settingsAdapter.getSelectors(
  (state) => state.settings
);

export const categoriesSelectors = categoriesAdapter.getSelectors(
  (state) => state.categories
);

export const selectAllMeals = (state) => mealsSelectors.selectAll(state.shop);

export const selectAllCategories = (state) =>
  categoriesSelectors.selectAll(state.shop);
export const selectAllActiveCategories = (state) => {
  return categoriesSelectors.selectAll(state.shop);
  // .filter((category) => category.itemIds.length);
};
export const selectAllMealsByCategory = createSelector(
  [selectAllCategories, selectAllMeals, (state, isAdmin) => isAdmin],
  (categories, meals, isAdmin) => {
    const mealsObject = meals.reduce((a, b) => {
      a[b.id] = b;
      return a;
    }, {});
    return categories?.reduce((a, { id, itemIds, ...rest }) => {
      const data = itemIds
        .map((id) => mealsObject[id])
        .filter((i) => i && (i?.visible || isAdmin));
      if (data.length) a[id] = { id, data, ...rest };
      return a;
    }, {});
  }
);
export const selectCart = (state) => cartItemsSelectors.selectAll(state.shop);
export const selectOrders = (state) => ordersSelectors.selectAll(state.shop);
export const selectSettings = (state) =>
  settingsSelectors.selectAll(state.shop);
export const selectCategories = (state) =>
  categoriesSelectors.selectAll(state.shop);
export const selectAllOrdersByCategory = createSelector(
  [selectOrders],
  (orders) => {
    return ["pending", "confirmed", "ready", "archived"].reduce(
      (a, status) => ({
        ...a,
        [status]: orders.filter((o) =>
          status !== "archived"
            ? o.status === status
            : o.status === "canceled" || o.status === "finished"
        ),
      }),
      {}
    );
  }
);
export const selectAllUserIDs = createSelector([selectOrders], (orders) => {
  return orders?.map((o) => o.user.uid);
});
export const selectAllCustomers = createSelector([selectAllUserIDs], (ids) => {
  return [...new Set(ids)];
});
export const selectShopIsOpen = createSelector(
  [selectSettings],
  (settings) => settings?.find((e) => e.id === "shopIsOpen")?.value
);
