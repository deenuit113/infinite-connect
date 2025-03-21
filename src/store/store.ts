import { configureStore } from '@reduxjs/toolkit';
import { userCardListApi } from '@features/UserPage/api/userCardListApi';
import { businessCardApi } from '@features/BusinessCard/api/businessCardApi';
import { infoDuplicateCheckApi } from '@features/SignupPage/api/infoDuplicateCheckApi';

const store = configureStore({
  reducer: {
    [userCardListApi.reducerPath]: userCardListApi.reducer,
    [businessCardApi.reducerPath]: businessCardApi.reducer,
    [infoDuplicateCheckApi.reducerPath]: infoDuplicateCheckApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      userCardListApi.middleware,
      businessCardApi.middleware,
      infoDuplicateCheckApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
