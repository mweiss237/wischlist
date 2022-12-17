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

    const data: ApiRepsonse<T[]> = await response.json();
    return data;
  };

  public add = async (entry: Omit<T, "id">) => {
    const response = await fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify({ ...entry }),
    });

    const data: ApiRepsonse<T> = await response.json();
    return data;
  };

  public update = async (id: string, updated: Partial<T>) => {
    const response = await fetch(this.endpoint, {
      method: "PUT",
      body: JSON.stringify({ id, ...updated }),
    });

    const data: ApiRepsonse<T> = await response.json();
    return data;
  };

  public delete = async (id: string) => {
    const response: Response = await fetch(this.endpoint, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    const data: ApiRepsonse<T> = await response.json();
    return data;
  };

  // private error = (status?: number, message?: string) => {
  //   return {
  //     status: status || 500,
  //     message: message || "unknown error",
  //   };
  // };
}
