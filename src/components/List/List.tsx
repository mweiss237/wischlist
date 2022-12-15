import AddCard from "components/AddCard/AddCard";
import Card from "components/Card/Card";
import { Wish } from "lib/api/wish";
import { wishClient } from "lib/client/wishes";
import React from "react";
import { useState } from "react";
import styles from "./List.module.scss";

const List = () => {
  const [wishes, setWishes] = useState<{ id: string; wish?: string }[]>([]);
  React.useEffect(() => {
    // const response = fetch("/api/wishes");
    // response.then(async (value) => {
      // const wishResponse: ApiRepsonse<Wish[]> = await value.json();
      wishClient.get().then(response => {
        setWishes(response.result);
      })
    // });
  }, []);

  const addCallback = (wish: { id: string; wish?: string }) =>
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
