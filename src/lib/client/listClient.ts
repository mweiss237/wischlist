import { List } from "types"
import { ClientHelper } from "./ClientHelper"

export const listClient = new ClientHelper<List>(`/api/lists/`)
