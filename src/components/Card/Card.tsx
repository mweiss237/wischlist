import { QueryDocumentSnapshot } from "firebase/firestore";
import { Wish, wishDB } from "lib/wish";
import Image from "next/image";
import React from "react";
import styles from "./Card.module.css";

type CardParams = {
  id: string;
  value: string;
  document: QueryDocumentSnapshot<Wish>;
};

const Card = ({ id, value = "", document }: CardParams) => {
  const [pristine, setPristine] = React.useState(false);
  const [wish, setWish] = React.useState(value);
  const handleSubmit = () => {
    wishDB.update(document.ref, { wish });
    setPristine(false);
  };
  const handleChange = (changedValue: string) => {
    setPristine(value === changedValue ? false : true);
    setWish(changedValue);
  };
  return (
    <div className={styles.cardWrapper}>
      <textarea
        onChange={({ target: { value } }) => handleChange(value)}
        className={styles.card}
        placeholder="Ich wünsche mir..."
      >
        {value}
      </textarea>
      <button
        className={`${styles.saveWish} ${pristine ? styles.active : ""}`}
        onClick={handleSubmit}
      >
        <Image
          src={"/save.png"}
          alt="Speichern"
          height={30}
          width={30}
          unoptimized
        />
      </button>
    </div>
  );
};

export default Card;
