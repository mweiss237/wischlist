"use client";

import { wishDB } from "lib/wish";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./Card.module.css";

type CardParams = {
  id: string;
  value: string;
  onDelete: (id: string) => void;
  onChange: (id: string, value: string) => void;
};

const Card = ({ id, value = "", onDelete, onChange }: CardParams) => {
  const router = useRouter();
  const [pristine, setPristine] = React.useState(false);
  const [wish, setWish] = React.useState(value);
  const handler = {
    submit: () => {
      wishDB.update(id, { wish }).then(() => {
        router.refresh();
      });
      setPristine(false);
    },
    change: (changedValue: string) => {
      setPristine(value === changedValue ? false : true);
      setWish(changedValue);
      onChange(id, changedValue);
    },
    remove: () => {
      const doDelete = confirm("Eintrag von der Liste löschen?");
      if (doDelete) {
        wishDB.delete(id).then(() => {
          router.refresh();
          onDelete(id);
        });
      }
    },
  };
  return (
    <div className={styles.cardWrapper}>
      <button className={styles.deleteWish} onClick={handler.remove}>
        +
      </button>
      <textarea
        onChange={({ target: { value } }) => handler.change(value)}
        className={styles.card}
        placeholder="Ich wünsche mir..."
        defaultValue={value}
      ></textarea>
      <button
        className={`${styles.saveWish} ${pristine ? styles.active : ""}`}
        onClick={handler.submit}
      >
        <Image
          src={"/save.svg"}
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
