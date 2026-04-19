import type { SqlDB } from "@/db";
import type { IAuthService } from "@/interfaces";
import { landlords } from "@/schemas";
import type { RegisterLandlordInput } from "@/validations/landlord.validation";
import { catchError } from "@fvoid/shared-lib";
import { eq } from "drizzle-orm";

export class AuthService implements IAuthService {
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
}
