"use client"
import Loading from "components/Loading/Loading"
import { ClientHelper } from "lib/client/ClientHelper"
import { userClient } from "lib/client/userClient"
import { useLists } from "lib/hooks/useLists"
import useUser from "lib/hooks/useUser"
import Link from "next/link"
import React from "react"
import { useState } from "react"
import { List } from "types"
import styles from "./ListOverview.module.scss"

const ListOverview = () => {
  const { user, loading, validating } = useUser({
    redirectTo: "/login",
    redirectIfFound: false,
  })
  const [isLoading, setLoading] = useState(false)
  const { lists, mutateLists } = useLists(user?.id || "")

  const listClient = new ClientHelper<List>(`/api/lists`)

  if (!user && (loading || validating)) {
    return <p>Not logged in. Redirecting...</p>
  }

  const handleAddList = async () => {
    return alert("not yet!")

    // if (user && user.id) {
    //   const added = await (
    //     await listClient.add({ title: "new list", wishes: [] })
    //   ).result
    //   const response = await mutateLists([...(lists || []), added])
    //   // added.id

    //   if (response) userClient.update(user.id, { lists: response })
    //   console.log(JSON.stringify(response))
    // }
  }

  return (
    <div className={styles.list}>
      {loading ? (
        <Loading />
      ) : user?.isLoggedIn ? (
        <>
          <div>
            {lists?.map((list) => (
              <a
                className={styles.listLink}
                href={`/list/${list.id}`}
                key={`list_${list.id}`}
                id={list.id}
              >
                {list.title}
              </a>
            ))}
          </div>
          <button className={styles.addEntry} onClick={handleAddList}>
            <span>+</span>
          </button>
        </>
      ) : (
        <p>
          <Link href="/login">Logge dich ein</Link>, um deine Liste sehen zu
          können.
        </p>
      )}
    </div>
  )
}

export default ListOverview
