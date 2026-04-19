import type { SqlDB } from "@/db";
import type { IPaymentService } from "@/interfaces";
import { payments } from "@/schemas";
import type { InsertPaymentInput } from "@/validations/payment.validation";
import { catchError } from "@fvoid/shared-lib";

export class PaymentService implements IPaymentService {
  constructor(public db: SqlDB) {}

  async create(formData: InsertPaymentInput) {
    const [insertError, payment] = await catchError(
      this.db
        .insert(payments)
        .values(formData)
        .returning()
        .then((res) => res[0]),
    );

    if (insertError) throw new Error("Error creating payment!");
    return payment;
  }
}
