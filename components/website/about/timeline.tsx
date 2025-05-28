"use client";

import React from "react";
import { Anchor, Award, Globe, Lightbulb, Cpu, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const CompanyHistory = () => {
  const milestones = [
    {
      year: "2016",
      title: "Setting Sail",
      description: "Founded with a single boat and a dream to share the beauty of Gili Islands with the world",
      icon: <Anchor className="h-8 w-8 text-cyan-500" />,
    },
    {
      year: "2018",
      title: "Excellence Recognition",
      description: "Achieved TripAdvisor Certificate of Excellence and became the top-rated boat tour operator",
      icon: <Award className="h-8 w-8 text-cyan-500" />,
    },
    {
      year: "2019",
      title: "Fleet Expansion",
      description: "Expanded to multiple luxury vessels serving all three Gili Islands with premium experiences",
      icon: <Globe className="h-8 w-8 text-cyan-500" />,
    },
    {
      year: "2021",
      title: "Innovation Focus",
      description: "Introduced eco-friendly practices and sustainable tourism initiatives for ocean conservation",
      icon: <Lightbulb className="h-8 w-8 text-cyan-500" />,
    },
    {
      year: "2022",
      title: "Digital Transformation",
      description: "Launched online booking platform and real-time availability system for seamless experiences",
      icon: <Cpu className="h-8 w-8 text-cyan-500" />,
    },
    {
      year: "2024",
      title: "Community Growth",
      description: "Reached 10,000+ happy guests and became the most trusted luxury boat tour operator in Indonesia",
      icon: <Users className="h-8 w-8 text-cyan-500" />,
    },
  ];

  return (
    <section id="our-story" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 rounded-full px-6 py-2 text-cyan-600 text-sm font-medium mb-4">
            Our Journey
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            From Dream to{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Reality
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the milestones that shaped our journey to becoming the premier luxury boat tour experience in Gili Islands
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden md:block relative mt-10 mb-20">
          {/* Main central timeline line - thicker and more visible */}
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-cyan-500 to-blue-600 z-10 rounded-full"
          ></motion.div>
          
          <div className="relative">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={milestone.year} 
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                className={`flex ${index % 2 === 0 ? '' : 'flex-row-reverse'} ${index !== 0 ? 'mt-[-60px]' : ''} mb-4`}
                style={{ zIndex: 30 - index }}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-6' : 'pl-6'}`}>
                  <div className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 backdrop-blur-sm rounded-2xl group">
                    <div className="p-6">
                      <p className="text-sm font-bold text-cyan-500 mb-1">{milestone.year}</p>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors duration-300">{milestone.title}</h3>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-2/12 flex justify-center">
                  {/* Timeline circle with icon - centered on the vertical line */}
                  <div className="z-20 relative top-6" style={{ marginLeft: "8px" }}>
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                      className="w-16 h-16 rounded-full bg-white border-4 border-cyan-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group"
                    >
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        {milestone.icon}
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                <div className="w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden relative">
          {/* Vertical timeline line - centered in the available space */}
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-5 top-0 bottom-0 w-2 bg-gradient-to-b from-cyan-500 to-blue-600 z-0 rounded-full"
          ></motion.div>
          
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={milestone.year} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                className={`relative ${index !== 0 ? 'mt-[-5px]' : ''} pl-12`} 
                style={{ zIndex: 20 - index }}
              >
                {/* Timeline circle - centered directly on the line */}
                <div className="absolute left-0 top-4 flex items-center justify-center z-10">
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                    style={{ marginLeft: '3px' }}
                    className="w-10 h-10 rounded-full bg-white border-4 border-cyan-500 flex items-center justify-center shadow-lg backdrop-blur-sm"
                  >
                    <div className="scale-75">
                      {React.cloneElement(milestone.icon as React.ReactElement, { 
                        className: "h-5 w-5 text-cyan-500" 
                      })}
                    </div>
                  </motion.div>
                </div>
                
                <div className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 backdrop-blur-sm rounded-2xl">
                  <div className="p-4">
                    <p className="text-sm font-bold text-cyan-500 mb-1">{milestone.year}</p>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{milestone.title}</h3>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 