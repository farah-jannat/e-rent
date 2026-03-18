import type { Flat, Landlord, Tenant } from "@/schemas";
import type { RegisterFlatInput } from "@/validations/flat.validation";
import type { RegisterLandlordInput } from "@/validations/landlord.validation";
import type { RegisterTenantInput, UpdateTenantInput } from "@/validations/tenant.validation";
import type { Application } from "express";

export interface IAppModule {
  // Any class implementing this MUST provide this method
  isTest?: boolean;

  set_route_middlewares(app: Application): void;
  // set_route_middlewares(): void;
}

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

export interface ITenantService {
  findAll: (landlordId: string) => Promise<Tenant[]>;
  findAllArchived: (landlordId: string) => Promise<Tenant[]>;
  create: (input: RegisterTenantInput, landlordId: string) => Promise<Tenant | undefined>;
  update: (id: string, formData: UpdateTenantInput) => Promise<Tenant | undefined>;
  findById: (id: string, landlordId: string) => Promise<Tenant | undefined>;
  archive: (id: string, landlordId: string) => Promise<Tenant | undefined>;
  unArchive: (id: string, landlordId: string) => Promise<Tenant | undefined>;
  remove: (id: string, landlordId: string) => Promise<Tenant | undefined>;
}
