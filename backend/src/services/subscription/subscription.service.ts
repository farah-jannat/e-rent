import { Pricing } from "@/constant";
import type { SqlDB } from "@/db";
import type { ILandlordService, IPaymentService, ISubscriptionService } from "@/interfaces";
import { type Landlord } from "@/schemas";
import type { SubscriptionInput } from "@/validations/subscription.validation";

export class SubscriptionService implements ISubscriptionService {
  constructor(
    public db: SqlDB,
    public landlordService: ILandlordService,
    public paymentService: IPaymentService,
  ) {}

  async subscribe(landlordId: string, formData: SubscriptionInput) {
    await this.db.transaction(async (tx) => {
      // 1. Get the landlord
      const landlord = await this.landlordService.findById(landlordId);
      if (!landlord) throw new Error("Landlord not found");

      // 3. Calculate Cost (For your payment gateway/invoice)
      const basePrice = Pricing[formData.plan] * formData.durationMonths;
      // const finalPrice = basePrice * (1 - discounts[durationMonths]);
      const finalPrice = basePrice;

      const now = new Date();

      // Convert duration (3) into milliseconds: 3 * 60 * 1000
      const addedTimeMs = formData.durationMonths * 60 * 1000;

      const { startDate, endDate } = this.findDates(landlord, addedTimeMs);

      await this.landlordService.updateLandlordPlan(landlordId, {
        plan: formData.plan,
        quotaLimit: formData.plan === "standard" ? 10 : 999999,
        subscriptionExpiresAt: endDate,
        status: "active",
      });

      // 4. Record Transaction History
      const paymentData = {
        landlordId: landlordId,
        planName: formData.plan,
        durationMonths: formData.durationMonths,
        amountPaid: finalPrice,
        transactionId: crypto.randomUUID(),
        startDate: startDate,
        endDate: endDate,
      };

      await this.paymentService.create(paymentData);

      // return { finalPrice, newExpiry };
    });
  }

  findDates(landlord: Landlord, addedTimeMs: number) {
    const now = new Date();
    let startDate = now;
    let newExpiry: Date;

    if (landlord.subscriptionExpiresAt && landlord.subscriptionExpiresAt > now) {
      // If still active, extend from current expiry
      startDate = new Date(landlord.subscriptionExpiresAt);
      newExpiry = new Date(startDate.getTime() + addedTimeMs);
    } else {
      // If expired or new, start from exactly right now
      startDate = now;
      newExpiry = new Date(now.getTime() + addedTimeMs);
    }

    return { startDate: startDate, endDate: newExpiry };
  }
}
