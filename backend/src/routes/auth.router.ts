import { register } from "@/controllers/landlord.controller";
import { Router } from "express";

const authRouter = Router()

authRouter.post('/register', register)

export default authRouter