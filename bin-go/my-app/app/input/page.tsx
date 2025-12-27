'use client'

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function InputPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // get camera or text method from input parameters
  const method = searchParams.get("method") as "camera" | "text";

  // uhhh managing stages ig?
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // stores the url of the pic
  const [textInput, setTextInput] = useState<string>(""); // stores the text description (if chosen as option)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false); // when we are loading state
  const [error, setError] = useState<string | null>(null); // whoopsie something went wrong
  const [imageFile, setImageFile] = useState<File | null>(null); // store image file, not just URL


// store both URL (for display) and file (for Roboflow API)
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // clear buildup errors
    const file = e.target.files?.[0]; // grab the file

    if (file) {
      const imageUrl = URL.createObjectURL(file); // create url from preview
      setCapturedImage(imageUrl); // store for display
      setImageFile(file); // store file for Roboflow API
    } else {
      setError("oopsie... image capture failed, please try inputing an item description instead!");
    }
  };

  // ========== ROBOFLOW CLASSIFICATION ==========
  // Classification models return ONE category for the entire image
  const classifyImageWithRoboflow = async (imageFile: File): Promise<string> => {
    console.log("🔥 NEW CLASSIFIER RUNNING 🔥");

    try {
      // Convert image file to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Remove the "data:image/jpeg;base64," prefix
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(imageFile);
      });

      // Call Roboflow Classification API
      // Note: Using "serverless.roboflow.com" (from the docs) not "detect.roboflow.com"
      const response = await fetch(
        `https://serverless.roboflow.com/trash-recycle-compost-etc-etc/1?api_key=${process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: base64Image
        }
      );

      const data = await response.json();
      
      // debug: see what the model returns
      console.log("Roboflow response:", data);
      const predictedClass = data.top?.toLowerCase();

      if (!predictedClass) {
        console.log("No top class from Roboflow");
        return "trash";
      }

      console.log("Predicted class from Roboflow:", predictedClass);

      // 🎯 Map Roboflow labels → bins
      if (["plastic", "cardboard", "paper", "metal", "glass"].includes(predictedClass)) {
        return "recycling";
      }

      if (["banana", "food", "organic", "compost"].includes(predictedClass)) {
        return "compost";
      }

      // fallback
      return "trash";

    } catch (error) {
      console.error("Roboflow error:", error);
      return "trash";
    }
  };

  // analyze the captured image with Roboflow AI
  const handleAnalyzeImage = async () => {
    if (!capturedImage || !imageFile) return; // safety check

    setIsAnalyzing(true); // show loading
    setError(null);

    try {
      // call Roboflow to classify the image
      const binCategory = await classifyImageWithRoboflow(imageFile);
      
      // navigate to results page with AI's decision
      router.push(`/results?bin=${binCategory}&hasImage=true`);
      
    } catch (err) {
      // something goes wrong, suggest text input
      setError("aw man, we couldn't identify your item ('𐃷') try describing it instead!!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // process text & return bin
  const handleAnalyzeText = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      console.log("analyzing text:", textInput);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        // non-json response
      }

      if (!res.ok) {
        const msg = (data && data.detail) || `analysis request failed (status ${res.status})`;
        console.error(msg);
        setError(msg);
        return;
      }

      const bin = data?.bin || "trash";
      console.log("analysis result:", bin, data);

      router.push(`/results?bin=${bin}&hasImage=false`);

    } catch (err) {
      setError("yikes... something went wrong, try again please!!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <main className="flex flex-col items-center px-6 py-12 max-w-md w-full">
        
        {/* header / prompt */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">Bin-Go ⋆˚꩜｡</h1>
          <p className="text-gray-600">
            {method === "camera" ? "snap a picture of your item!!" : "please describe your item!!"}
          </p>
        </div>

        {/* back button */}
        <button
          onClick={() => router.push("/")}
          className="self-start mb-6 text-gray-600 hover:text-emerald-600 transition-colors"
        >
          ← change input 
        </button>

        {/* show error message if something goes wrong */}
        {error && (
          <div className="w-full mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
            <p className="text-sm text-red-800">⚠️ {error}</p>
          </div>
        )}

        {/* CONDITIONALS: depends on if they chose cam or text input */}
        <div className="w-full">
          
          {method === "camera" ? (
            /* ========== PIC MODE ========== */
            <div>
              {!capturedImage ? (
                /* preview frame */
                <div className="relative">
                  <Card className="border-4 border-dashed border-emerald-300">
                    <CardContent className="aspect-square flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📷</div>
                        <p className="text-gray-500 mb-2">point your camera directly @ the item, & take a photo in clear lighting!</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* circle pic button */}
                  <label
                    htmlFor="camera-input"
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95">
                    <span className="text-3xl text-white">go!</span>
                  </label>
                  
                  {/* triggers camera or prompts files?? ts came from chatgpt idk how bro works... */} 
                  <input
                    type="file"
                    id="camera-input"
                    accept="image/*"
                    capture="environment" // mobile: back camera
                    onChange={handleImageCapture}
                    className="hidden"
                  />
                </div>
              ) : (
                /* image previuew after upload */
                <div>
                  <Card className="mb-4">
                    <CardContent className="p-0">
                      <img
                        src={capturedImage}
                        alt="captured item goes here"
                        className="w-full aspect-square object-cover"
                      />
                    </CardContent>
                  </Card>
                  
                  <div className="flex gap-3">
                    {/* buttons to retake or analyze */}
                    <button
                      onClick={() => setCapturedImage(null)}
                      disabled={isAnalyzing}
                      className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-all disabled:opacity-50"
                    >
                      retake my photo!
                    </button>
                    <button
                      onClick={handleAnalyzeImage}
                      disabled={isAnalyzing}
                      className="flex-1 py-3 px-6 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? "analyzing..." : "analyze! →"}
                    </button>
                  </div>
                </div>
              )}
            </div>

          ) : (
            /* ========== TEXT MODE ========== */
            <Card>
              <CardContent className="pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  describe your item below!!
                </label>
                
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="e.g., plastic water bottle, pizza box, banana peel..."
                  className="resize-none h-32 mb-4"
                />
                {error ? (
                  <p className="text-sm text-red-600 mb-3">{error}</p>
                ) : null}

                <button
                  onClick={handleAnalyzeText}
                  disabled={!textInput.trim() || isAnalyzing}
                  className="w-full py-3 px-6 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? "analyzing! ..." : "find bin →"}
                </button>
              </CardContent>
            </Card>
          )}

        </div>

      </main>
    </div>
  );
}