import { Wish } from "lib/api/wish";
import ApiRepsonse from "types/ApiResponse";

export class ClientHelper<T> {
  private endpoint;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public get = async (id?: string) => {
    const body = id ? { id } : undefined;
    const response: Response = await fetch(this.endpoint, {
      body: JSON.stringify(body),
    });

    const data: ApiRepsonse<Wish[]> = await response.json();
    return data;
  };

  private error = (status?: number, message?: string) => {
    return {
      status: status || 500,
      message: message || "unknown error",
    };
  };
}