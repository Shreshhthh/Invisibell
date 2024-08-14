import dbConnect from "@/lib/connect";
import User  from "@/models/User"; 

export async function POST( request: Request){

    dbConnect()
    try {
        const { username , code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        
        const user = await User.findOne({
            username:decodedUsername
        })

        if(!user){
            return Response.json({
                success:false,
                message: "User does not exists",
            },{
                status:500
            })
        }

        const isCodeVerified = user.verifyCode===code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeNotExpired && isCodeVerified){
            user.isVerified = true
            await user.save()

            return Response.json({
                success:true,
                message: "user verified",
            },{
                status:200
            })
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message: "Verification code has expired",
            },{
                status:400
            })
        }
        else{
            return Response.json({
                success:false,
                message: "Verification code is invalid",
            },{
                status:400
            })
        }

    } catch (error) {
        return Response.json({
            success:false,
            message: "failed to verify the user",
        },{
            status:500
        })
    }
}