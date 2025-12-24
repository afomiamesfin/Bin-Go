'use client'

//imports for components
import Image from "next/image";
import { useState } from "react";

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

export default function Home() {
  // has user chosen their input method?
  const [hasChosenMethod, setHasChosenMethod] = useState<boolean>(false);
  // state management: is user using cam or text input?
  const [inputMode, setInputMode] = useState<"camera" | "text">("camera");
  // store image as URL string or null
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  // store text description from user
  const [textInput, setTextInput] = useState<string>("");
  // track camera / recognition errors
  const[error, setError] = useState<string | null>(null);
  // track if we are analyzing imge rn
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // HANDLE METHOD SELECTION
  // when user clicks camera or describe on welcome screen
  const handleMethodSelection = (mode: "camera" | "text") => {
    setInputMode(mode); // set input mode
    setHasChosenMethod(true); // mark that user has chosen method
  }

  // HANDLE IMAGE CAPTURE
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // clear previous errors
    const file = e.target.files?.[0]; // grab first file from input

    if(file){
      const imageUrl = URL.createObjectURL(file); // create temporary URL for image
      setCapturedImage(imageUrl); // store image URL in state
    } else { // womp womp
      setError("Oops, failed to capture image. Please try again, or describe the item below!!");
      setInputMode("text"); // switch to text as fallback
    }
  }


  // HANDLE IMAGE ANALYSIS
  // --> Placeholder function calling ML API - include error handling!!
  const handleAnalyzeImage = async () => {
    if(!capturedImage) return; // sanity check

    setIsAnalyzing(true); 
    setError(null);

    try{
      // TODO: replace w/ actual Google Vision API call
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // simulate recognition failure (NEED TO REMOVE LATER)
      const simulateError = Math.random() < 0.7; // 30% chance of "failure"

      if(simulateError){
        throw new Error("Recognition failed!");
      

      // todo: if successful, navigate to results page w/ recognized item
      console.log("Image recognized successfully!");

      } 
    } catch(err){
      // recognition has failed
      setError("Sorry, we couldn't recognize that item. Please try again or describe the item below!");
      setInputMode("text"); // switch to text input as fallback
      setCapturedImage(null); // clear captured image
    } finally {
      setIsAnalyzing(false);
    }
  }

  //ui, trashcans + buttons 
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col px-32 py-50 items-center justify-between bg-white dark:bg-black sm:items-start">

        <Textarea placeholder="type here pibble." className="bg-black text-white" />
        
        <div className="w-full grid grid-cols-3 gap-x-50 justify-items-center items-start py-8">
        <Card className="w-48 h-72 bg-blue-500">
          <CardHeader>
            <CardTitle>recycling</CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
          </CardHeader>
          {/* <CardContent>
            <p>Card Contenttttttttttttttttttttttt</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
         <Card className="w-48 h-72 bg-gray-500">
          <CardHeader>
            <CardTitle>trash</CardTitle>
          </CardHeader>
       
        </Card>
         <Card className="w-48 h-72 bg-green-500">
          <CardHeader>
            <CardTitle>compost</CardTitle>
          </CardHeader>
        
        </Card>
        </div>
      </main>
    </div>
  );
}

