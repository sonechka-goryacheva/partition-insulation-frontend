import { combineReducers, configureStore } from "@reduxjs/toolkit";
import partitionSystemsReducer from "./slices/partitionSystemsSlice";
import partitionUserReducer from "./slices/partitionUserSlice";
import partitionCreateReducer from "./slices/partitionCreateSlice";

// Глобальное хранилище: корневой reducer собирается через combineReducers()
const store = configureStore({
  reducer: combineReducers({
    partitionData: partitionSystemsReducer, // конструкции и фильтр
    partitionUser: partitionUserReducer, // гость или пользователь
    partitionCreate: partitionCreateReducer, // страница «Добавить»: справочник и черновик
  }),
});

// Типы состояния и dispatch для useSelector() и useDispatch() в TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
