import type { IFlatService } from "@/interfaces";

export class FakeFlatService implements IFlatService {
  findFirst(): void {
    console.log("it will fetch the first flat");
  }
}
