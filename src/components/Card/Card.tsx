"use client";

import { wishClient } from "lib/client/wishClient";
import Image from "next/image";
import React from "react";
import styles from "./Card.module.scss";

type CardParams = {
  id: string;
  value?: string;
  onDelete: (id: string) => void;
  onChange: (id: string, value: string) => void;
};

const Card = ({ id, value = "", onDelete, onChange }: CardParams) => {
  const [pristine, setPristine] = React.useState(false);
  const handler = {
    save: () => {
      wishClient.update(id, { wish: value }).then((response) => {
        if (!response.success) return alert(`FEHLER: ${response.message}`);
        console.log(`entry ${id} saved`);
      });
      setPristine(false);
    },
    change: (changedValue: string) => {
      setPristine(value === changedValue ? false : true);
      onChange(id, changedValue);
    },
    remove: () => {
      const doDelete = confirm("Eintrag von der Liste löschen?");
      if (doDelete) {
        onDelete(id);
        wishClient.delete(id).then((response) => {
          if (!response.success) return alert(`FEHLER: ${response.message}`);
          console.log(`entry ${id} deleted`);
        });
      }
    },
  };
  return (
    <div className={styles.cardWrapper}>
      <button className={styles.deleteWish} onClick={handler.remove}>
        <Image
          src={"/close.svg"}
          fill
          unoptimized
          loading={"eager"}
          alt="Löschen"
        />
      </button>
      <textarea
        onChange={({ target: { value } }) => handler.change(value)}
        className={styles.card}
        placeholder="Ich wünsche mir..."
        defaultValue={value}
      ></textarea>
      <button
        className={`${styles.saveWish} ${pristine ? styles.active : ""}`}
        onClick={handler.save}
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
