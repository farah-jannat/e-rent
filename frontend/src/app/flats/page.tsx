"use client";
import { useJobQuery } from "@/features/flat/queries/use-jobs.query";
import { Delete } from "lucide-react";
import React from "react";

const Flats = () => {
  //---*Queries *---
  const { data, isPending, error } = useJobQuery();

  return (
    <div className="mx-[100px] my-[50px]">
      <p>all flats datas</p>
      {data &&
        data.flats?.map((flat) => (
          <div
            className="flex items-center "
            key={flat.id}
          >
            <p> {flat?.name}</p>{" "}
            <div>
              <Delete />
            </div>
          </div>
        ))}
    </div>
  );
};

export default Flats;
