import dbConnect from "@/lib/connect";
import bcrypt from "bcryptjs"
import UserModel from "@/models/User";
import { sendverificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request : Request) {
    await dbConnect()

    try {
        const {username , email , password} = await request.json()

        const existingUserverifiedByUsername= await UserModel.findOne({
            username
        })

        if(existingUserverifiedByUsername?.isVerified){
            return Response.json({
                success:false,
                message: "Username already taken",
            },{
                status: 400
            })
        }

        const existingUserverifiedByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserverifiedByEmail){
            if(existingUserverifiedByEmail.isVerified){
                return Response.json({
                    success:false,
                    message: "User already exist with this email",
                },{
                    status: 400
                })
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserverifiedByEmail.password = hashedPassword
                existingUserverifiedByEmail.verifyCode = verifyCode
                existingUserverifiedByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                await existingUserverifiedByEmail.save()
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const newUser = new UserModel({
                username,
                password: hashedPassword,
                email,
                verifyCode : verifyCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()

            //send verification email
            const emailVerification = await sendverificationEmail(
                email,
                username,
                verifyCode
            )

            if(!emailVerification.success){
                return Response.json({
                    success: false,
                    message: "Failed to verify the user"
                },{
                    status: 500
                })
            }
        }
        return Response.json({
            success: true,
            message : "User registered successfully . Please verify your email"
        },{
            status: 201
        })

    } catch (error) {
        console.error("error while registering user", error)
        return Response.json({
            success: false,
            message : "Error while registering the user"
        },
    {
        status: 500
    })
    }
}