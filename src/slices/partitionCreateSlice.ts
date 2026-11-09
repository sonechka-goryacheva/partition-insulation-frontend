import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { api } from "../api";
import type { PartitionAttributeResponseDto, PublishPartitionSystemDto } from "../api/Api";
import type { PartitionSystem } from "../modules/partitionTypes";
import { withPartitionMinioProxy } from "../modules/partitionMinio";

// Состояние страницы «Добавить»: справочник атрибутов, черновик пользователя,
// признак выполнения запроса и текст ошибки
interface PartitionCreateState {
  partitionAttributesDirectory: PartitionAttributeResponseDto[];
  partitionDraft: PartitionSystem | null;
  loading: boolean;
  error: string | null;
}

const initialState: PartitionCreateState = {
  partitionAttributesDirectory: [],
  partitionDraft: null,
  loading: false,
  error: null,
};

// Справочник характеристик: GET /api/partitions/attributes
export const getPartitionAttributesDirectory = createAsyncThunk<
  PartitionAttributeResponseDto[],
  void,
  { rejectValue: string }
>("partitionCreate/getPartitionAttributesDirectory", async (_, { rejectWithValue }) => {
  try {
    const response = await api.partitions.getPartitionAttributes();
    return response.data;
  } catch {
    return rejectWithValue("Не удалось загрузить справочник характеристик");
  }
});

// Черновик текущего пользователя: GET /api/partitions/draft (404 — черновика нет)
export const getPartitionDraft = createAsyncThunk<PartitionSystem | null, void>(
  "partitionCreate/getPartitionDraft",
  async () => {
    try {
      const response = await api.partitions.getPartitionDraft();
      return withPartitionMinioProxy(response.data);
    } catch {
      return null; // черновика нет — форма начинается с названия, фото и видео
    }
  },
);

// Шаг 1 — черновик: POST /api/partitions/draft (multipart: название, фото, видео)
interface PartitionDraftArgs {
  partitionName: string;
  partitionPhoto: File;
  partitionVideo: File;
}

export const createPartitionDraft = createAsyncThunk<
  PartitionSystem,
  PartitionDraftArgs,
  { rejectValue: string }
>("partitionCreate/createPartitionDraft", async (partitionDraftArgs, { rejectWithValue }) => {
  try {
    const response = await api.partitions.createPartitionDraft(partitionDraftArgs);
    return withPartitionMinioProxy(response.data);
  } catch {
    return rejectWithValue("Не удалось создать черновик: проверьте фото (jpg, png, webp) и видео (mp4, webm, mov)");
  }
});

// Шаг 2 — публикация: PUT /api/partitions/draft/publish (описание, толщина, Rw, характеристики)
export const publishPartitionDraft = createAsyncThunk<
  PartitionSystem,
  PublishPartitionSystemDto,
  { rejectValue: string }
>("partitionCreate/publishPartitionDraft", async (publishDto, { rejectWithValue }) => {
  try {
    const response = await api.partitions.publishPartitionDraft(publishDto);
    return withPartitionMinioProxy(response.data);
  } catch {
    return rejectWithValue("Не удалось опубликовать конструкцию: проверьте заполнение полей");
  }
});

const partitionCreateSlice = createSlice({
  name: "partitionCreate",
  initialState,
  reducers: {},
  // жизненный цикл thunk: pending — запрос начат, fulfilled — успех, rejected — ошибка
  extraReducers: (builder) => {
    builder
      .addCase(getPartitionAttributesDirectory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartitionAttributesDirectory.fulfilled, (state, action) => {
        state.loading = false;
        state.partitionAttributesDirectory = action.payload;
      })
      .addCase(getPartitionAttributesDirectory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(getPartitionDraft.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPartitionDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.partitionDraft = action.payload;
      })
      .addCase(createPartitionDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPartitionDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.partitionDraft = action.payload; // дальше — только поля публикации
      })
      .addCase(createPartitionDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(publishPartitionDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishPartitionDraft.fulfilled, (state) => {
        state.loading = false;
        state.partitionDraft = null; // черновик опубликован
      })
      .addCase(publishPartitionDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });
  },
});

export const usePartitionAttributesDirectory = () =>
  useSelector((state: RootState) => state.partitionCreate.partitionAttributesDirectory);

export const usePartitionDraft = () =>
  useSelector((state: RootState) => state.partitionCreate.partitionDraft);

export const usePartitionCreateLoading = () =>
  useSelector((state: RootState) => state.partitionCreate.loading);

export const usePartitionCreateError = () =>
  useSelector((state: RootState) => state.partitionCreate.error);

export default partitionCreateSlice.reducer;
