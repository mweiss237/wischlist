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

  const addCallback = (wish: { id: string; wish: string }) =>
    setWishes([...wishes, wish]);
  const deleteCallback = (id: string) => {
    console.log(wishes.filter((wish) => wish.id !== id));
    console.log(wishes);
    setWishes(wishes.filter((wish) => wish.id !== id));
  };
  const changeCallback = (id: string, value: string) => {
    setWishes(
      wishes.map((entry) => {
        if (entry.id === id) entry.wish = value;
        return entry;
      })
    );
  };

  return (
    <div className={styles.list}>
      {wishes.map((wish, index) => (
        <Card
          key={`w_${wish.id}`}
          id={wish.id}
          value={wish.wish}
          onDelete={deleteCallback}
          onChange={changeCallback}
        />
      ))}
      <AddCard callback={addCallback} />
    </div>
  );
};

export default List;
