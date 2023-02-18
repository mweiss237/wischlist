import useSWR from "swr"
import { List } from "types"

export const useLists = (userId: string = "") => {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data: lists, mutate: mutateLists } = useSWR<List[]>(
    [`/api/user/${userId}/lists`],
    fetcher
  )

  return { lists, mutateLists }
}
