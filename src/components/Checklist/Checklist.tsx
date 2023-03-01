import { useEffect, useState } from "react"
import { Wish } from "types/Wish"
import styles from "./Checklist.module.scss"
import ChecklistEntry from "./ChecklistEntry"
import { Indie_Flower } from "@next/font/google"
import Loading from "components/Loading/Loading"
import { ClientHelper } from "lib/client/ClientHelper"

const indieFlower = Indie_Flower({ weight: "400", subsets: ["latin"] })

interface ChecklistParams {
  params: {
    listId: string
  }
}

const Checklist = ({ params }: ChecklistParams) => {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const wishClient = new ClientHelper<Wish>(
    `/api/lists/${params.listId}/wishes`
  )

  useEffect(() => {
    setLoading(true)
    wishClient.get().then((response) => {
      setLoading(false)
      if (response.success) setWishes(response.result)
    })
  }, [])

  return (
    <>
      <h1
        className={`crit_header_title ${styles.headline} ${indieFlower.className}`}
      >
        Ich wünsche mir...
      </h1>
      <div className={styles.checklist_wrapper}>
        {isLoading && (
          <div className="crit_centered">
            <Loading />
          </div>
        )}
        <div className={styles.checklist}>
          {wishes.map((wish) => (
            <ChecklistEntry
              id={wish.id}
              title={wish.wish}
              key={`wish${wish.id}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Checklist
