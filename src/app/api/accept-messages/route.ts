// import { getServerSession} from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
// import dbConnect from "@/lib/connect";
// import UserModel from "@/models/User";
// import {User} from "next-auth"


// export async function POST(request :Request){
//     await dbConnect()

//     const session = await getServerSession(authOptions)
//     const user:User = session?.user

//     if(!session || !session.user){
//         return Response.json({
//             success:false,
//             message: "Not Authenticated",
//         },{
//             status:401
//         })
//     }

//     const userEmail = user.email
//     const {acceptMessages} = await request.json()

//     try {
        
//         const updatedUser = await UserModel.findOneAndUpdate({
//             userEmail,
//             acceptMessages:acceptMessages},
//             {new:true}
//         )

//         if(!updatedUser){
//             return Response.json({
//                 success:false,
//                 message: "failed to update the user status",
//             },{
//                 status:500
//             })
//         }

//         return Response.json({
//             success:true,
//             message: "user message acceptance status updated successfully",
//         },{
//             status:200
//         })

//     } catch (error) {
//         console.log("failed to update user status of accepting messages")
//         return Response.json({
//             success:false,
//             message: "failed to update user status of accepting messages",
//         },{
//             status:500
//         })
//     }

// }

// export async function GET(request : Request){
//     await dbConnect()

//     const session = await getServerSession(authOptions)
//     const user:User = session?.user;

//     if(!session || !session.user){
//         return Response.json({
//             success:false,
//             message: "Not Authenticated",
//         },{
//             status:401
//         })
//     }

//     const useremail = user.email
    
//     try {
//         const userFound = await UserModel.findOne({email :useremail})
//         if(!userFound){
//             return Response.json({
//                 success:false,
//                 message: "User not found",
//             },{
//                 status:404
//             })
//         }
    
//         return Response.json({
//             success:true,
//             isAcceptingMessage : userFound.isAcceptingMessage,
//         },{
//             status:200
//         })
//     } catch (error) {
//         console.log("failed to update user status of accepting messages")
//         return Response.json({
//             success:false,
//             message: "error in getting message acceptance",
//         },{
//             status:500
//         })
//     }
// }




import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/connect';
import UserModel from '@/models/User';
import { User } from 'next-auth';

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  const session = await getServerSession(authOptions);
  const userS: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = userS._id;
  const { acceptMessages } = await request.json();

  try {
    // Update the user's message acceptance status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);
//   console.log(session)
  const userS : User = session?.user;

  // Check if the user is authenticated
  if (!session || !userS) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Retrieve the user from the database using the ID
    const foundUser = await UserModel.findById(userS._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
}