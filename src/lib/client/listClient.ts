import { Wish } from "types/Wish"
import { ClientHelper } from "./ClientHelper"

export const wishClient = new ClientHelper<Wish>(`/api/wishes`)
