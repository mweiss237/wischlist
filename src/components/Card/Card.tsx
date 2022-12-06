"use client";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { Wish, wishDB } from "lib/wish";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./Card.module.css";

type CardParams = {
  id: string;
  value: string;
  document: QueryDocumentSnapshot<Wish>;
};

const Card = ({ id, value = "", document }: CardParams) => {
  const router = useRouter();
  const [pristine, setPristine] = React.useState(false);
  const [wish, setWish] = React.useState(value);
  const handler = {
    submit: () => {
      wishDB.update(document.ref, { wish }).then(() => {
        router.refresh()
      });
      setPristine(false);
    },
    change: (changedValue: string) => {
      setPristine(value === changedValue ? false : true);
      setWish(changedValue);
    },
    remove: () => {
      const doDelete = confirm("Wunsch von der Liste löschen?");
      if (doDelete) {
        wishDB.delete(document.ref).then(() => {
          router.refresh()
        })
      }
    },
  };
  return (
    <div className={styles.cardWrapper}>
      <textarea
        onChange={({ target: { value } }) => handler.change(value)}
        onDoubleClick={() => handler.remove()}
        className={styles.card}
        placeholder="Ich wünsche mir..."
      >
        {value}
      </textarea>
      <button
        className={`${styles.saveWish} ${pristine ? styles.active : ""}`}
        onClick={handler.submit}
      >
        <Image
          src={"/save.png"}
          alt="Speichern"
          height={30}
          width={30}
          unoptimized
          loading="eager"
        />
      </button>
    </div>
  );
};

export default Card;
