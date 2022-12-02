"use client";

import AddCard from "components/AddCard/AddCard";
import Card from "components/Card/Card";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { getWishes } from "lib/wish";
import React from "react";
import { useState } from "react";
import styles from "./List.module.css";

type ListParams = {};

const List = (props: ListParams) => {
  const [wishes, setWishes] = useState<QueryDocumentSnapshot<DocumentData>[]>();
  React.useEffect(() => {
    getWishes().then((value) => setWishes(value));
  }, []);
  return (
    <div className={styles.list}>
      {wishes?.map((wish, index) => (
        <Card key={`w_${index}`} id={wish.id} value={wish.get("wish")} />
      ))}
      <AddCard />
    </div>
  );
};

export default List;
