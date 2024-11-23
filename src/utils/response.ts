import { Response } from "express";
import { statuses } from "../config/statuses";

export interface IJSONError {
  code?: number | string;
  message?: string;
  name?: string;
}

export interface IJSONMetaResponse {
  limit?: number;
  skip?: number;
  offset?: number;
  fields?: string;
  sort?: string;
  search?: string;
  total?: number;
}

export interface IJSONBuilder<T> {
  setData(data: T): this;
  setStatus(status: boolean): this;
  setMeta(...metaEntry: IJSONMetaResponse[]): this;
  setError(errors: IJSONError[]): this;
  build(): Response;
  setResponse(response: Response): this;
  setResponseStatus(status: number): this;
}

// tslint:disable
export class JSONResponse<T> {
  private status: boolean;
  private result?: T;
  private meta?: IJSONMetaResponse;
  private errors?: IJSONError[];

  constructor() {
    this.status = true;
    this.meta = {};
  }
}

export class ResponseBuilder<T> implements IJSONBuilder<T> {
  private responseObject: JSONResponse<T>;
  private response!: Response;

  constructor() {
    this.responseObject = new JSONResponse<T>();
  }

  public setData(data: T): this {
    Object.assign(this.responseObject as JSONResponse<T>, {
      result: data,
    });

    return this;
  }

  public setStatus(status: boolean): this {
    Object.assign(this.responseObject, {
      status,
    });

    return this;
  }

  public setMeta(...metaEntry: IJSONMetaResponse[]): this {
    Object.assign(this.responseObject, {
      meta: Object.assign({}, ...this.clearEntry(metaEntry)),
    });
    return this;
  }

  public setError(errors: IJSONError[]): this {
    Object.assign(this.responseObject, {
      errors,
    });

    return this;
  }

  public setResponse(response: Response): this {
    this.response = response;

    return this;
  }

  public setResponseStatus(status: number): this {
    this.response.status(status);

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public build() {
    return this.response.json(this.responseObject);
  }

  private clearEntry(metaData: IJSONMetaResponse[]): IJSONMetaResponse[] {
    return metaData.map((meta: IJSONMetaResponse) => {
      if (meta.limit === undefined)
        delete meta.limit;
      if (meta.skip === undefined)
        delete meta.skip;
      if (meta.offset === undefined)
        delete meta.offset;
      if (meta.fields === undefined)
        delete meta.fields;
      if (meta.sort === undefined)
        delete meta.sort;
      if (meta.search === undefined)
        delete meta.search;
      if (meta.total === undefined)
        delete meta.total;
      return meta;
    });
  }
}

export function successResponse(
  response: Response,
  status: number = statuses.success,
): Response {
  return new ResponseBuilder<unknown>()
    .setStatus(true)
    .setResponse(response)
    .setResponseStatus(status)
    .build();
}

export function errorResponse(
  response: Response,
  status: number = statuses.server_error,
  errors: Error[]
): Response {
  const errorResult: IJSONError[] = [];

  errors.map((error: Error) => {
    if ("name" in error) {
      errorResult.push({
        code: error.name.toUpperCase(),
        message: error.message,
      });
    } else {
      errorResult.push(error);
    }
  });

  return new ResponseBuilder<unknown>()
    .setStatus(false)
    .setResponse(response)
    .setResponseStatus(status)
    .setError(errorResult)
    .build();
}
