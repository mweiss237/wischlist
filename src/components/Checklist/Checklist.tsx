import { wishClient } from "lib/client/wishClient"
import { useEffect, useState } from "react"
import { Wish } from "types/Wish"
import styles from "./Checklist.module.scss"
import ChecklistEntry from "./ChecklistEntry"

interface ChecklistParams {}

const Checklist = (props: ChecklistParams) => {
  const [wishes, setWishes] = useState<Wish[]>([])

  useEffect(() => {
    wishClient.get().then((response) => {
      if (response.success) setWishes(response.result)
    })
  }, [])

  return (
    <div className={styles.checklist}>
      {wishes.map((wish) => (
        <ChecklistEntry id={wish.id} title={wish.wish} key={`wish${wish.id}`} />
      ))}
    </div>
  )
}

export default Checklist
