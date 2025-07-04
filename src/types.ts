export enum method {
  GET = "GET",
  POST = "POST",
  PUTH = "PUTH",
  DELETE = "DELETE",
}

export enum contentType {
  ApplicationJson = "application/json",
}

export interface Options {
  method: method;
  headers: {
    "Content-Type": contentType;
  };
  body: string;
}