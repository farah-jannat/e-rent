import type { IStatisticsService } from "@/interfaces";
import { NotAuthorizedError } from "@fvoid/shared-lib";
import type { Request, Response } from "express";

export class SubscriptionController {
  constructor(public subscriptionService: IStatisticsService) {}

  subscribe = async (req: Request, res: Response) => {
    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    // let { interval, tenantId, page, limit } = req.query;
    let { interval, page, limit } = req.query;

    // Pagination parameters
    // const parsedPage = typeof page === "string" ? parseInt(page, 10) : 1;
    // const parsedLimit = typeof limit === "string" ? parseInt(limit, 10) : 10;
    // const offset = (parsedPage - 1) * parsedLimit;

    const rentPayment = await this.subscriptionService.due(landlord.id, interval as "year" | "month");

    // return response
    return res.json(rentPayment);
  };
}
