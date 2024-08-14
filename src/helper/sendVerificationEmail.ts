import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendverificationEmail(
    email: string,
    username: string,
    VerifyCode: string
): Promise <ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Invisibell | Verification code',
            react: VerificationEmail({username, otp:VerifyCode}),
          });

        return {success:true, message:"Verification code send successfully"}   
    } catch (emailError) {
        console.error("Error sending the email",emailError);
        return {success:false, message:"failed to send verification code"}
    } 
}