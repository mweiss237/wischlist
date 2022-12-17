import AddCard from "components/AddCard/AddCard";
import Card from "components/Card/Card";
import { wishClient } from "lib/client/wishClient";
import React from "react";
import { useState } from "react";
import styles from "./List.module.scss";

const List = () => {
  const [wishes, setWishes] = useState<{ id: string; wish?: string }[]>([]);
  React.useEffect(() => {
    wishClient.get().then((response) => {
      setWishes(response.result);
    });
  }, []);

  const addCallback = (wish: { id: string; wish?: string }) =>
    setWishes([...wishes, wish]);
  const deleteCallback = (id: string) => {
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
      {wishes.map((wish) => (
        <Card
          key={`wish_${wish.id}`}
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
