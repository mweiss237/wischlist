import { User } from "types/User";
import { ClientHelper } from "./ClientHelper";

export const userClient = new ClientHelper<User>(`/api/wishes`);
