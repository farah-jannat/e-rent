import type { IAuthService, IFlatService } from "@/interfaces";
import type { RegisterFlatInput } from "@/validations/flat.validation";
import { NotAuthorizedError } from "@fvoid/shared-lib";
import type { Request, Response } from "express";

export class FlatController {
  constructor(
    public flatService: IFlatService,
    public authService: IAuthService,
  ) {}

  registerFlat = async (req: Request, res: Response) => {
    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    const formdata = req.body as RegisterFlatInput;

    // check for landlord
    const newLandlord = await this.authService.findById(landlord.id);
    if (!newLandlord) throw new Error("no landlord found! :(");

    // count landloards total flats
    const flatCount = await this.flatService.countFlats(landlord.id);

    // check for subscription limit
    if (newLandlord.plan !== "premium" && flatCount >= newLandlord.quotaLimit) {
      return res.status(403).json({
        message: `Limit reached for ${newLandlord.plan} plan. You have ${flatCount} flats. Please upgrade.`,
        currentFlats: flatCount,
        limit: newLandlord.quotaLimit,
      });
    }

    // check for flat
    const flat = await this.flatService.findOne(formdata.name, landlord.id);
    if (flat) throw new Error("this flat already exist");

    // prepare data
    // const data:RegisterFlatInput = {
    //   ...formdata,
    //   landlordId: landlord.id.toString(),
    // };

    // create a new flat
    const newFlat = await this.flatService.create({ ...formdata, landlordId: landlord.id.toString() } as RegisterFlatInput);
    if (!newFlat) throw new Error("error inserting flat in db");

    // return response
    return res.json({
      message: "Account created successfully",
    });
  };

  getFlats = async (req: Request, res: Response) => {
    const landlord = req.landlord;
    if (!landlord) throw new NotAuthorizedError();

    const allFlats = await this.flatService.findAll(landlord.id);

    return res.json(allFlats);
  };

  deleteFlat = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!id) throw new Error("No flatId provided");

    const flat = await this.flatService.remove(id);
    if (!flat) throw new Error("flat not found");

    return res.json({
      flat: flat,
    });
  };
}
