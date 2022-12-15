"use client";

import React from "react";
import styles from "./AddCard.module.scss";

interface AddCardParams {
  callback: (value: { id: string; wish?: string }) => void;
}

const AddCard = ({ callback }: AddCardParams) => {
  const [isLoading, setLoading] = React.useState(false);

  const addEmptyCard = () => {
    alert("TODO!")
    // setLoading(true);
    // wishDB.add({ wish: "" }).then(async (wish) => {
    //   callback(wish);
    //   setLoading(false);
    // });
  };
  return (
    <button
      className={`${styles["add-note"]}`}
      disabled={isLoading}
      type="button"
      onClick={addEmptyCard}
    >
      +
    </button>
  );
};

export default AddCard;
