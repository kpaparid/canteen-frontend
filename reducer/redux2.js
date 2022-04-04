import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  current,
  nanoid,
} from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { shopToState } from "../utilities/dataMapper";
import { fMenu } from "../data/menu";
import {
  faBars,
  faFileLines,
  faHistory,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";

const mealsAdapter = createEntityAdapter();
const categoriesAdapter = createEntityAdapter();
const cartItemsAdapter = createEntityAdapter();
const ordersAdapter = createEntityAdapter();
export const fetchShop = createAsyncThunk("data/fetchShop", async () => {
  const url = process.env.BACKEND_URI;
  return await fetch(url + "meals").then((res) =>
    res.json().then((meals) =>
      fetch(url + "settings").then((r) =>
        r.json().then((settings) => {
          return {
            meals: meals.data,
            categories: settings.data[0].entities,
          };
        })
      )
    )
  );
});
export const fetchOrders = createAsyncThunk("data/fetchOrders", async () => {
  const url = process.env.BACKEND_URI;
  return await fetch(url + "orders").then((res) =>
    res.json().then((r) => r.data)
  );
});
export const postOrders = createAsyncThunk("data/postOrders", async (body) => {
  const url = process.env.BACKEND_URI;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return await fetch(url + "orders", options).then((res) =>
    res.json().then((r) => {
      r.data;
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
    [fetchShop.fulfilled](state, { payload }) {
      const { categories } = shopToState(payload);
      mealsAdapter.upsertMany(state.meals, payload.meals);
      categoriesAdapter.upsertMany(state.categories, categories);
    },
    [fetchOrders.fulfilled](state, { payload }) {
      ordersAdapter.upsertMany(state.orders, payload);
    },
    [postOrders.fulfilled](state) {
      const items = cartItemsSelectors.selectAll(state);
      ordersAdapter.upsertMany(state.orders, items);
      cartItemsAdapter.removeAll(state.cart.items);
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

export const ordersSelectors = ordersAdapter.getSelectors((state) => {
  return state.orders;
});

export const categoriesSelectors = categoriesAdapter.getSelectors(
  (state) => state.categories
);
export const mealsSelector = mealsAdapter.getSelectors((state) => state.meals);
export const selectAllMeals = (state) => mealsSelector.selectAll(state.shop);

export const categoriesSelector = categoriesAdapter.getSelectors(
  (state) => state.categories
);

export const selectAllCategories = (state) =>
  categoriesSelector.selectAll(state.shop);
export const selectAllActiveCategories = (state) => {
  return categoriesSelector
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
export const selectAllOrdersByCategory = createSelector(
  [selectOrders],
  (orders) =>
    ["pending", "confirmed", "ready", "archived"].reduce(
      (a, status) => ({
        ...a,
        [status]: orders.filter((o) =>
          status !== "archived"
            ? o.status === status
            : o.status === "canceled" || o.status === "finished"
        ),
      }),
      {}
    )
);
