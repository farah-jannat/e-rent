import type { Flat, Landlord, NewPayment, Payment, RentPayment, Tenant } from "@/schemas";
import type { RegisterFlatInput } from "@/validations/flat.validation";
import type { LoginLandlordInput, RegisterLandlordInput, UpdateLandlordPlanInput } from "@/validations/landlord.validation";
import type { InsertPaymentInput } from "@/validations/payment.validation";
import type { SubscriptionInput } from "@/validations/subscription.validation";
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

export interface ILandlordService {
  findByEmail: (email: string) => Promise<Landlord | undefined>;
  findById: (id: string) => Promise<Landlord | undefined>;
  create: (input: RegisterLandlordInput) => Promise<Landlord | undefined>;
  updateLandlordPlan: (landlordId: string, input: UpdateLandlordPlanInput) => Promise<Landlord | undefined>;
}

interface RegisterCredential {
  token: string;
  landlord: Landlord | undefined;
}

export interface IAuthService {
  register: (input: RegisterLandlordInput) => Promise<RegisterCredential | undefined>;
  login: (input: LoginLandlordInput) => Promise<RegisterCredential | undefined>;
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

export interface IPaymentService {
  // create: (input: NewPayment, landlordId: string) => Promise<Tenant | undefined>;
  create: (input: InsertPaymentInput) => Promise<Payment | undefined>;
}

export interface ISubscriptionService {
  // subscribe: (input: SubscriptionInput, landlordId: string) => Promise<Payment | undefined>;
  subscribe: (landlordId: string, input: SubscriptionInput) => Promise<void>;
}

export interface IStatisticsService {
  // subscribe: (input: SubscriptionInput, landlordId: string) => Promise<Payment | undefined>;
  due: (landlordId: string, interval: "year" | "month") => Promise<RentPayment[]>;
  duebyTenant: (landlordId: string, tenantId: string, interval: "year" | "month") => Promise<RentPayment[]>;
}
