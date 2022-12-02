"use client";

import { addWish } from "lib/wish";
import styles from "./AddCard.module.css";

type AddCardParams = {};

const addEmptyCard = async () => {
    const res = await addWish("")
    console.log(res)
    debugger;
};

const AddCard = (props: AddCardParams) => {
  return (
    <button
      className={styles["add-note"]}
      type="button"
      onClick={addEmptyCard}
    >
      +
    </button>
  );
};

export default AddCard;
