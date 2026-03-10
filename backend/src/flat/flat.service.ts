import type { SqlDB } from "@/db";
import type { IFlatService } from "@/interfaces";
import { flats, landlords, type Landlord } from "@/schemas";
import type { RegisterFlatInput } from "@/validations/flat.validation";
import { catchError } from "@fvoid/shared-lib";
import { and, eq, sql } from "drizzle-orm";

export class FlatService implements IFlatService {
  constructor(public db: SqlDB) {}

  async findOne(flatName: string, landlordId: string) {
    const [flatError, flat] = await catchError(
      this.db.query.flats.findFirst({
        where: and(eq(flats.name, flatName), eq(flats.landlordId, landlordId)),
      }),
    );
    if (flatError) throw new Error("DB error!");
    // if (flat) throw new Error("this flat already exist");
    return flat;
  }

  async findAll(landlordId: string) {
    const [flatError, allFlats] = await catchError(this.db.select().from(flats).where(eq(flats.landlordId, landlordId)));
    if (flatError) throw new Error("error getting flat in db", flatError);

    return allFlats;
  }

  async countFlats(landlordId: string) {
    const [flatCountError, [flatCountResult]] = await catchError(
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(flats)
        .where(eq(flats.landlordId, landlordId)),
    );
    if (flatCountError) throw new Error("DB error!");

    const currentCount = Number(flatCountResult ? flatCountResult.count : 0);

    return currentCount;
  }

  async create(input: RegisterFlatInput) {
    const [newFlatError, newFlat] = await catchError(
      this.db
        .insert(flats)
        .values(input)
        .returning()
        .then((res) => res[0]),
    );
    if (newFlatError) throw new Error("error inserting flat in db", newFlatError);
    return newFlat;
  }

  async remove(id: string) {
    const [flatError, flat] = await catchError(
      this.db
        .delete(flats)
        .where(eq(flats.id, id))
        .returning()
        .then((res) => res[0]),
    );
    if (flatError) throw new Error("error deleting flat!", flatError);
    return flat;
  }
}
