export default interface ApiRepsonse<T> {
  success: boolean;
  message?: string;
  result: T;
}

export type HTTPMethods = "GET" | "PUT" | "POST" | "DELETE";
