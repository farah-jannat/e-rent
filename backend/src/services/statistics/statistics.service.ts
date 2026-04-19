import type { SqlDB } from "@/db";
import type { ILandlordService, IPaymentService, IStatisticsService } from "@/interfaces";
import { rentPayment } from "@/schemas";
import { and, eq, like } from "drizzle-orm";

export class StatisticsService implements IStatisticsService {
  constructor(
    public db: SqlDB,
    public landlordService: ILandlordService,
    public paymentService: IPaymentService,
  ) {}

  async due(landlordId: string, interval: "year" | "month") {
    const now = new Date();
    const currentYear = now.getFullYear().toString(); // "2026"
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0"); // "04"

    const conditions = [];

    // Always filter by landlord to ensure data privacy
    conditions.push(eq(rentPayment.landlordId, landlordId));

    if (interval === "year") {
      // Matches any string starting with "2026-"
      conditions.push(like(rentPayment.billingMonth, `${currentYear}-%`));
    } else if (interval === "month") {
      // Matches the exact string "2026-04"
      conditions.push(eq(rentPayment.billingMonth, `${currentYear}-${currentMonth}`));
    }

    const results = await this.db
      .select()
      .from(rentPayment)
      .where(and(...conditions));

    return results;
  }

  async duebyTenant(landlordId: string, tenantId: string, interval: "year" | "month") {
    const now = new Date();
    const currentYear = now.getFullYear().toString(); // "2026"
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0"); // "04"

    const conditions = [];

    // Always filter by landlord to ensure data privacy
    conditions.push(eq(rentPayment.landlordId, landlordId));
    conditions.push(eq(rentPayment.tenantId, tenantId));

    if (interval === "year") {
      // Matches any string starting with "2026-"
      conditions.push(like(rentPayment.billingMonth, `${currentYear}-%`));
    } else if (interval === "month") {
      // Matches the exact string "2026-04"
      conditions.push(eq(rentPayment.billingMonth, `${currentYear}-${currentMonth}`));
    }

    const results = await this.db
      .select()
      .from(rentPayment)
      .where(and(...conditions));

    return results;
  }
}
