'use client'

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // grab info from url
  const binCategory = searchParams.get("bin") as "recycling" | "trash" | "compost";
  const itemText = searchParams.get("text");

  // are we animating?
  const [isAnimating, setIsAnimating] = useState(true);

  // run animation on load
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // bins data
  const bins = {
    recycling: { color: "bg-blue-500", icon: "♻️", title: " recycling!!" },
    trash: { color: "bg-gray-500", icon: "🗑️", title: " trash!!" },
    compost: { color: "bg-green-500", icon: "🌱", title: " compost!!" }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <main className="flex flex-col items-center px-6 py-12 max-w-4xl w-full">
        
        <h1 className="text-3xl font-bold text-emerald-700 mb-12">Bin-Go</h1>

        {/* loading? they got some cool animations!! */}
        {isAnimating && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="text-8xl animate-bounce">⏳</div>
          </div>
        )}

        {/* bin setup from reeha!! */}
        <div className="w-full grid grid-cols-3 gap-6 mb-8">
          {Object.entries(bins).map(([key, bin]) => (
            <Card 
              key={key}
              className={`h-72 ${bin.color} ${
                binCategory === key && !isAnimating
                  ? "ring-4 ring-yellow-400 scale-105" 
                  : "opacity-50"
              } transition-all duration-500`}
            >
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center">
                  {bin.icon} {bin.title}
                </CardTitle>
              </CardHeader>
              
              {/* add a lil checkmark in correct bin */}
              {binCategory === key && !isAnimating && (
                <CardContent className="flex items-center justify-center flex-1">
                  <div className="text-6xl">✓</div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* result info card */}
        {!isAnimating && (
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl mb-4">{bins[binCategory].icon}</div>
              <h2 className="text-2xl font-bold mb-2">{bins[binCategory].title}</h2>
              {itemText && <p className="text-gray-600 mb-4">your item was: "{itemText}"</p>}
              
              <button
                onClick={() => router.push("/")}
                className="w-full py-3 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600"
              >
                let's sort another item :D
              </button>
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
}