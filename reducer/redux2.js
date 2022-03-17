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
import { menu } from "../data/menu";
import { shopToState } from "../utilities/dataMapper";

const mealsAdapter = createEntityAdapter();
const categoriesAdapter = createEntityAdapter();
const cartItemsAdapter = createEntityAdapter();
export const fetchShop = createAsyncThunk("data/fetchShop", async () => {
  const url = "http://localhost:3000/";
  //   return await fetch(url, requestOptions)
  //     .then((res) =>
  //       res.json().then((res) => {
  //         return menu;
  //       })
  //     )
  //     .catch(() => ({
  //       ...menu,
  //     }));
  return menu;
});

export const subjectSlice = createSlice({
  name: "shop",
  initialState: {
    meals: mealsAdapter.getInitialState(),
    categories: categoriesAdapter.getInitialState(),
    cart: { items: cartItemsAdapter.getInitialState() },
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
            calculatedPrice: price * (count + old.count),
          })
        : cartItemsAdapter.upsertOne(state.cart.items, {
            ...action.payload,
            id: nanoid(),
            itemId,
            calculatedPrice: count * price,
          });
    },
    removeItemCart: (state, action) => {
      cartItemsAdapter.removeOne(state.cart.items, action.payload);
    },
    updateItemCountCart: (state, action) => {
      console.log("hi");
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
      console.log("HYDRATE", state, action.payload);
      return {
        ...state,
        ...action.payload.shop,
      };
    },
    [fetchShop.fulfilled](state, { payload }) {
      const p = payload;
      const { items, categories } = shopToState(payload);
      //   mealsAdapter.upsertOne(state.meals, m);
      mealsAdapter.upsertMany(state.meals, items);
      categoriesAdapter.upsertMany(state.categories, categories);

      //   return { ...state, test: "true" };
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

export const selectAllMealsByCategory = createSelector(
  [selectAllCategories, selectAllMeals],
  (categories, meals) => {
    const mealsObject = meals.reduce((a, b) => {
      a[b.id] = b;
      return a;
    }, {});
    return categories?.reduce((a, { id, text, itemIds }) => {
      a[id] = { id, text, data: itemIds.map((id) => mealsObject[id]) };
      return a;
    }, {});
  }
);

export const selectCart = (state) => cartItemsSelectors.selectAll(state.shop);
