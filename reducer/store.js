import { configureStore } from "@reduxjs/toolkit";
import { shopSlice } from "./redux";

let store;
export const createStore = (preloadedState) => {
  if (typeof window === "undefined") {
    return configureStore({
      reducer: {
        shop: shopSlice.reducer,
      },
      preloadedState,
    });
  }

  if (!store) {
    store = configureStore({
      reducer: {
        shop: shopSlice.reducer,
      },
      preloadedState,
    });
  }

  return store;
};
