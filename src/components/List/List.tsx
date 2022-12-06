import AddCard from "components/AddCard/AddCard";
import Card from "components/Card/Card";
import { wishDB } from "lib/wish";
import React from "react";
import { useState } from "react";
import styles from "./List.module.css";

const List = () => {
  const [wishes, setWishes] = useState<{ id: string; wish: string }[]>([]);
  React.useEffect(() => {
    wishDB.getAll().then((value) => setWishes(value));
  }, []);
  return (
    <div className={styles.list}>
      {wishes.map((wish, index) => (
        <Card key={`w_${index}`} id={wish.id} value={wish.wish} />
      ))}
      <AddCard />
    </div>
  );
};

export default List;
