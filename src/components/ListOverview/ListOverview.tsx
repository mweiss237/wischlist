"use client"
import Loading from "components/Loading/Loading"
import { useUser } from "lib/auth"
import { useLists } from "lib/lists"


import Link from "next/link"
import React from "react"
import styles from "./ListOverview.module.scss"

const ListOverview = () => {
  const { user, loading } = useUser()


  const { lists, addList } = useLists()


  if (loading) return <Loading />

 

  const handleAddList = async () => {
    const listName = prompt("Bitte listennamen eingeben:", "neue Liste")
    if (listName)
      addList(listName)
  }

  if (loading) return <Loading />

  const computeAccent = (id: string) => {
    let h = 0
    for (let i = 0; i < id.length; i++) {
      h = (h * 31 + id.charCodeAt(i)) % 360
    }
    return `hsl(${h}, 65%, 55%)`
  }

  return (
    <div className={styles.listWrap}>
      {user ? (
        <>
          <div className={styles.grid}>
            {lists && Object.keys(lists)?.map((listId) => {
              const list = lists[listId]
              const accent = computeAccent(listId)
              const style = { ['--accent' as any]: accent } as React.CSSProperties

              return (
                <Link
                  href={`/list/${listId}`}
                  key={`list_${listId}`}
                  id={listId}
                  className={styles.card}
                  style={style}
                >
                  <div className={styles.cardHeader} aria-hidden>
                    <div className={styles.emoji}>🎁</div>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.title}>{list.title}</h3>
                    <div className={styles.meta}>
                      <span className={styles.badge}>{list.options?.isShared ? 'Geteilt' : 'Entwurf'}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <button className={styles.addEntry} onClick={handleAddList} aria-label="Add list">
            <span>+</span>
          </button>
        </>
      ) : (
        <p>
          <Link href="/auth">Logge dich ein</Link>, um deine Liste sehen zu
          können.
        </p>
      )}
    </div>
  )
}

export default ListOverview
