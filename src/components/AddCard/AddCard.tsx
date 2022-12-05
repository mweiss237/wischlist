import { wishDB } from "lib/wish";
import styles from "./AddCard.module.css";

type AddCardParams = {};

const addEmptyCard = () => {
  wishDB.add({ wish: "" });
};

const AddCard = (props: AddCardParams) => {
  return (
    <button className={styles["add-note"]} type="button" onClick={addEmptyCard}>
      +
    </button>
  );
};

export default AddCard;
