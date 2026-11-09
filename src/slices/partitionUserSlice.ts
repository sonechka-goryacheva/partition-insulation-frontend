import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { PartitionUserResponseDto } from "../api/Api";

// Состояние интерфейса после авторизации: isAuthenticated = false — гость, true — пользователь.
// Запросы входа и выхода выполняются через axios (src/modules/partitionAuth.ts),
// результат передаётся сюда вручную обычными действиями — без thunk и кодогенерации
interface PartitionUserState {
  partitionUserLogin: string;
  partitionUserName: string;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: PartitionUserState = {
  partitionUserLogin: "",
  partitionUserName: "",
  isAuthenticated: false,
  error: null,
};

const partitionUserSlice = createSlice({
  name: "partitionUser",
  initialState,
  reducers: {
    setPartitionUser(state, { payload }: PayloadAction<PartitionUserResponseDto>) {
      state.partitionUserLogin = payload.partitionUserLogin; // вход выполнен
      state.partitionUserName = payload.partitionUserName;
      state.isAuthenticated = true;
      state.error = null;
    },
    setPartitionUserError(state, { payload }: PayloadAction<string | null>) {
      state.error = payload; // текст ошибки входа для страницы авторизации
    },
    resetPartitionUser() {
      return initialState; // выход: снова интерфейс гостя
    },
  },
});

export const usePartitionIsAuthenticated = () =>
  useSelector((state: RootState) => state.partitionUser.isAuthenticated);

export const usePartitionUserName = () =>
  useSelector((state: RootState) => state.partitionUser.partitionUserName);

export const usePartitionUserError = () =>
  useSelector((state: RootState) => state.partitionUser.error);

export const {
  setPartitionUser: setPartitionUserAction,
  setPartitionUserError: setPartitionUserErrorAction,
  resetPartitionUser: resetPartitionUserAction,
} = partitionUserSlice.actions;

export default partitionUserSlice.reducer;
