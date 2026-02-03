"use client";
import { deleteFlat } from "@/features/flat/api/mutation.api";
import useFlatDeleteMutation from "@/features/flat/mutations/use-flat-delete.mutation";
import { useFlatsQuery,} from "@/features/flat/queries/use-flats.query";
import { Delete } from "lucide-react";
import React from "react";

const Flats = () => {
  //---*Queries *---
  const { data, isPending, error } = useFlatsQuery();

  
  //---* Mutation *---
  const {mutate:deleteFlat} = useFlatDeleteMutation() 

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
            <div onClick={()=>deleteFlat(flat.id)}>
              <Delete />
            </div>
          </div>
        ))}
    </div>
  );
};

export default Flats;
