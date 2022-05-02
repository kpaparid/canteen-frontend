import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  current,
  nanoid,
} from "@reduxjs/toolkit";
import { isEqual, sample } from "lodash";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import {
  mapSettingsToCategories,
  shopToState,
  shopToState2,
} from "../utilities/dataMapper";

const mealsAdapter = createEntityAdapter();
const categoriesAdapter = createEntityAdapter();
const cartItemsAdapter = createEntityAdapter();
const ordersAdapter = createEntityAdapter();
const settingsAdapter = createEntityAdapter();

export const fetchMeals = createAsyncThunk("data/fetchMeals", async () => {
  const url = process.env.BACKEND_URI;
  return await fetch(url + "meals").then((res) =>
    res.json().then((r) => {
      return r.data;
    })
  );
});
export const fetchCategories = createAsyncThunk(
  "data/fetchCategories",
  async () => {
    const url = process.env.BACKEND_URI;
    return await fetch(url + "settings").then((res) =>
      res.json().then((r) => r.data[0].entities)
    );
  }
);
export const fetchSettings = createAsyncThunk(
  "data/fetchSettings",
  async (props) => {
    const suffix = props?.suffix || "";
    const url = process.env.BACKEND_URI;
    return await fetch(url + "settings" + suffix).then((res) =>
      res.json().then((r) => r.data)
    );
  }
);
export const fetchOrders = createAsyncThunk(
  "data/fetchOrders",
  async ({ suffix = "" }) => {
    const url = process.env.BACKEND_URI + "orders" + suffix;
    return await fetch(url).then((res) =>
      res.json().then((r) => {
        return r.data;
      })
    );
  }
);
export const openCloseShop = createAsyncThunk(
  "data/openCloseShop",
  async (props) => {
    const body = {
      uid: "shopIsOpen",
      entity: {
        value: props,
        id: "value",
      },
    };
    const url = process.env.BACKEND_URI + "settings";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    return await fetch(url, options).then((res) =>
      res.json().then((r) => {
        return r.data;
      })
    );
  }
);
export const postOrders = createAsyncThunk("data/postOrders", async (body) => {
  const url = process.env.BACKEND_URI;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return await fetch(url + "orders", options).then((res) =>
    res.json().then((r) => {
      return r.data;
    })
  );
});
export const changeOrderStatus = createAsyncThunk(
  "data/changeOrderStatus",
  async ({ id, body }) => {
    const url = `${process.env.BACKEND_URI}orders/${id}`;
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    return await fetch(url, options).then((res) =>
      res.json().then((r) => r.data)
    );
  }
);

export const subjectSlice = createSlice({
  name: "shop",
  initialState: {
    meals: mealsAdapter.getInitialState(),
    categories: categoriesAdapter.getInitialState(),
    cart: { items: cartItemsAdapter.getInitialState() },
    orders: ordersAdapter.getInitialState(),
    settings: ordersAdapter.getInitialState(),
  },
  reducers: {
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
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.shop,
      };
    },
    [fetchMeals.fulfilled](state, { payload }) {
      mealsAdapter.upsertMany(state.meals, payload);
    },
    [fetchCategories.fulfilled](state, { payload, meta: { arg } }) {
      const categories = mapSettingsToCategories({
        entities: payload,
        meals: arg,
      });
      categoriesAdapter.upsertMany(state.categories, categories);
    },
    [fetchSettings.fulfilled](state, { payload, meta }) {
      const settings = shopToState(payload);
      settingsAdapter.upsertMany(state.settings, settings);
    },
    [fetchOrders.fulfilled](state, { payload }) {
      ordersAdapter.upsertMany(state.orders, payload);
    },
    [fetchOrders.rejected](state, { payload }) {
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
    },

    [openCloseShop.fulfilled](state, { meta: { arg } }) {
      settingsAdapter.upsertOne(state.settings, {
        id: "shopIsOpen",
        value: arg,
      });
    },
    [changeOrderStatus.fulfilled](state, { payload, meta }) {
      const {
        body: { status },
        id,
      } = meta.arg;
      // const items = cartItemsSelectors.selectAll(state);
      ordersAdapter.upsertOne(state.orders, { id, status });
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
  return categoriesSelectors
    .selectAll(state.shop)
    .filter((category) => category.itemIds.length);
};
export const selectAllMealsByCategory = createSelector(
  [selectAllCategories, selectAllMeals],
  (categories, meals) => {
    const mealsObject = meals.reduce((a, b) => {
      a[b.id] = b;
      return a;
    }, {});
    return categories?.reduce((a, { id, itemIds, ...rest }) => {
      const data = itemIds.map((id) => mealsObject[id]);
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
export const selectShopIsOpen = createSelector(
  [selectSettings],
  (settings) => settings?.find((e) => e.id === "shopIsOpen")?.value
);

// export const selectSettings = createSelector([selectOrders], (orders) => {
//   return ["pending", "confirmed", "ready", "archived"].reduce(
//     (a, status) => ({
//       ...a,
//       [status]: orders.filter((o) =>
//         status !== "archived"
//           ? o.status === status
//           : o.status === "canceled" || o.status === "finished"
//       ),
//     }),
//     {}
//   );
// });
