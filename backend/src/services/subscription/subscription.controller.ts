import type { ISubscriptionService } from "@/interfaces";
import { NotAuthorizedError } from "@fvoid/shared-lib";
import type { Request, Response } from "express";

export class SubscriptionController {
  constructor(public subscriptionService: ISubscriptionService) {}

  subscribe = async (req: Request, res: Response) => {
    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    await this.subscriptionService.subscribe(landlord.id, req.body);

    // return response
    return res.json({ msg: "purchased successfully" });
  };
}
