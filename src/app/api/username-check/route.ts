import User from "@/models/User";
import z from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";
import dbConnect from "@/lib/connect";

const usernameValidationSchema = z.object({
    username: usernameValidation
})

export async function GET(request : Request){

    await dbConnect()

    try {

        const {searchParams} = new URL(request.url)
        const queryParams = {
             username : searchParams.get('username')
        }
        const result = usernameValidationSchema.safeParse(queryParams)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message : "Invalid username"
            },{
                status:400
            })
        }

        const {username}= result.data
        
        const existingUsername = await User.findOne({username, isVerified:true})

        if(existingUsername){
            return Response.json({
                success:false,
                message: "username Already taken"
            },{
                status:400
            })
        }

        return Response.json({
            success:true,
            message: "username is unique"
        },{
            status:200
        })

    } catch (error: any) {
        console.log("failed to verify the username", error);
        return Response.json({
            success:false,
            message: "failed to verify the username",
        },{
            status:500
        })
    }

}