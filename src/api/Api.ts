/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PartitionSystemAttributeDto {
  /** @example 1 */
  partitionAttributeId: number;
  /** @example "Поверхностная масса" */
  partitionAttributeName: string;
  /**
   * Единица измерения; null — без единицы
   * @example "кг/м²"
   */
  partitionAttributeUnit: string | null;
  /** @example "42" */
  partitionAttributeValue: string;
}

export interface PartitionSystemResponseDto {
  /** @example 1 */
  partitionSystemId: number;
  /** @example "Газобетон D600, 200 мм" */
  partitionName: string;
  /**
   * null до публикации
   * @example "Газобетонные блоки D600 с двусторонней штукатуркой"
   */
  partitionDescription: string | null;
  /**
   * Толщина, мм; null до публикации
   * @example 200
   */
  partitionThicknessMm: number | null;
  /**
   * Индекс звукоизоляции Rw, дБ; null до публикации
   * @example 52
   */
  soundIndexRw: number | null;
  /** Подписанная ссылка MinIO на фото (7 дней) */
  partitionPhotoUrl: string | null;
  /** Подписанная ссылка MinIO на видео (7 дней) */
  partitionVideoUrl: string | null;
  /** @example 3 */
  partitionLikesCount: number;
  /**
   * 1 — текущий пользователь поставил лайк (у гостя всегда 0)
   * @example 0
   */
  partitionIsLiked: 0 | 1;
  /**
   * 1 — конструкция текущего пользователя (у гостя всегда 0)
   * @example 1
   */
  partitionIsMine: 0 | 1;
  /** Дополнительные характеристики; [] — нет атрибутов */
  partitionAttributes: PartitionSystemAttributeDto[];
}

export interface PartitionAttributeResponseDto {
  /** @example 1 */
  partitionAttributeId: number;
  /** @example "Поверхностная масса" */
  partitionAttributeName: string;
  /**
   * Единица измерения; null — без единицы
   * @example "кг/м²"
   */
  partitionAttributeUnit: string | null;
}

export interface PartitionAttributeValueDto {
  /**
   * id атрибута из справочника
   * @example 1
   */
  partitionAttributeId: number;
  /**
   * Значение атрибута
   * @maxLength 255
   * @example "42"
   */
  partitionAttributeValue: string;
}

export interface PublishPartitionSystemDto {
  /**
   * Описание конструкции
   * @maxLength 500
   * @example "Газобетонные блоки D600 с двусторонней штукатуркой"
   */
  partitionDescription: string;
  /**
   * Толщина перегородки, мм
   * @min 1
   * @max 1000
   * @example 200
   */
  partitionThicknessMm: number;
  /**
   * Индекс звукоизоляции Rw, дБ
   * @min 0
   * @max 100
   * @example 52
   */
  soundIndexRw: number;
  /** Значения атрибутов из справочника GET /api/partitions/attributes */
  partitionAttributes?: PartitionAttributeValueDto[];
}

export interface PartitionLikeDto {
  /**
   * 1 — поставить лайк, 0 — снять
   * @example 1
   */
  partitionLike: 0 | 1;
}

export interface RegisterPartitionUserDto {
  /**
   * Латиница, цифры и _, от 3 до 50 символов
   * @example "engineer_petrov"
   */
  partitionUserLogin: string;
  /**
   * @maxLength 100
   * @example "Петров Иван"
   */
  partitionUserName: string;
  /**
   * @minLength 6
   * @maxLength 255
   * @example "secret123"
   */
  partitionUserPassword: string;
}

export interface PartitionUserResponseDto {
  /** @example 1 */
  partitionUserId: number;
  /** @example "engineer" */
  partitionUserLogin: string;
  /** @example "Тестовый инженер" */
  partitionUserName: string;
}

export interface LoginPartitionUserDto {
  /**
   * @maxLength 50
   * @example "engineer"
   */
  partitionUserLogin: string;
  /**
   * @maxLength 255
   * @example "engineer123"
   */
  partitionUserPassword: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Partition Insulation API
 * @version 1.0
 * @contact
 *
 * Расчёт звукоизоляции перегородок: конструкции, лента, лайки, пользователи
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  partitions = {
    /**
     * No description
     *
     * @tags partitions
     * @name GetPartitionSystems
     * @summary Список опубликованных конструкций с фильтром по Rw (доступно гостю)
     * @request GET:/api/partitions
     */
    getPartitionSystems: (
      query?: {
        /**
         * Индекс звукоизоляции Rw от, дБ
         * @min 0
         * @max 100
         * @example 45
         */
        rwFrom?: number;
        /**
         * Индекс звукоизоляции Rw до, дБ
         * @min 0
         * @max 100
         * @example 60
         */
        rwTo?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PartitionSystemResponseDto[], void>({
        path: `/api/partitions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partitions
     * @name GetPartitionAttributes
     * @summary Справочник атрибутов конструкции для формы публикации (доступно гостю)
     * @request GET:/api/partitions/attributes
     */
    getPartitionAttributes: (params: RequestParams = {}) =>
      this.request<PartitionAttributeResponseDto[], any>({
        path: `/api/partitions/attributes`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partitions
     * @name GetPartitionFeedFirst
     * @summary Лента: первая опубликованная конструкция (доступно гостю)
     * @request GET:/api/partitions/feed
     */
    getPartitionFeedFirst: (params: RequestParams = {}) =>
      this.request<PartitionSystemResponseDto, void>({
        path: `/api/partitions/feed`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partitions
     * @name GetPartitionFeed
     * @summary Лента: конструкция по id или следующая за ней (next=true), доступно гостю
     * @request GET:/api/partitions/feed/{partitionSystemId}
     */
    getPartitionFeed: (
      partitionSystemId: number,
      query?: {
        /**
         * true — следующая конструкция после указанной (после последней — снова первая); без параметра или false — сама указанная
         * @example true
         */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<PartitionSystemResponseDto, void>({
        path: `/api/partitions/feed/${partitionSystemId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partitions
     * @name GetPartitionDraft
     * @summary Черновик текущего пользователя (только создатель)
     * @request GET:/api/partitions/draft
     * @secure
     */
    getPartitionDraft: (params: RequestParams = {}) =>
      this.request<PartitionSystemResponseDto, void>({
        path: `/api/partitions/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partitions
     * @name CreatePartitionDraft
     * @summary Создание черновика с фото и видео; создатель берётся из сессии (только создатель)
     * @request POST:/api/partitions/draft
     * @secure
     */
    createPartitionDraft: (
      data: {
        /** @example "Газобетон D600, 200 мм" */
        partitionName: string;
        /**
         * Фото конструкции
         * @format binary
         */
        partitionPhoto: File;
        /**
         * Видео конструкции
         * @format binary
         */
        partitionVideo: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<PartitionSystemResponseDto, void>({
        path: `/api/partitions/draft`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partitions
     * @name PublishPartitionDraft
     * @summary Публикация черновика: описание, толщина, Rw и атрибуты (только создатель)
     * @request PUT:/api/partitions/draft/publish
     * @secure
     */
    publishPartitionDraft: (
      data: PublishPartitionSystemDto,
      params: RequestParams = {},
    ) =>
      this.request<PartitionSystemResponseDto, void>({
        path: `/api/partitions/draft/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partitions
     * @name DeletePartitionSystem
     * @summary Удаление своей конструкции: статус removed (только создатель)
     * @request DELETE:/api/partitions/{partitionSystemId}
     * @secure
     */
    deletePartitionSystem: (
      partitionSystemId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/partitions/${partitionSystemId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags partitions
     * @name LikePartitionSystem
     * @summary Лайк опубликованной конструкции: 1 — поставить, 0 — снять (только создатель)
     * @request POST:/api/partitions/{partitionSystemId}/like
     * @secure
     */
    likePartitionSystem: (
      partitionSystemId: number,
      data: PartitionLikeDto,
      params: RequestParams = {},
    ) =>
      this.request<PartitionSystemResponseDto, void>({
        path: `/api/partitions/${partitionSystemId}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  partitionUsers = {
    /**
     * No description
     *
     * @tags partition-users
     * @name RegisterPartitionUser
     * @summary Регистрация пользователя
     * @request POST:/api/partition-users/register
     */
    registerPartitionUser: (
      data: RegisterPartitionUserDto,
      params: RequestParams = {},
    ) =>
      this.request<PartitionUserResponseDto, void>({
        path: `/api/partition-users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partition-users
     * @name LoginPartitionUser
     * @summary Аутентификация: создаёт сессию в Redis и ставит куку partitionSessionId
     * @request POST:/api/partition-users/login
     */
    loginPartitionUser: (
      data: LoginPartitionUserDto,
      params: RequestParams = {},
    ) =>
      this.request<PartitionUserResponseDto, void>({
        path: `/api/partition-users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partition-users
     * @name LogoutPartitionUser
     * @summary Деавторизация: удаляет сессию из Redis и очищает куку
     * @request POST:/api/partition-users/logout
     * @secure
     */
    logoutPartitionUser: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/partition-users/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}
