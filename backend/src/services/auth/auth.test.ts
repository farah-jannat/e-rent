import { AuthController } from "@/auth/auth.controller";
import { FakeAuthService } from "@/auth/auth.fake.service";
import { hashPassword } from "@/utils/hashing.util";
import { getTestContext, request } from "@/utils/test-utils";
import { describe, expect, it, beforeEach, mock } from "bun:test";
import { response, type Request, type Response } from "express";

// describe("AuthController - Register", () => {
//   let authService: FakeAuthService;
//   let authController: AuthController;
//   let mockRes: Partial<Response>;

//   beforeEach(() => {
//     authService = new FakeAuthService();
//     authController = new AuthController(authService);

//     // Mock the Express Response object
//     mockRes = {
//       json: mock((data) => data),
//       status: mock(() => mockRes as Response),
//     };
//   });

//   it("should successfully register a new landlord", async () => {
//     const mockReq = {
//       body: {
//         email: "test@example.com",
//         password: "password123",
//         name: "John Doe",
//       },
//       session: {},
//     } as Partial<Request>;

//     await authController.register(mockReq as Request, mockRes as Response);

//     // Verify service was called
//     expect(authService.landlords.length).toBe(1);
//     expect(authService.landlords[0]?.email).toBe("test@example.com");

//     // Verify response
//     expect(mockRes.json).toHaveBeenCalled();
//     const responseData = (mockRes.json as any).mock.results[0].value;
//     expect(responseData.message).toBe("Account created successfully");
//     expect(responseData).toHaveProperty("token");
//   });

//   it("should throw an error if the user already exists", async () => {
//     // Pre-populate the "database"
//     authService.landlords.push({
//       id: "1",
//       email: "existing@example.com",
//       password: "hashed_password",
//       name: "Existing User",
//     } as any);

//     const mockReq = {
//       body: {
//         email: "existing@example.com",
//         password: "password123",
//       },
//     } as Partial<Request>;

//     // We expect the controller to throw because of the 'throw new Error' in your code
//     expect(authController.register(mockReq as Request, mockRes as Response)).rejects.toThrow("you already exist!");
//   });

//   it("should hash the password before saving", async () => {
//     const rawPassword = "my-secret-password";
//     const mockReq = {
//       body: {
//         email: "hash@test.com",
//         password: rawPassword,
//         name: "Hash Test",
//       },
//       session: {},
//     } as Partial<Request>;

//     await authController.register(mockReq as Request, mockRes as Response);

//     const savedUser = authService.landlords[0];
//     // Check that the saved password is NOT the raw password
//     expect(savedUser?.password).not.toBe(rawPassword);
//     // Usually hashes are long strings (checking for a bcrypt/argon2-like length)
//     expect(savedUser?.password.length).toBeGreaterThan(10);
//   });
// });

// describe("AuthController - Login", () => {
//   let authService: FakeAuthService;
//   let authController: AuthController;
//   let mockRes: Partial<Response>;

//   beforeEach(() => {
//     authService = new FakeAuthService();
//     authController = new AuthController(authService);

//     // Mock the Express Response object
//     mockRes = {
//       json: mock((data) => data),
//       status: mock(() => mockRes as Response),
//     };
//   });

//   it("should successfully login with correct credentials", async () => {
//     // 1. Pre-seed the fake database with a user
//     const password = "password123";
//     const hashedPassword = await hashPassword(password);

//     authService.landlords.push({
//       id: "user-999",
//       email: "login@test.com",
//       password: hashedPassword,
//       name: "Test User",
//     } as any);

//     const mockReq = {
//       body: { email: "login@test.com", password: password },
//       session: {},
//     } as Partial<Request>;

//     await authController.login(mockReq as Request, mockRes as Response);

//     const responseData = (mockRes.json as any).mock.results[0].value;
//     expect(responseData.message).toBe("User logged in successfully");
//     expect(responseData).toHaveProperty("token");
//     expect(responseData.user.id).toBe("user-999");
//   });

//   it("should throw error if user is not found", async () => {
//     const mockReq = {
//       body: { email: "nonexistent@test.com", password: "any" },
//     } as Partial<Request>;

//     expect(authController.login(mockReq as Request, mockRes as Response)).rejects.toThrow("User are not found with this email!");
//   });

//   it("should throw BadRequestError for invalid password", async () => {
//     // Seed user
//     const hashedPassword = await hashPassword("correct-pass");
//     authService.landlords.push({
//       email: "wrong-pass@test.com",
//       password: hashedPassword,
//     } as any);

//     const mockReq = {
//       body: { email: "wrong-pass@test.com", password: "wrong-password" },
//     } as Partial<Request>;

//     // Note: Since you use BadRequestError from @fvoid/shared-lib,
//     // we check if it throws that specific error type
//     expect(authController.login(mockReq as Request, mockRes as Response)).rejects.toThrow("Invalid credentials");
//   });
// });

describe("Auth Integration", () => {
  beforeEach(async () => {
    // 3. Now 'authService' exists on 'module'!
    const { module } = await getTestContext();
    module.authService.landlords = [];
  });

  it("should register a new user successfully", async () => {
    const payload = {
      email: "landlord1@gmail.com",
      phone: "01903709156",
      password: "qwerty",
      name: "landlord1",
    };

    const response = await request("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(201); // Or 200, depending on your controller

    // 4. Verify data was actually saved in our Fake Service
    const { module } = await getTestContext();
    expect(module.authService.landlords.length).toBe(1);
    expect(module.authService.landlords[0]?.email).toBe("landlord1@gmail.com");
  });

  // it("it responds with a validator error", async () => {
  //   const payload = {
  //     email: "landlord1gmail.com",
  //     // email: "landlord1@gmail.com",
  //     password: "qwerty",
  //   };

  //   const response = await request("/api/v1/auth/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   console.log("the ############## ", response.status)

  //   // expect(response.status).toBe(400);
  // });

  it("it responds with a cookie when given valid credentials", async () => {
    const payload = {
      email: "landlord1@gmail.com",
      phone: "01903709156",
      password: "qwerty",
      name: "landlord1",
    };

    await request("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await request("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: payload.email, password: payload.password }),
    });

    expect(response.headers.get("set-cookie")).toBeTruthy();
  });
});
