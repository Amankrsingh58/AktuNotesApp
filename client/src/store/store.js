import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import authReducer from "./slices/authSlice";
import userAuthReducer from "./slices/userSlice";
import { pyqApi } from "../features/pyq/pyqApi";
import { pyqStats } from "../features/dashboard/pyqStats";
import { notesApi } from "../features/notes/notesApi";
import { paymentApi } from "../features/payment/paymentApi";
import { userApi } from "../features/user/userApi";
import { articleApi } from "../features/articles/articleApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userAuth: userAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [pyqApi.reducerPath]: pyqApi.reducer,
    [pyqStats.reducerPath]: pyqStats.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [articleApi.reducerPath]: articleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
                          .concat(pyqApi.middleware)
                          .concat(pyqStats.middleware)
                          .concat(notesApi.middleware)
                          .concat(paymentApi.middleware)
                          .concat(userApi.middleware)
                          .concat(articleApi.middleware),
});
