import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Script from "next/script";

export default function BoatHirePage() {
  return (
    <>
      {/* TripWorks SDK Script */}
      <Script 
        src="https://trpwrks.com/build/sdk.js" 
        strategy="afterInteractive"
      />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4">Indonesian Boat Hire</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Daily Boat Charter
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore the beautiful waters of Indonesia with our premium boat hire service
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Boat Hire Details</CardTitle>
                <CardDescription>
                  Full day charter experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>Full Day (8 hours)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Price:</span>
                    <span className="text-2xl font-bold">£100/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Capacity:</span>
                    <span>Up to 8 guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Includes:</span>
                    <span>Captain, Fuel, Safety Equipment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Book Your Charter</CardTitle>
                <CardDescription>
                  Select your date and book instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* TripWorks booking widget */}
                <div 
                  className="tw-widget tw-calendar" 
                  data-experience="15592" 
                  data-show-detail="true" 
                  data-account="indonesian-boats"
                  style={{ minHeight: '400px' }}
                ></div>
                
                {/* Fallback booking button */}
                <div className="mt-4 text-center">
                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full"
                  >
                    <a 
                      href="https://indonesian-boats.tripworks.com/experiences/boat-hire-daily-charter" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Book Now - £100/day
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Live booking system - Select dates and book instantly
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Professional Captain</h3>
                    <p className="text-sm text-muted-foreground">
                      Experienced local captain included
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">All Safety Equipment</h3>
                    <p className="text-sm text-muted-foreground">
                      Life jackets and safety gear provided
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Fuel Included</h3>
                    <p className="text-sm text-muted-foreground">
                      No hidden fuel costs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 