import { auth__axios } from "@/axios.service"
import { LoginApi, LoginSchemaType } from "@/features/auth/schemas/login.schema"
import { RegisterSchemaType } from "@/features/auth/schemas/register.schema"

export const register = async(data:RegisterSchemaType) =>{
    console.log("data from the regiser api", data)
    const response = await auth__axios.post<LoginApi>(`/register`, data)
    console.log("your token frokm register api", response.data.token)
    return response.data
}

export const login = async(data:LoginSchemaType)=>{
    console.log("user data to  login from login api", data)
    const response = await auth__axios.post<LoginApi>(`/login`,data)
    return response.data
}