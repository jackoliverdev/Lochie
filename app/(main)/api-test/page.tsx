'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BOAT_CHARTER_ID = 1031959;

interface CombinedApiResults {
  experience?: any;
  availability?: any;
  pricing?: any;
  nativePricing?: any;
  timestamp: string;
  success: boolean;
  errors: string[];
}

export default function ApiTestPage() {
  const [combinedResults, setCombinedResults] = useState<CombinedApiResults | null>(null);
  const [loading, setLoading] = useState(false);

  const testAllApis = async () => {
    setLoading(true);
    const results: CombinedApiResults = {
      timestamp: new Date().toLocaleString('en-GB'),
      success: false,
      errors: []
    };

    try {
      // Test all APIs in parallel
      const [experienceResponse, availabilityResponse, octoricingResponse, nativePricingResponse] = await Promise.allSettled([
        fetch('/api/bokun/experience'),
        fetch('/api/bokun/availability'),
        fetch('/api/bokun/pricing'),
        fetch('/api/bokun/native-pricing')
      ]);

      // Process Experience API
      if (experienceResponse.status === 'fulfilled' && experienceResponse.value.ok) {
        results.experience = await experienceResponse.value.json();
      } else {
        results.errors.push('Experience API failed');
        if (experienceResponse.status === 'rejected') {
          results.errors.push(`Experience error: ${experienceResponse.reason}`);
        }
      }

      // Process Availability API
      if (availabilityResponse.status === 'fulfilled' && availabilityResponse.value.ok) {
        results.availability = await availabilityResponse.value.json();
      } else {
        results.errors.push('Availability API failed');
        if (availabilityResponse.status === 'rejected') {
          results.errors.push(`Availability error: ${availabilityResponse.reason}`);
        }
      }

      // Process OCTO Pricing API
      if (octoricingResponse.status === 'fulfilled' && octoricingResponse.value.ok) {
        results.pricing = await octoricingResponse.value.json();
      } else {
        results.errors.push('OCTO Pricing API failed');
        if (octoricingResponse.status === 'rejected') {
          results.errors.push(`OCTO Pricing error: ${octoricingResponse.reason}`);
        }
      }

      // Process Native Pricing API
      if (nativePricingResponse.status === 'fulfilled' && nativePricingResponse.value.ok) {
        results.nativePricing = await nativePricingResponse.value.json();
      } else {
        results.errors.push('Native Pricing API failed');
        if (nativePricingResponse.status === 'rejected') {
          results.errors.push(`Native Pricing error: ${nativePricingResponse.reason}`);
        }
      }

      results.success = results.errors.length === 0;
      
    } catch (error) {
      results.errors.push(`General error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      results.success = false;
    }

    setCombinedResults(results);
    setLoading(false);
  };

  const formatPrice = (amount: number) => `£${amount.toFixed(2)}`;

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            🚤 Bokun API Combined Test
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Indonesian Daily Boat Charter - All API Data
          </p>
          
          {/* Main Test Button */}
          <Button 
            onClick={testAllApis} 
            disabled={loading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            {loading ? '🔄 Testing APIs...' : '🚀 Test All APIs'}
          </Button>
        </div>

        {/* Results Display */}
        {combinedResults && (
          <div className="space-y-6">
            {/* Summary Status */}
            <Card className={`border-2 ${combinedResults.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <CardHeader>
                <CardTitle className={`text-lg ${combinedResults.success ? 'text-green-700' : 'text-red-700'}`}>
                  {combinedResults.success ? '✅ All APIs Working' : '❌ Some APIs Failed'}
                </CardTitle>
                <CardDescription>
                  Test completed at {combinedResults.timestamp}
                </CardDescription>
              </CardHeader>
              {combinedResults.errors.length > 0 && (
                <CardContent>
                  <div className="text-red-600 space-y-1">
                    {combinedResults.errors.map((error, index) => (
                      <div key={index} className="text-sm">• {error}</div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Individual API Results */}
            <div className="grid gap-4">
              
              {/* Experience Results */}
              {combinedResults.experience && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600">📋 Experience API</CardTitle>
                    <CardDescription>Indonesian Daily Boat Charter Details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><strong>Name:</strong> {combinedResults.experience.internalName}</div>
                      <div><strong>ID:</strong> {combinedResults.experience.id}</div>
                      <div><strong>Reference:</strong> {combinedResults.experience.reference || 'None'}</div>
                      <div><strong>Time Zone:</strong> {combinedResults.experience.timeZone}</div>
                      <div><strong>Instant Confirmation:</strong> {combinedResults.experience.instantConfirmation ? 'Yes' : 'No'}</div>
                      {combinedResults.experience.options && (
                        <div>
                          <strong>Available Units:</strong>
                          <div className="ml-4 mt-1">
                            {combinedResults.experience.options[0]?.units?.map((unit: any, index: number) => (
                              <div key={index} className="text-sm">
                                • {unit.internalName} (ID: {unit.id}) - {unit.type}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Availability Results */}
              {combinedResults.availability && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">📅 Availability API</CardTitle>
                    <CardDescription>Next 7 Days Availability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(combinedResults.availability) ? (
                      <div className="space-y-2">
                        {combinedResults.availability.slice(0, 3).map((slot: any, index: number) => (
                          <div key={index} className="border rounded p-2 bg-gray-50">
                            <div><strong>Date:</strong> {new Date(slot.localDateTimeStart).toLocaleDateString('en-GB')}</div>
                            <div><strong>Time:</strong> {new Date(slot.localDateTimeStart).toLocaleTimeString('en-GB')}</div>
                            <div><strong>Status:</strong> <span className="text-green-600 font-medium">{slot.status}</span></div>
                            <div><strong>Capacity:</strong> {slot.vacancies}/{slot.capacity} available</div>
                          </div>
                        ))}
                        {combinedResults.availability.length > 3 && (
                          <div className="text-sm text-gray-500">
                            ... and {combinedResults.availability.length - 3} more slots
                          </div>
                        )}
                      </div>
                    ) : (
                      <pre className="text-sm overflow-auto">{JSON.stringify(combinedResults.availability, null, 2)}</pre>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* OCTO Pricing Results */}
              {combinedResults.pricing && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-600">💰 OCTO Pricing API</CardTitle>
                    <CardDescription>Limited Pricing Information (OCTO)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><strong>Source:</strong> {combinedResults.pricing.source}</div>
                      <div><strong>Has Pricing:</strong> {combinedResults.pricing.pricing?.hasPricing ? 'Yes' : 'No'}</div>
                      {combinedResults.pricing.pricing?.units && (
                        <div>
                          <strong>Available Categories:</strong>
                          <div className="ml-4 mt-1">
                            {combinedResults.pricing.pricing.units.map((unit: any, index: number) => (
                              <div key={index} className="text-sm">
                                • {unit.name} ({unit.type}) - Pricing: {unit.pricingFrom || 'Not available'}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                        {combinedResults.pricing.pricing?.limitations}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Native Pricing Results */}
              {combinedResults.nativePricing && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-600">🎯 Native Bokun Pricing API</CardTitle>
                    <CardDescription>Real Pricing with Booking Channel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div><strong>Source:</strong> {combinedResults.nativePricing.source}</div>
                      <div><strong>Booking Channel:</strong> {combinedResults.nativePricing.bookingChannelUuid}</div>
                      <div><strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${
                          combinedResults.nativePricing.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {combinedResults.nativePricing.message}
                        </span>
                      </div>
                      
                      {combinedResults.nativePricing.pricing?.categories?.length > 0 && (
                        <div>
                          <strong>Real Pricing Categories:</strong>
                          <div className="ml-4 mt-2 space-y-2">
                            {combinedResults.nativePricing.pricing.categories.map((category: any, index: number) => (
                              <div key={index} className="border rounded p-3 bg-purple-50">
                                <div className="font-medium text-purple-700">{category.categoryName}</div>
                                <div className="text-sm space-y-1">
                                  <div><strong>Original:</strong> {category.originalPrice.display}</div>
                                  <div><strong>Converted:</strong> <span className="text-green-600 font-bold">{category.convertedPrice.display}</span></div>
                                  <div><strong>Date:</strong> {category.date}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {combinedResults.nativePricing.pricing?.availabilities?.length > 0 && (
                        <div>
                          <strong>Available Dates:</strong>
                          <div className="ml-4 mt-1 text-sm">
                            {combinedResults.nativePricing.pricing.availabilities.slice(0, 3).map((avail: any, index: number) => (
                              <div key={index}>• {avail.date} at {avail.time} - {avail.available ? 'Available' : 'Not available'}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {combinedResults.nativePricing.error && (
                        <div className="text-red-600 bg-red-50 p-2 rounded text-sm">
                          <strong>Error:</strong> {combinedResults.nativePricing.error}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>
          </div>
        )}

        {/* Configuration Info */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ API Configuration</CardTitle>
            <CardDescription>Current settings and authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Base URL:</strong> https://api.bokun.io/octo/v1</p>
                <p><strong>Experience ID:</strong> {BOAT_CHARTER_ID}</p>
                <p><strong>Option ID:</strong> 2017520</p>
              </div>
              <div>
                <p><strong>Authentication:</strong> Bearer Token (OCTO)</p>
                <p><strong>Token:</strong> 0cbcf997... (hidden)</p>
                <p><strong>Capabilities:</strong> pricing</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
} 