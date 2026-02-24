"use client"
import { subscribe } from "@/features/subscription/api/mutation.api";
import useSubscribeMutation from "@/features/subscription/mutations/use-subscribe.mutation";
import React from "react";

const Subscription = () => {
    const {mutate:subscribe} = useSubscribeMutation()


  return (
    <div className="mx-[100px] my-[50px]">
      Subscription
      <p onClick={() => subscribe("free")}>free</p>
      <p onClick={() => subscribe("standard")}>standard</p>
      
      <p onClick={() => subscribe("premium")}>premium</p>
    </div>
  );
};

export default Subscription;
