import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { api } from "../api";
import type { PartitionSystem } from "../modules/partitionTypes";
import { withPartitionMinioProxy } from "../modules/partitionMinio";
import {
  PARTITION_RW_MAX,
  PARTITION_RW_MIN,
  getPartitionFeedItemMock,
  getPartitionSystemsMock,
} from "../modules/partitionMock";

// Состояние конструкций: список для плитки, открытая в ленте конструкция,
// значения фильтра по индексу Rw, признак выполнения запроса и текст ошибки
interface PartitionSystemsState {
  partitionSystems: PartitionSystem[];
  partitionFeedItem: PartitionSystem | null;
  rwFrom: number;
  rwTo: number;
  loading: boolean;
  error: string | null;
}

// Ошибка запроса: mock-коллекция показывается только гостю (по заданию ЛР-6)
interface PartitionRequestError {
  message: string;
  useMock: boolean;
}

const initialState: PartitionSystemsState = {
  partitionSystems: [], // заполняется из веб-сервиса через thunk
  partitionFeedItem: null,
  rwFrom: PARTITION_RW_MIN,
  rwTo: PARTITION_RW_MAX,
  loading: false,
  error: null,
};

// Плитка: GET /api/partitions?rwFrom&rwTo — фильтр берётся из Redux через getState
export const getPartitionSystemsList = createAsyncThunk<
  PartitionSystem[],
  void,
  { state: RootState; rejectValue: PartitionRequestError }
>("partitionSystems/getPartitionSystemsList", async (_, { getState, rejectWithValue }) => {
  const { partitionData, partitionUser } = getState();
  try {
    const response = await api.partitions.getPartitionSystems({
      rwFrom: partitionData.rwFrom,
      rwTo: partitionData.rwTo,
    });
    return response.data.map(withPartitionMinioProxy);
  } catch {
    return rejectWithValue({
      message: "Веб-сервис недоступен: не удалось загрузить конструкции",
      useMock: !partitionUser.isAuthenticated,
    });
  }
});

// Лента: без id — GET /api/partitions/feed (первая конструкция),
// с id — GET /api/partitions/feed/{id}, с next — следующая за ней («Далее»)
interface PartitionFeedArgs {
  partitionSystemId?: number;
  next?: boolean;
}

export const getPartitionFeedItem = createAsyncThunk<
  PartitionSystem,
  PartitionFeedArgs,
  { state: RootState; rejectValue: PartitionRequestError }
>("partitionSystems/getPartitionFeedItem", async ({ partitionSystemId, next }, { getState, rejectWithValue }) => {
  try {
    const response =
      partitionSystemId === undefined
        ? await api.partitions.getPartitionFeedFirst()
        : await api.partitions.getPartitionFeed(partitionSystemId, next ? { next: true } : undefined);
    return withPartitionMinioProxy(response.data);
  } catch {
    return rejectWithValue({
      message: "Не удалось загрузить конструкцию",
      useMock: !getState().partitionUser.isAuthenticated,
    });
  }
});

// Лайк в ленте: POST /api/partitions/{id}/like, partitionLike = 1 — поставить, 0 — снять
interface PartitionLikeArgs {
  partitionSystemId: number;
  partitionLike: 0 | 1;
}

export const likePartitionSystem = createAsyncThunk<
  PartitionSystem,
  PartitionLikeArgs,
  { rejectValue: string }
>("partitionSystems/likePartitionSystem", async ({ partitionSystemId, partitionLike }, { rejectWithValue }) => {
  try {
    const response = await api.partitions.likePartitionSystem(partitionSystemId, { partitionLike });
    return response.data; // обновлённая карточка: число лайков и признак partitionIsLiked
  } catch {
    return rejectWithValue("Не удалось изменить лайк");
  }
});

// Удаление своей конструкции: DELETE /api/partitions/{id}
export const deletePartitionSystem = createAsyncThunk<number, number, { rejectValue: string }>(
  "partitionSystems/deletePartitionSystem",
  async (partitionSystemId, { rejectWithValue }) => {
    try {
      await api.partitions.deletePartitionSystem(partitionSystemId);
      return partitionSystemId;
    } catch {
      return rejectWithValue("Не удалось удалить конструкцию");
    }
  },
);

const partitionSystemsSlice = createSlice({
  name: "partitionSystems",
  // в initialState указываем начальное состояние глобального хранилища
  initialState,
  // редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
  reducers: {
    setPartitionRwFrom(state, { payload }: PayloadAction<number>) {
      state.rwFrom = payload; // слайдер «Индекс Rw не ниже»
    },
    setPartitionRwTo(state, { payload }: PayloadAction<number>) {
      state.rwTo = payload; // слайдер «Индекс Rw не выше»
    },
    resetPartitionFilter(state) {
      state.rwFrom = PARTITION_RW_MIN; // сброс фильтра (понадобится при выходе)
      state.rwTo = PARTITION_RW_MAX;
    },
  },
  // жизненный цикл thunk: pending — запрос начат, fulfilled — успех, rejected — ошибка
  extraReducers: (builder) => {
    builder
      .addCase(getPartitionSystemsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartitionSystemsList.fulfilled, (state, action) => {
        state.loading = false;
        state.partitionSystems = action.payload;
      })
      .addCase(getPartitionSystemsList.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.useMock ?? true) {
          // гость, веб-сервис недоступен — mock-коллекция с тем же фильтром
          state.partitionSystems = getPartitionSystemsMock(state.rwFrom, state.rwTo);
        } else {
          // пользователь — mock не показываем, только сообщение об ошибке
          state.partitionSystems = [];
          state.error = action.payload?.message ?? null;
        }
      })
      .addCase(getPartitionFeedItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartitionFeedItem.fulfilled, (state, action) => {
        state.loading = false;
        state.partitionFeedItem = action.payload;
      })
      .addCase(getPartitionFeedItem.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.useMock ?? true) {
          // гость, веб-сервис недоступен — та же конструкция из mock-коллекции
          const { partitionSystemId, next } = action.meta.arg;
          state.partitionFeedItem = getPartitionFeedItemMock(partitionSystemId, next);
        } else {
          state.partitionFeedItem = null;
          state.error = action.payload?.message ?? null;
        }
      })
      .addCase(likePartitionSystem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likePartitionSystem.fulfilled, (state, action) => {
        state.loading = false;
        // меняем только лайки: ссылки на фото и видео оставляем прежними, чтобы видео не перезапускалось
        const { partitionSystemId, partitionLikesCount, partitionIsLiked } = action.payload;
        for (const partitionSystem of [...state.partitionSystems, state.partitionFeedItem]) {
          if (partitionSystem?.partitionSystemId === partitionSystemId) {
            partitionSystem.partitionLikesCount = partitionLikesCount;
            partitionSystem.partitionIsLiked = partitionIsLiked;
          }
        }
      })
      .addCase(likePartitionSystem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(deletePartitionSystem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePartitionSystem.fulfilled, (state, action) => {
        state.loading = false;
        // удалённая конструкция пропадает из плитки и из ленты
        state.partitionSystems = state.partitionSystems.filter(
          (partitionSystem) => partitionSystem.partitionSystemId !== action.payload,
        );
        if (state.partitionFeedItem?.partitionSystemId === action.payload) {
          state.partitionFeedItem = null;
        }
      })
      .addCase(deletePartitionSystem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });
  },
});

// Чтение из хранилища через useSelector()
export const usePartitionSystems = () =>
  useSelector((state: RootState) => state.partitionData.partitionSystems);

export const usePartitionFeedItem = () =>
  useSelector((state: RootState) => state.partitionData.partitionFeedItem);

export const usePartitionRwFrom = () =>
  useSelector((state: RootState) => state.partitionData.rwFrom);

export const usePartitionRwTo = () =>
  useSelector((state: RootState) => state.partitionData.rwTo);

export const usePartitionLoading = () =>
  useSelector((state: RootState) => state.partitionData.loading);

export const usePartitionError = () =>
  useSelector((state: RootState) => state.partitionData.error);

// Действия (actions) для отправки через useDispatch()
export const {
  setPartitionRwFrom: setPartitionRwFromAction,
  setPartitionRwTo: setPartitionRwToAction,
  resetPartitionFilter: resetPartitionFilterAction,
} = partitionSystemsSlice.actions;

export default partitionSystemsSlice.reducer;
