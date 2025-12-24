'use client'

//imports for components
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Textarea } from "@/components/ui/textarea"
import { userAgent } from "next/server";

export default function Home() {
  const router = useRouter();

  // HANDLE METHOD SELECTION
  // 1. user clicks card. 2. user navigates to input page 
  const handleMethodChoice = (method: "camera" | "text") => {
    // pass chosen method as URL to input page
    router.push(`/input?method=${method}`);
  }

  return ( // main container
    // just setting up a full screen w/ centered content & light background 
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <main className="flex flex-col items-center px-6 py-12 max-w-2xl w-full">
        
        {/* header / welcoem message */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-4xl font-bold text-emerald-700">welcome to Bin-Go!! ⋆˚꩜｡</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8">
          how would you like to show us your item?
          </h2>
        </div>

        {/* users select method w/ 2 large clickable cards*/}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* camera card! */}
          <Card 
            onClick={() => handleMethodChoice("camera")}
            className="cursor-pointer hover:shadow-xl hover:border-emerald-400 transition-all border-2 border-emerald-200"
          >
            <CardHeader className="text-center p-8">
              <div className="text-6xl mb-4">📸</div>
              <CardTitle className="text-xl mb-2">photograph my item</CardTitle>
              <CardDescription className="text-base">
                snap a picture of your item, and we will identify it & where it belongs
              </CardDescription>
            </CardHeader>
          </Card>

          {/* text card! */}
          <Card 
            onClick={() => handleMethodChoice("text")}
            className="cursor-pointer hover:shadow-xl hover:border-emerald-400 transition-all border-2 border-emerald-200"
          >
            <CardHeader className="text-center p-8">
              <div className="text-6xl mb-4">✍️</div>
              <CardTitle className="text-xl mb-2">describe my item</CardTitle>
              <CardDescription className="text-base">
                type a summary of your item, and we will identify where it belongs!
              </CardDescription>
            </CardHeader>
          </Card>

        </div>

        {/* footer / quick tip */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>💡 note: photo recognition works best when picture is taken in clear lighting</p>
        </div>

      </main>
    </div>
  );
}

