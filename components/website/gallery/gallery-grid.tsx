'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn, Heart, Share2, Download, Camera } from 'lucide-react';

export const GalleryGrid = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const galleryImages = [
    {
      id: 1,
      src: "/gili/activities/waking.jpg",
      title: "Wakeboarding Excellence",
      category: "Water Sports",
      description: "Master the waves with professional wakeboarding equipment",
      size: "large" // spans 2 columns
    },
    {
      id: 2,
      src: "/gili/activities/snorkel.jpg",
      title: "Underwater Paradise",
      category: "Snorkeling",
      description: "Swim with turtles and tropical fish in crystal waters",
      size: "medium"
    },
    {
      id: 3,
      src: "/gili/activities/jetski.jpg",
      title: "Jet Ski Adventures",
      category: "Adrenaline",
      description: "Feel the thrill on crystal clear waters",
      size: "medium"
    },
    {
      id: 4,
      src: "/gili/activities/paddle.jpg",
      title: "Stand Up Paddle Boarding",
      category: "Peaceful",
      description: "Explore pristine waters at your own pace",
      size: "large"
    },
    {
      id: 5,
      src: "/gili/activities/kayak.jpeg",
      title: "Kayaking Adventures",
      category: "Exploration",
      description: "Discover hidden lagoons and secret spots",
      size: "medium"
    },
    {
      id: 6,
      src: "/gili/gilit2.jpg",
      title: "Gili Islands Paradise",
      category: "Scenic",
      description: "Breathtaking aerial views of crystal waters",
      size: "large"
    }
  ];

  const toggleLike = (imageId: number) => {
    setLikedImages(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(imageId)) {
        newLiked.delete(imageId);
      } else {
        newLiked.add(imageId);
      }
      return newLiked;
    });
  };

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const selectedImageData = selectedImage ? galleryImages.find(img => img.id === selectedImage) : null;

  return (
    <>
      <section ref={containerRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Section Header */}
          <motion.div
            className="text-center mb-16 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 rounded-full px-6 py-2 text-cyan-600 text-sm font-medium">
              <Camera className="w-4 h-4" />
              <span>Adventure Gallery</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Epic{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Moments
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive into our collection of breathtaking moments captured during unforgettable adventures
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                className={`group cursor-pointer relative ${
                  image.size === 'large' ? 'md:col-span-2' : 'col-span-1'
                } ${
                  image.size === 'large' ? 'h-80' : 'h-64'
                }`}
              >
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  
                  {/* Image */}
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    
                    {/* Top Actions */}
                    <div className="flex items-start justify-between">
                      <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-white text-xs font-medium">
                        {image.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(image.id);
                          }}
                          className={`w-8 h-8 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 ${
                            likedImages.has(image.id) 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedImages.has(image.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-300">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                      <p className="text-gray-200 text-sm mb-4">{image.description}</p>
                      <button
                        onClick={() => openLightbox(image.id)}
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 group/btn"
                      >
                        <ZoomIn className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                        View Full Size
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30">
              Load More Photos
            </button>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && selectedImageData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="relative w-full h-full max-h-[80vh] rounded-2xl overflow-hidden">
              <Image
                src={selectedImageData.src}
                alt={selectedImageData.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium mb-2">
                    {selectedImageData.category}
                  </span>
                  <h3 className="text-2xl font-bold mb-2">{selectedImageData.title}</h3>
                  <p className="text-gray-300">{selectedImageData.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleLike(selectedImageData.id)}
                    className={`w-12 h-12 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 ${
                      likedImages.has(selectedImageData.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedImages.has(selectedImageData.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-300">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}; 