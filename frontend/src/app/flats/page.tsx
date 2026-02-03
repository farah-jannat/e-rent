"use client";
import { useFlatsQuery,} from "@/features/flat/queries/use-flats.query";
import { Delete } from "lucide-react";
import React from "react";

const Flats = () => {
  //---*Queries *---
  const { data, isPending, error } = useFlatsQuery();

  
  //---* Mutation *---
  // const {} = 

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
