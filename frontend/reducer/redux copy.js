// import {
//   configureStore,
//   createAsyncThunk,
//   createEntityAdapter,
//   createSlice,
// } from "@reduxjs/toolkit";

// const API = process.env.REACT_APP_API_URL;

// function createGenericSlice(sliceName) {
//   const tablesAdapter = createEntityAdapter();

//   const tablesSelector = tablesAdapter.getSelectors(
//     (state) => state[sliceName].tables
//   );
//   const tablesSelectById = (state, id) =>
//     tablesAdapter.getSelectors().selectById(state.tables, id);

//   const fetchPage = createAsyncThunk(
//     "data/fetchUpdatedEntity",
//     async ({ entityId, page = "1", header }, thunkAPI) => {
//       const state = thunkAPI.getState();
//       const {
//         sort,
//         filters,
//         initialFilters,
//         initialSort,
//         pagination: { limit },
//       } = tablesAdapter
//         .getSelectors()
//         .selectById(state[sliceName].tables, entityId);
//       const filterLink = filtersToUrl(
//         { ...initialFilters, ...filters },
//         initialFilters
//       );
//       const url = getGridUrl(entityId);
//       const sortLink = sortToUrl(sort, initialSort);
//       const realPage = page && parseInt(page) - 1 > 0 ? parseInt(page) - 1 : 0;
//       const pageSuffix =
//         page !== null && page !== undefined && limit
//           ? "&page=" + page + "&size=" + limit
//           : "";
//       const urlSuffix = filterLink + sortLink + pageSuffix;
//       const finalUrl = url + "?" + urlSuffix;

//       const requestOptions = {
//         method: "GET",
//         headers: header,
//       };
//       return await fetch(finalUrl, requestOptions)
//         .then((res) =>
//           res.json().then(({ data }) => {
//             return {
//               data: data.content || data,
//               entityId,
//               filters,
//               initialFilters,
//               pagination:
//                 page !== null &&
//                 page !== undefined &&
//                 limit &&
//                 parsePagination({ res: data, page: page, limit }),
//               // url,
//               sort,
//               selectedRows: [],
//             };
//           })
//         )
//         .catch(() => ({
//           data: [],
//           entityId,
//         }));
//     }
//   );

//   const slice = createSlice({
//     name: sliceName,
//     initialState: {
//       tables: tablesAdapter.getInitialState(),
//     },
//     extraReducers: {
//       [fetchAndInitEntityGrid.pending](
//         state,
//         {
//           meta: {
//             arg: { entityId },
//           },
//         }
//       ) {
//         tablesAdapter.upsertOne(state.tables, { id: entityId, loading: true });
//       },
//       [fetchAndInitEntityGrid.fulfilled](state, { payload }) {
//         const { data, entityId, ...meta } = payload;
//         console.log("fullfiled", entityId);
//         const mapped = mapPromiseData(data, entityId);

//         const drivers = meta?.drivers;
//         const { tables, labels, modes } = normalizeInitApi({
//           data: mapped,
//           meta: { ...meta, loading: false },
//           drivers,
//         });

//         tablesAdapter.setMany(state.tables, tables);
//         labelsAdapter.setMany(state.labels, labels);
//         modesAdapter.setMany(state.modes, modes);
//         state.loading = false;
//       },
//     },
//     reducers: {
//       setSelectedRows: (state, action) => {
//         const { id, rows } = action.payload;
//         tablesAdapter.updateOne(state.tables, {
//           id,
//           changes: {
//             selectedRows: rows,
//           },
//         });
//       },
//     },
//   });

//   return {
//     slice,
//     selectors: {
//       tablesSelector,
//     },
//     reducer: slice.reducer,
//     actions: {
//       ...slice.actions,
//     },
//   };
// }

// export const gridTableSlice = createGenericSlice("menuSlice");

// export function createReduxStore() {
//   const store = configureStore({
//     reducer: {
//       gridTable: gridTableSlice.reducer,
//     },
//     devTools: window.__REDUX_DEVTOOLS_EXTENSION__?.(),
//   });
//   return store;
// }
