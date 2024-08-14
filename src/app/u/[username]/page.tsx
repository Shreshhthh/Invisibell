"use client";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const U = () => {
  const { username } = useParams();
  const session = useSession();
  const { toast } = useToast();

  // const username = session.data?.user.username;

  const [content, setContent] = useState({
    username: username,
    content: "",
  });

  const handleOnSend = async () => {
    try {
      const isAccepting = session.data?.user.isAcceptingMessage;

      if (!isAccepting) {
        toast({
          title: "User is not accepting messages",
          variant: "destructive",
        });
      }

      await axios.post<ApiResponse>(`/api/send-message`, content);
      toast({
        title: "Message sent successfully",
        variant: "destructive",
      });
    } catch (error) {
      console.log(error, "failed to send message");
      toast({
        title: "error while sending message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <p className="text-1xl font-bold">
        Send Anonymous Message to @{username}
      </p>
      <div className="form-section flex flex-col text-center items-center">
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black w-full "
          placeholder="enter your message here"
          name="content"
          onChange={(e) => setContent({ ...content, content: e.target.value })}
          value={content.content}
        />
        <Button
          onClick={handleOnSend}
          className="mt-2 flex flex-row text-center align-middle"
        >
          {" "}
          Send{" "}
        </Button>
      </div>
    </div>
  );
};

export default U;
