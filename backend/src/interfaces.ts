import type { Flat, Landlord } from "@/schemas";
import type { RegisterFlatInput } from "@/validations/flat.validation";
import type { RegisterLandlordInput } from "@/validations/landlord.validation";

export interface IFlatService {
  findAll: (landlordId: string) => Promise<Flat[]>;
  findOne: (flatName: string, landlordId: string) => Promise<Flat | undefined>;
  countFlats: (landlordId: string) => Promise<number>;
  create: (input: RegisterFlatInput) => Promise<Flat | undefined>;
  remove: (id: string) => Promise<Flat | undefined>;
}

export interface IAuthService {
  findByEmail: (email: string) => Promise<Landlord | undefined>;
  findById: (id: string) => Promise<Landlord | undefined>;
  create: (input: RegisterLandlordInput) => Promise<Landlord | undefined>;
}
