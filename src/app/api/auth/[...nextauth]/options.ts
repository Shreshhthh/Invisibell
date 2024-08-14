import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import dbConnect from "../../../../lib/connect"
import bcrypt from "bcryptjs"
import UserModel, { User } from "../../../../models/User"

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "email"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email : credentials.email},
                            // {username : credentials.identifier}
                        ]
                    })
    
                    if(!user){
                        throw new Error('no user found with this email or username')
                    }
    
                    if(!user.isVerified){
                        throw new Error('user is not verified')
                    }
    
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
    
                    if(isPasswordCorrect){
                        return user
                    }
                    else{
                        throw new Error("incorrect password")
                    }
    
                } catch (error:any) {
                    throw new Error(error)
                }
              }
        })  
    ],
    pages:{
        signIn: '/sign-in'
    },
    callbacks:{
        async jwt({token , user}){
            if(user){
                token._id = user._id?.toString(),
                token.isVerified = user.isVerified,
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id?.toString(),
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
        }
    },
    session:{
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET
}

