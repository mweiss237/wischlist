import AddCard from "components/AddCard/AddCard";
import Card from "components/Card/Card";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Wish, wishDB } from "lib/wish";
import React from "react";
import { useState } from "react";
import styles from "./List.module.css";

type ListParams = {};

const List = (props: ListParams) => {
  const [wishes, setWishes] = useState<any[]>();
  React.useEffect(() => {
    wishDB.getAll().then((value) => setWishes(value.docs));
  }, []);
  return (
    <div className={styles.list}>
      {wishes?.map((wish, index) => (
        <Card
          key={`w_${index}`}
          id={wish.id}
          value={wish.get("wish")}
          document={wish}
        />
      ))}
      <AddCard />
    </div>
  );
};

export default List;
