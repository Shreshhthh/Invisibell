import dbConnect from "@/lib/connect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request : Request){
    const { username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json({
                success:false,
                message: "User does not exist",
            },{
                status:404
            })
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message: "user not accepting messages",
            },{
                status:403
            })
        }

        const newMessage = {content , createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success:true,
            message: "message send successfully",
        },{
            status:200
        })

    } catch (error) {
        return Response.json({
            success:false,
            message: "cannot send message to the user",
        },{
            status:500
        })
    }

}