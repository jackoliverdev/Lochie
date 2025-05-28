'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { 
  X, 
  Clock, 
  Users, 
  Star, 
  Phone, 
  Calendar,
  Heart,
  Waves,
  Music,
  Camera,
  Anchor,
  Zap,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

interface Activity {
  id: number;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  icon: string;
  price: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  groupSize: string;
  highlights: string[];
  included: string[];
  gradient: string;
  rating: number;
  isIncluded: boolean;
}

const ActivitiesGrid = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const activities: Activity[] = [
    {
      id: 1,
      title: "Marine Adventures",
      category: "Snorkeling & Marine Life",
      description: "Swim with turtles, manta rays, sharks and tropical fish in crystal clear waters",
      fullDescription: "Embark on an underwater adventure like no other. Our Marine Adventures take you to the best snorkeling spots around the Gili Islands, where you'll swim alongside majestic sea turtles, graceful manta rays, reef sharks, and thousands of tropical fish. Our experienced guides know exactly where to find the marine life and will ensure you have the most incredible underwater experience.",
      image: "/gili/activities/snorkel.jpg",
      icon: "🐢",
      price: "Included",
      duration: "2-3 hours",
      difficulty: "Easy",
      groupSize: "Up to 8 people",
      highlights: [
        "Swim with sea turtles",
        "Encounter manta rays",
        "Spot reef sharks",
        "Discover underwater statues",
        "Professional guide included"
      ],
      included: [
        "Snorkeling equipment",
        "Professional guide",
        "Safety briefing",
        "Underwater photos"
      ],
      gradient: "from-cyan-500 to-blue-600",
      rating: 4.9,
      isIncluded: true
    },
    {
      id: 2,
      title: "Jet Ski Adventures",
      category: "High-Speed Thrills",
      description: "Feel the adrenaline rush on our premium jet skis across pristine waters",
      fullDescription: "Experience the ultimate adrenaline rush with our jet ski adventures! Race across the crystal-clear waters surrounding the Gili Islands on our top-of-the-line jet skis. Feel the wind in your hair and the spray of the ocean as you explore hidden coves, race around the islands, and create unforgettable memories. Perfect for thrill-seekers and adventure enthusiasts.",
      image: "/gili/activities/jetski.jpg",
      icon: "🏎️",
      price: "£75 per hour",
      duration: "30-60 minutes",
      difficulty: "Moderate",
      groupSize: "1-2 per jet ski",
      highlights: [
        "High-speed water adventure",
        "Explore hidden coves",
        "Professional instruction",
        "Safety equipment included",
        "Photo opportunities"
      ],
      included: [
        "Jet ski rental",
        "Safety briefing",
        "Life jackets",
        "Fuel included"
      ],
      gradient: "from-orange-500 to-red-600",
      rating: 4.8,
      isIncluded: false
    },
    {
      id: 3,
      title: "Kayaking & Paddle Boarding",
      category: "Peaceful Exploration",
      description: "Explore serene lagoons and coastlines at your own pace",
      fullDescription: "Discover the tranquil side of the Gili Islands with our kayaking and paddle boarding experiences. Glide through calm waters, explore hidden lagoons, and enjoy the peaceful serenity of island life. Perfect for all skill levels, our equipment is top quality and our guides can provide instruction for beginners or lead experienced paddlers to the best spots.",
      image: "/gili/activities/kayak.jpeg",
      icon: "🛶",
      price: "Included",
      duration: "Unlimited",
      difficulty: "Easy",
      groupSize: "Individual or groups",
      highlights: [
        "Peaceful water exploration",
        "Hidden lagoon access",
        "Beginner-friendly",
        "Unlimited use",
        "Professional instruction available"
      ],
      included: [
        "Kayak or paddle board",
        "Paddle and safety gear",
        "Basic instruction",
        "Life jackets"
      ],
      gradient: "from-green-500 to-emerald-600",
      rating: 4.7,
      isIncluded: true
    },
    {
      id: 4,
      title: "Wakeboarding",
      category: "Water Sports Mastery",
      description: "Master the waves with professional equipment and expert guidance",
      fullDescription: "Take your water sports skills to the next level with our wakeboarding experience. Whether you're a complete beginner or an experienced rider, our professional instructors will help you master this exciting sport. With top-quality equipment and perfect conditions in the protected waters around Gili Trawangan, you'll be carving wakes in no time.",
      image: "/gili/activities/waking.jpg",
      icon: "🏄‍♂️",
      price: "Included",
      duration: "Sessions available",
      difficulty: "Moderate",
      groupSize: "Individual sessions",
      highlights: [
        "Professional instruction",
        "High-quality equipment",
        "Perfect learning conditions",
        "Progressive skill building",
        "Action photography"
      ],
      included: [
        "Wakeboard and bindings",
        "Professional instructor",
        "Safety equipment",
        "Boat and driver"
      ],
      gradient: "from-purple-500 to-pink-600",
      rating: 4.8,
      isIncluded: true
    },
    {
      id: 5,
      title: "Premium Sound System",
      category: "Entertainment",
      description: "Bring your own music and create the perfect party atmosphere",
      fullDescription: "Set the mood for your perfect day with our premium sound system. Connect your phone via Bluetooth and play your favourite tunes while you cruise, snorkel, or relax on deck. Our high-quality marine audio system ensures crystal clear sound that enhances every moment of your luxury boat experience.",
      image: "/gili/boat-features.jpg",
      icon: "🎵",
      price: "Included",
      duration: "All day",
      difficulty: "Easy",
      groupSize: "Entire group",
      highlights: [
        "Bluetooth connectivity",
        "Premium marine audio",
        "Crystal clear sound",
        "Weather-resistant",
        "Easy to use"
      ],
      included: [
        "Bluetooth sound system",
        "Audio cable backup",
        "Volume control",
        "Weather protection"
      ],
      gradient: "from-indigo-500 to-purple-600",
      rating: 4.9,
      isIncluded: true
    },
    {
      id: 6,
      title: "Sunrise & Sunset Cruises",
      category: "Scenic Beauty",
      description: "Witness magical golden hours with breathtaking views",
      fullDescription: "Experience the most magical moments of the day with our sunrise and sunset cruises. Watch as the sky transforms into a canvas of gold, orange, and pink hues reflecting off the calm waters. These peaceful cruises offer the perfect romantic setting or tranquil moment to appreciate the natural beauty of the Gili Islands.",
      image: "/gili/sunset.jpg",
      icon: "🌅",
      price: "Included",
      duration: "1-2 hours",
      difficulty: "Easy",
      groupSize: "Up to 8 people",
      highlights: [
        "Spectacular sunrise/sunset views",
        "Perfect photo opportunities",
        "Romantic atmosphere",
        "Peaceful sailing",
        "Complimentary refreshments"
      ],
      included: [
        "Scenic cruise",
        "Comfortable seating",
        "Photo assistance",
        "Light refreshments"
      ],
      gradient: "from-yellow-500 to-orange-600",
      rating: 5.0,
      isIncluded: true
    },
    {
      id: 7,
      title: "Luxury Picnics",
      category: "Gourmet Dining",
      description: "Enjoy gourmet meals in stunning seaside locations",
      fullDescription: "Indulge in a luxury picnic experience like no other. We'll anchor in a beautiful secluded spot where you can enjoy gourmet meals prepared with fresh, local ingredients. From tropical fruits to fresh seafood, our luxury picnics offer a perfect blend of fine dining and natural beauty in an unforgettable setting.",
      image: "/gili/picnic.jpg",
      icon: "🧺",
      price: "£25 per person",
      duration: "1-2 hours",
      difficulty: "Easy",
      groupSize: "Up to 8 people",
      highlights: [
        "Gourmet meals",
        "Fresh local ingredients",
        "Stunning locations",
        "Professional service",
        "Dietary accommodations"
      ],
      included: [
        "Gourmet meal",
        "Premium beverages",
        "Table service",
        "Scenic location"
      ],
      gradient: "from-rose-500 to-pink-600",
      rating: 4.9,
      isIncluded: false
    },
    {
      id: 8,
      title: "Island Hopping",
      category: "Exploration",
      description: "Discover multiple islands and their unique characters",
      fullDescription: "Explore the unique character of each Gili Island with our comprehensive island hopping experience. Visit Gili Trawangan's vibrant beaches, discover Gili Meno's tranquil beauty, and explore Gili Air's local charm. Each island offers its own personality, from bustling beach clubs to pristine coral reefs and secluded beaches.",
      image: "/gili/island-hop.jpg",
      icon: "🏝️",
      price: "Included",
      duration: "Full day",
      difficulty: "Easy",
      groupSize: "Up to 8 people",
      highlights: [
        "Visit all three Gili Islands",
        "Unique island experiences",
        "Local cultural insights",
        "Multiple snorkeling spots",
        "Beach time on each island"
      ],
      included: [
        "Transportation between islands",
        "Guide commentary",
        "Multiple stops",
        "Free time on each island"
      ],
      gradient: "from-emerald-500 to-teal-600",
      rating: 4.8,
      isIncluded: true
    },
    {
      id: 9,
      title: "Inflatable Unicorn",
      category: "Fun & Games",
      description: "Giant floating fun for all ages and Instagram-worthy photos",
      fullDescription: "Add some whimsical fun to your boat charter with our giant inflatable unicorn! This Instagram-famous floating toy provides hours of entertainment for guests of all ages. Perfect for photos, relaxation, or just having a laugh with friends and family. The unicorn is stable, safe, and guaranteed to bring smiles to everyone's faces.",
      image: "/gili/unicorn.jpg",
      icon: "🦄",
      price: "Included",
      duration: "All day",
      difficulty: "Easy",
      groupSize: "Multiple users",
      highlights: [
        "Instagram-worthy photos",
        "Fun for all ages",
        "Safe and stable",
        "Great for groups",
        "Memory maker"
      ],
      included: [
        "Giant inflatable unicorn",
        "Safety supervision",
        "Photo assistance",
        "Inflation/deflation service"
      ],
      gradient: "from-pink-500 to-purple-600",
      rating: 4.9,
      isIncluded: true
    },
    {
      id: 10,
      title: "Onboard Mini Bar",
      category: "Refreshments",
      description: "Premium beverages and tropical cocktails served onboard",
      fullDescription: "Quench your thirst in style with our fully stocked onboard mini bar. From ice-cold beers and premium spirits to tropical cocktails and fresh juices, we have everything you need to stay refreshed during your adventure. Our experienced crew can mix your favourite drinks while you relax and enjoy the stunning scenery.",
      image: "/gili/minibar.jpg",
      icon: "🍹",
      price: "£15-35 per drink",
      duration: "All day",
      difficulty: "Easy",
      groupSize: "Entire group",
      highlights: [
        "Premium spirits",
        "Tropical cocktails",
        "Ice-cold beers",
        "Fresh juices",
        "Professional service"
      ],
      included: [
        "Bar service",
        "Ice and mixers",
        "Glassware",
        "Professional bartender"
      ],
      gradient: "from-amber-500 to-orange-600",
      rating: 4.7,
      isIncluded: false
    },
    {
      id: 11,
      title: "Private Parties",
      category: "Celebrations",
      description: "Celebrate special occasions in paradise with custom arrangements",
      fullDescription: "Make your special celebration unforgettable with our private party services. Whether it's a birthday, anniversary, proposal, or just a celebration of life, we'll help you create the perfect party atmosphere. From decorations and special menus to coordinating with local musicians or photographers, we ensure your celebration is truly magical.",
      image: "/gili/party.jpg",
      icon: "🎉",
      price: "Custom pricing",
      duration: "Full day",
      difficulty: "Easy",
      groupSize: "Up to 8 people",
      highlights: [
        "Custom party planning",
        "Special decorations",
        "Personalised service",
        "Photo coordination",
        "Memory making"
      ],
      included: [
        "Party coordination",
        "Basic decorations",
        "Special attention",
        "Photo assistance"
      ],
      gradient: "from-violet-500 to-purple-600",
      rating: 5.0,
      isIncluded: false
    },
    {
      id: 12,
      title: "Banana Boat Rides",
      category: "Group Fun",
      description: "Thrilling group rides perfect for big groups and team building",
      fullDescription: "Experience the classic thrill of banana boat rides! Perfect for groups looking for shared excitement and laughter. Hold on tight as you're pulled behind our boat on this inflatable banana-shaped ride. With plenty of splashing, bouncing, and inevitable tumbles into the warm tropical waters, it's guaranteed fun for everyone involved.",
      image: "/gili/banana-boat.jpg",
      icon: "🍌",
      price: "£35 per group",
      duration: "15-30 minutes",
      difficulty: "Moderate",
      groupSize: "4-6 people",
      highlights: [
        "Classic water ride",
        "Perfect for groups",
        "Lots of laughs",
        "Team building",
        "Safe and supervised"
      ],
      included: [
        "Banana boat rental",
        "Safety equipment",
        "Professional driver",
        "Safety briefing"
      ],
      gradient: "from-yellow-500 to-yellow-600",
      rating: 4.6,
      isIncluded: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-20 left-10 opacity-5">
        <Waves className="w-40 h-40 text-cyan-500 animate-pulse" />
      </div>
      <div className="absolute bottom-10 right-20 opacity-5">
        <Anchor className="w-32 h-32 text-blue-500 animate-float" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 rounded-full px-6 py-2 text-cyan-600 text-sm font-medium">
            <Star className="w-4 h-4 fill-current" />
            <span>12 Unique Experiences</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Adventure
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From heart-pumping water sports to peaceful explorations, 
            discover the perfect activities for your luxury boat experience.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`group relative cursor-pointer transition-all duration-500 hover:scale-105 animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(activity.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setSelectedActivity(activity)}
            >
              <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                
                {/* Background Image */}
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${activity.gradient}/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  
                  {/* Top Section */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                        {activity.icon}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 ${activity.isIncluded ? 'bg-green-500/80' : 'bg-orange-500/80'} backdrop-blur-sm rounded-full text-xs font-medium`}>
                          {activity.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-400" />
                          <span className="text-xs">{activity.rating}</span>
                        </div>
                      </div>
                    </div>
                    {activity.isIncluded && (
                      <Heart className="w-5 h-5 fill-current text-red-400" />
                    )}
                  </div>

                  {/* Bottom Section */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold leading-tight mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-cyan-200 text-sm font-light">
                        {activity.category}
                      </p>
                      <p className="text-gray-200 text-sm leading-relaxed line-clamp-2 mt-2">
                        {activity.description}
                      </p>
                    </div>

                    {/* Hover CTA */}
                    <div className={`transition-all duration-300 ${
                      hoveredCard === activity.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{activity.duration}</span>
                        <span className="mx-2">•</span>
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{activity.groupSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="relative h-48">
              <Image
                src={selectedActivity.image}
                alt={selectedActivity.title}
                fill
                className="object-cover object-center rounded-t-3xl"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${selectedActivity.gradient}/80 via-black/40 to-transparent rounded-t-3xl`} />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Content */}
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                    {selectedActivity.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedActivity.title}</h2>
                    <p className="text-cyan-200 text-sm">{selectedActivity.category}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-cyan-600">{selectedActivity.price}</div>
                  <div className="text-xs text-gray-600">Price</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-blue-600">{selectedActivity.duration}</div>
                  <div className="text-xs text-gray-600">Duration</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-emerald-600">{selectedActivity.difficulty}</div>
                  <div className="text-xs text-gray-600">Difficulty</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-purple-600">{selectedActivity.rating}★</div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600 leading-relaxed">{selectedActivity.fullDescription}</p>
              </div>

              {/* Highlights & What's Included in one row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Highlights</h3>
                  <div className="space-y-2">
                    {selectedActivity.highlights.slice(0, 3).map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">What's Included</h3>
                  <div className="space-y-2">
                    {selectedActivity.included.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3 pt-4 border-t">
                <Link 
                  href="/booking#booking-calendar"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Link>
                
                <button 
                  onClick={() => setSelectedActivity(null)}
                  className="flex-1 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 py-3 px-6 rounded-xl font-semibold transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ActivitiesGrid; 