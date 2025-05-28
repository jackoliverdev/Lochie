'use client';

import { useState, useEffect } from "react";
import { 
  Waves, 
  Settings,
  Edit,
  Eye,
  Plus,
  Calendar,
  Clock,
  Users,
  MapPin,
  RefreshCw,
  Anchor
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number; // in hours
  maxGuests: number;
  basePrice: number;
  currency: string;
  location: string;
  status: 'active' | 'inactive';
  bokunId?: string;
  optionId?: string;
  pricingCategoryId?: string;
}

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockActivities: Activity[] = [
          {
            id: 'ACT-001',
            name: 'Indonesian Daily Boat Charter',
            description: 'Full day private boat charter around the beautiful islands of Gili Trawangan with snorkeling, swimming, and local cuisine.',
            duration: 8,
            maxGuests: 8,
            basePrice: 50,
            currency: 'GBP',
            location: 'Gili Trawangan, Lombok',
            status: 'active',
            bokunId: '1031959',
            optionId: '2017520',
            pricingCategoryId: '1001055'
          },
          {
            id: 'ACT-002',
            name: 'Sunset Charter Experience',
            description: 'Romantic sunset cruise with champagne and light snacks, perfect for couples.',
            duration: 3,
            maxGuests: 6,
            basePrice: 75,
            currency: 'GBP',
            location: 'Gili Trawangan, Lombok',
            status: 'active'
          },
          {
            id: 'ACT-003',
            name: 'Snorkeling Adventure',
            description: 'Half day snorkeling tour to the best spots around the Gili Islands.',
            duration: 4,
            maxGuests: 10,
            basePrice: 35,
            currency: 'GBP',
            location: 'Gili Islands',
            status: 'inactive'
          }
        ];
        
        setActivities(mockActivities);
        setLoading(false);
      }, 1000);
    };

    fetchActivities();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-100';
      case 'inactive':
        return 'text-gray-700 bg-gray-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activities Management</h1>
          <p className="text-gray-600 mt-1">Manage your boat charter activities, pricing, and availability</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Activity
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Waves className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Activities</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.reduce((sum, a) => sum + a.maxGuests, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              
              {/* Activity Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Anchor className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
                      <p className="text-sm text-gray-500">{activity.id}</p>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {activity.description}
                </p>
              </div>

              {/* Activity Details */}
              <div className="p-6 space-y-4">
                
                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{activity.duration}h duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Max {activity.maxGuests}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{activity.location}</span>
                </div>

                {/* Bokun Integration Info */}
                {activity.bokunId && (
                  <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                    <div className="text-xs font-medium text-blue-700">Bokun Integration</div>
                    <div className="text-xs text-blue-600">Activity ID: {activity.bokunId}</div>
                    {activity.optionId && (
                      <div className="text-xs text-blue-600">Option ID: {activity.optionId}</div>
                    )}
                    {activity.pricingCategoryId && (
                      <div className="text-xs text-blue-600">Pricing Category: {activity.pricingCategoryId}</div>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">Starting from</div>
                    <div className="text-lg font-bold text-gray-900">
                      £{activity.basePrice}
                      <span className="text-sm font-normal text-gray-500"> per person</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start gap-3 p-4 h-auto">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Manage Availability</div>
              <div className="text-xs text-gray-500">Set dates and time slots</div>
            </div>
          </Button>

          <Button variant="outline" className="justify-start gap-3 p-4 h-auto">
            <Settings className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium">Pricing Rules</div>
              <div className="text-xs text-gray-500">Configure pricing strategies</div>
            </div>
          </Button>

          <Button variant="outline" className="justify-start gap-3 p-4 h-auto">
            <Waves className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium">Bokun Sync</div>
              <div className="text-xs text-gray-500">Synchronise with booking system</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage; 