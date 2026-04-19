import type { SqlDB } from "@/db";
import type { ILandlordService } from "@/interfaces";
import { landlords, type Landlord } from "@/schemas";
import type { RegisterLandlordInput, UpdateLandlordPlanInput } from "@/validations/landlord.validation";
import { catchError } from "@fvoid/shared-lib";
import { eq } from "drizzle-orm";

export class LandlordService implements ILandlordService {
  constructor(public db: SqlDB) {}

  async findByEmail(email: string) {
    const [landlordError, landlord] = await catchError(
      this.db.query.landlords.findFirst({
        where: eq(landlords.email, email),
      }),
    );

    if (landlordError) throw new Error("DB error!");
    return landlord;
  }

  async findById(id: string) {
    const [landlordError, landlord] = await catchError(
      this.db.query.landlords.findFirst({
        where: eq(landlords.id, id),
      }),
    );

    if (landlordError) throw new Error("DB error!");
    return landlord;
  }

  async create(input: RegisterLandlordInput) {
    const [insertLandlordError, insertLandlord] = await catchError(
      this.db
        .insert(landlords)
        .values(input)
        .returning()
        .then((res) => res[0]),
    );
    if (insertLandlordError) throw new Error("Db error inserting");
    return insertLandlord;
  }

  async updateLandlordPlan(landlordId: string, input: UpdateLandlordPlanInput) {
    const [err, updatedLandlord] = await catchError(
      this.db
        .update(landlords)
        .set(input)
        .where(eq(landlords.id, landlordId))
        .returning()
        .then((res) => res[0]),
    );

    if (err) throw new Error("Db error upating");

    return updatedLandlord;
  }
}
