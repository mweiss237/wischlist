import Card from "components/Card/Card";
import styles from "./List.module.css";

type ListParams = {};

const List = (props: ListParams) => {
  return (
    <div className={styles.list}>
      <Card />
      <Card />
      <Card />
      <Card />
    </div>
  );
};

export default List;
