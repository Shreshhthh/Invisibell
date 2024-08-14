import dbConnect from "@/lib/connect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { tree } from "next/dist/build/templates/app-page";

export async function POST(request:Request){
    try {
        await dbConnect()

        const {email , password} = await request.json()

        const user = await UserModel.findOne({email});

        if(!user){
            return Response.json({
                message: "User not found",
                success: false
            })
        }

        const passwordMatched = bcrypt.compare(password, user.password);

        if(!passwordMatched){
            return Response.json({
                message: "Invalid password",
                success:false
            })
        }

        const token = createtoken(user._id);
        return Response.json({
            message: "User logged in",
            token: token,
            success: true
        })

    } catch (error) {
        
    }
}

const createtoken=(id:any)=>{
    return jwt.sign({id}, process.env.JWT_SECRET!); 
}