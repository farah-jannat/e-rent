import type { ILandlordService } from "@/interfaces";
import type { Landlord } from "@/schemas"; // Adjust based on your actual schema import
import type { RegisterLandlordInput, UpdateLandlordPlanInput } from "@/validations/landlord.validation";

export class FakeLandlordService implements ILandlordService {
  public landlords: Landlord[] = [];

  async findByEmail(email: string): Promise<Landlord | undefined> {
    return this.landlords.find((l) => l.email === email);
  }

  async findById(id: string): Promise<Landlord | undefined> {
    return this.landlords.find((l) => l.id === id);
  }

  async create(input: RegisterLandlordInput): Promise<Landlord | undefined> {
    const newLandlord = { ...input, id: "mock-id-123" } as Landlord;
    this.landlords.push(newLandlord);
    return newLandlord;
  }

  async updateLandlordPlan(landlordId: string, input: UpdateLandlordPlanInput): Promise<Landlord | undefined> {
    const index = this.landlords.findIndex((l) => l.id === landlordId);

    if (index === -1) {
      throw new Error("Landlord not found");
    }

    // Merge existing data with new plan input
    const updatedLandlord = {
      ...this.landlords[index],
      ...input,
    } as Landlord;

    // Update the record in the array
    this.landlords[index] = updatedLandlord;

    return updatedLandlord;
  }
}
