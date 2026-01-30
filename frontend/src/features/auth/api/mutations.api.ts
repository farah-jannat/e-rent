import { auth__axios } from "@/axios.service"
import { RegisterApi, RegisterSchemaType } from "@/features/auth/schemas/register.schema"

export const register = async(data:RegisterSchemaType) =>{
    console.log("data from the regiser api", data)
    const response = await auth__axios.post<RegisterApi>(`/register`, data)
    return response.data
}