"use client";

import { saveWish } from "lib/wish";
import styles from "./AddCard.module.css";

type AddCardParams = {};

const addEmptyCard = async () => {
    const res = await saveWish("")
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
