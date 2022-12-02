import React from "react";
import styles from "./Card.module.css";

type CardParams = {
  id: string;
  value: string;
};

const Card = ({ id, value = "" }: CardParams) => {
  const [pristine, setPristine] = React.useState(false);
  return (
    <div className={styles.cardWrapper}>
      <textarea
        onChange={() => setPristine(true)}
        className={styles.card}
        placeholder="Ich wünsche mir..."
      >
        {value}
      </textarea>
      <button className={`${styles.saveWish} ${pristine ? styles.active : ""}`}>
        +
      </button>
    </div>
  );
};

export default Card;
