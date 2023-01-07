import { wishClient } from "lib/client/wishClient"
import { useEffect, useState } from "react"
import { Wish } from "types/Wish"
import styles from "./Checklist.module.scss"
import ChecklistEntry from "./ChecklistEntry"
import { Indie_Flower } from "@next/font/google"

const indieFlower = Indie_Flower({ weight: "400", subsets: ["latin"] })

interface ChecklistParams {}

const Checklist = (props: ChecklistParams) => {
  const [wishes, setWishes] = useState<Wish[]>([])

  useEffect(() => {
    wishClient.get().then((response) => {
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
      <div className={styles.checklist}>
        {wishes.map((wish) => (
          <ChecklistEntry
            id={wish.id}
            title={wish.wish}
            key={`wish${wish.id}`}
          />
        ))}
      </div>
    </>
  )
}

export default Checklist
