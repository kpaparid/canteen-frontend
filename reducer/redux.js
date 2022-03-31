// import {
//   createEntityAdapter,
//   createSlice,
//   configureStore,
//   createAsyncThunk,
// } from "@reduxjs/toolkit";

// const mealsAdapter = createEntityAdapter({
//   selectId: (meal) => meal.id,
//   sortComparer: (a, b) => a.title.localeCompare(b.title),
// });
// const fetchShop = createAsyncThunk("data/fetchShop", async () => {
//   const requestOptions = {
//     method: "GET",
//     headers: header,
//   };
//   const url = "http://localhost:3000/";
//   return await fetch(url, requestOptions)
//     .then((res) =>
//       res.json().then((res) => {
//         return {};
//       })
//     )
//     .catch(() => ({
//       data: [],
//       entityId,
//     }));
// });

// export const shopSlice = createSlice({
//   name: "shop",
//   initialState: mealsAdapter.getInitialState({ loading: "idle" }),
//   reducers: {
//     bookAdded: mealsAdapter.addOne,
//     mealsReceived(state, action) {
//       mealsAdapter.setAll(state, action.payload.meals);
//     },
//   },
//   extraReducers: {
//     [fetchShop.fulfilled](state, { payload }) {
//       const p = payload;
//     },
//   },
// });

// export default shopSlice.reducer;
