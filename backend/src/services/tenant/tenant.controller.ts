import type { ITenantService } from "@/interfaces";
import type { RegisterTenantInput, UpdateTenantInput } from "@/validations/tenant.validation";
import { NotAuthorizedError } from "@fvoid/shared-lib";
import type { Request, Response } from "express";

export class TenantController {
  constructor(public tenantService: ITenantService) {}

  registerTenant = async (req: Request, res: Response) => {
    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    const formData = req.body as RegisterTenantInput;
    const tenant = await this.tenantService.create(formData, landlord.id);

    return res.json({
      message: "tenant created successfully",
      tenant: tenant,
    });
  };

  getTenants = async (req: Request, res: Response) => {
    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    const tenants = await this.tenantService.findAll(landlord.id);

    return res.json({
      tenants,
    });
  };

  getTenant = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    if (!id) throw new Error("No tenant Id provided");

    const tenant = await this.tenantService.findById(id, landlord.id);
    if (!tenant) throw new Error("tenant not found with this id! -_-");

    return res.json(tenant);
  };

  updateTenant = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    if (!id) throw new Error("No tenant Id provided");

    const formData = req.body as UpdateTenantInput;

    const tenant = await this.tenantService.update(id, formData);

    return res.json(tenant);
  };

  archiveTenant = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    const oldTenant = await this.tenantService.findById(id, landlord.id);
    if (!oldTenant) throw new Error("Tenant is not found with this id");

    const tenant = await this.tenantService.archive(id, landlord.id);
    return res.json(tenant);
  };

  getArchivedTenants = async (req: Request, res: Response) => {
    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    const tenants = await this.tenantService.findAllArchived(landlord.id);

    return res.json(tenants);
  };

  deleteTenant = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    const tenant = await this.tenantService.remove(id, landlord.id);

    return res.json(tenant);
  };

  restoreTenant = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    const tenant = await this.tenantService.unArchive(id, landlord.id);

    return res.json(tenant);
  };

  // tenantRents = async (req: Request, res: Response) => {
  //   const { id } = req.params as { id: string };

  //   const [rentError, rents] = await catchError(
  //     db.query.rentPayment.findMany({
  //       where: eq(rentPayment.tenantId, id),
  //     }),
  //   );

  //   return res.json(rents);
  // };

  // editStatus = async (req: Request, res: Response) => {
  //   const landlord = req.landlord;
  //   const { id } = req.params as { id: string };

  //   console.log("from the getTenants", landlord);

  //   if (!landlord) throw new NotAuthorizedError();

  //   const [rentPaymentError, oldRentPayment] = await catchError(
  //     db.query.rentPayment.findFirst({
  //       where: and(eq(rentPayment.id, id), eq(tenants.landlordId, landlord.id)),
  //     }),
  //   );
  //   if (rentPaymentError) throw new Error("Db errro!");

  //   const [erreditStatus, tenantRent] = await catchError(
  //     db.update(rentPayment).set({ status: "PAID" }).where(eq(rentPayment.id, id)).returning(),
  //   );
  //   if (erreditStatus) console.log("######################3 Db error updating jobs " + erreditStatus);
  //   return res.json(tenantRent);
  // };
}
