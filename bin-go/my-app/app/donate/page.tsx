'use client'

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DonatePage() {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [donationSites, setDonationSites] = useState<any[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(false);

  const handleGetLocation = () => { // where is the user chat
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        searchDonationSites(location); // --> here we look for sites
      },
      (error) => {
        setLocationError("oh no! we couldn't grab your location, please enable location services!!");
      }
    );
  };

  const searchDonationSites = async (location: {lat: number, lng: number}) => { // lets find some sites
    setIsLoadingSites(true);

    try {
      // TODO: replace with actual google maps api call

      const mockSites = [
        {
          name: "Community Food Bank",
          address: "123 Main St, Minneapolis, MN",
          distance: "0.5 miles",
          lat: location.lat + 0.01,
          lng: location.lng + 0.01
        }
      ];

      setDonationSites(mockSites);
    } catch (error) {
      setLocationError("oh no! we couldn't find donation sites nearby. please try again, or give text input!");
    } finally {
      setIsLoadingSites(false);
    }
  };

  // OPEN IN GOOGLE MAPS
  const openInMaps = (site: any) => {
    // opens Google Maps with directions to the site
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <main className="flex flex-col items-center px-6 py-12 max-w-2xl w-full">
        
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">Bin-Go ⋆˚꩜｡</h1>
        {!userLocation && !locationError && (
          <Card className="w-full mb-6">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl mb-4">📍</div>
              <h2 className="text-xl font-bold mb-2">please enable location access, so we can find nearby donation centers!!</h2>
              <button
                onClick={handleGetLocation}
                disabled={isLoadingLocation}
                className="w-full py-3 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 disabled:opacity-50"
              >
                {isLoadingLocation ? "processing your location..." : "share my location"}
              </button>
            </CardContent>
          </Card>
        )}

        {/* ERROR MESSAGE */}
        {locationError && (
          <Card className="w-full mb-6 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600 text-center">⚠️ {locationError}</p>
              <button
                onClick={handleGetLocation}
                className="w-full mt-4 py-3 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600"
              >
                hmm... lets try again
              </button>
            </CardContent>
          </Card>
        )}

        {/* loading */}
        {isLoadingSites && (
          <div className="text-center">
            <div className="text-4xl animate-spin mb-4">🔄</div>
          </div>
        )}

        {/* sites list */}
        {donationSites.length > 0 && (
          <div className="w-full space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {donationSites.length} donation center(s) nearby
            </h2>
            
            {donationSites.map((site) => (
              <Card 
                key={site.id}
                className="cursor-pointer hover:shadow-lg transition-all border-2 border-emerald-200 hover:border-emerald-400"
                onClick={() => openInMaps(site)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    
                    {/* site info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{site.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{site.address}</p>
                    </div>
                    
                    {/* distance */}
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-600">{site.distance}</p>
                      <p className="text-xs text-gray-500">→ tap location for directions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* back button */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 text-gray-600 hover:text-emerald-600"
        >
          ← return
        </button>

      </main>
    </div>
  );
}