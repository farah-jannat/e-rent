import type { IAuthService } from "@/interfaces";
import type { Landlord } from "@/schemas"; // Adjust based on your actual schema import
import type { RegisterLandlordInput } from "@/validations/landlord.validation";

export class FakeAuthService implements IAuthService {
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
}
