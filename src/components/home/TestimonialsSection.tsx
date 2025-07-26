"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Avatar, Typography, Rate, Row, Col, Button } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CommentOutlined,
  CheckCircleOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useInView } from "react-intersection-observer";

const { Title, Paragraph, Text } = Typography;

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
  story: string;
  impact: {
    type: "helped" | "received";
    category: string;
    achievement: string;
  };
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Maria Gonzalez",
    role: "Community Volunteer",
    location: "Los Angeles, CA",
    avatar: "MG",
    rating: 5,
    quote:
      "This platform transformed how I help my community. I've been able to provide meals to over 200 families through coordinated food drives.",
    story:
      "As a working mother, I always wanted to help but didn't know where to start. Hands2gether made it so easy to organize and track my contributions.",
    impact: {
      type: "helped",
      category: "Food Assistance",
      achievement: "200+ families fed",
    },
    verified: true,
  },
  {
    id: 2,
    name: "James Peterson",
    role: "Single Father",
    location: "Denver, CO",
    avatar: "JP",
    rating: 5,
    quote:
      "When I lost my job, this community stepped up immediately. Within 48 hours, I had groceries, warm clothes for my kids, and even job leads.",
    story:
      "The platform connected me with local families and organizations. Not only did I receive help, but I've since been able to give back by teaching coding workshops.",
    impact: {
      type: "received",
      category: "Emergency Aid",
      achievement: "Back on my feet",
    },
    verified: true,
  },
  {
    id: 3,
    name: "Dr. Sarah Kim",
    role: "Skills Trainer",
    location: "Seattle, WA",
    avatar: "SK",
    rating: 5,
    quote:
      "I've taught digital literacy to over 150 seniors through this platform. Seeing them connect with family via video calls is priceless.",
    story:
      "Retirement gave me time to share my tech expertise. The platform's scheduling and tracking tools make it easy to manage multiple training sessions.",
    impact: {
      type: "helped",
      category: "Education",
      achievement: "150+ seniors trained",
    },
    verified: true,
  },
  {
    id: 4,
    name: "Ahmed Rahman",
    role: "Small Business Owner",
    location: "Chicago, IL",
    avatar: "AR",
    rating: 5,
    quote:
      "The business mentorship I received here helped me grow my restaurant from struggling to thriving. Now I provide free meals to those in need.",
    story:
      "During the pandemic, my restaurant was failing. Through this platform, I connected with experienced entrepreneurs who guided me to success.",
    impact: {
      type: "received",
      category: "Business Mentorship",
      achievement: "Business turned around",
    },
    verified: true,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Retired Teacher",
    location: "Austin, TX",
    avatar: "LT",
    rating: 5,
    quote:
      "Teaching literacy to adult learners through this platform has been the most rewarding part of my retirement. We've helped 80+ adults read to their children.",
    story:
      "The platform's education matching system connected me with adults who needed reading help. Seeing parents read bedtime stories to their kids for the first time is magical.",
    impact: {
      type: "helped",
      category: "Adult Literacy",
      achievement: "80+ adults can now read",
    },
    verified: true,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1;
      }
    });
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !inView) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, inView, currentIndex]);

  const currentTestimonial = testimonials[currentIndex];

  // Safety check for testimonial
  if (!currentTestimonial) {
    return null;
  }

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <CommentOutlined className="absolute top-20 left-20 text-6xl text-blue-300 transform -rotate-12" />
          <CommentOutlined className="absolute bottom-20 right-20 text-6xl text-purple-300 transform rotate-12" />
          <HeartFilled className="absolute top-1/2 left-1/4 text-4xl text-pink-300 transform -rotate-45" />
          <HeartFilled className="absolute top-1/3 right-1/3 text-4xl text-red-300 transform rotate-45" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Title
            level={2}
            className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Stories That Inspire Change
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real people sharing how Hands2gether has transformed their
            communities and lives
          </Paragraph>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Row gutter={[48, 32]} align="middle">
            {/* Main Testimonial */}
            <Col xs={24} lg={14}>
              <div className="relative h-96">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                  >
                    <Card
                      className="h-full bg-white/80 backdrop-blur-md border-0 shadow-2xl"
                      bodyStyle={{
                        padding: "3rem",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <Avatar
                            size={64}
                            style={{
                              backgroundColor: "#1890ff",
                              fontSize: "20px",
                              fontWeight: "bold",
                            }}
                          >
                            {currentTestimonial.avatar}
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <Text className="text-lg font-semibold text-gray-800">
                                {currentTestimonial.name}
                              </Text>
                              {currentTestimonial.verified && (
                                <CheckCircleOutlined className="text-blue-500" />
                              )}
                            </div>
                            <Text className="text-gray-600">
                              {currentTestimonial.role}
                            </Text>
                            <Text className="text-sm text-gray-500">
                              {currentTestimonial.location}
                            </Text>
                          </div>
                        </div>
                        <Rate
                          disabled
                          defaultValue={currentTestimonial.rating}
                        />
                      </div>

                      {/* Quote */}
                      <div className="mb-6 flex-1">
                        <CommentOutlined className="text-3xl text-blue-400 mb-4" />
                        <Paragraph className="text-lg text-gray-700 italic leading-relaxed">
                          "{currentTestimonial.quote}"
                        </Paragraph>
                      </div>

                      {/* Impact Badge */}
                      <div className="mb-6">
                        <div
                          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                            currentTestimonial.impact.type === "helped"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {currentTestimonial.impact.category}
                          </span>
                          <span className="text-xs">•</span>
                          <span className="text-sm">
                            {currentTestimonial.impact.achievement}
                          </span>
                        </div>
                      </div>

                      {/* Story */}
                      <Paragraph className="text-gray-600 leading-relaxed">
                        {currentTestimonial.story}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Col>

            {/* Navigation and Stats */}
            <Col xs={24} lg={10}>
              <motion.div
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={fadeInUp}
                className="space-y-8"
              >
                {/* Navigation */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    onClick={() => paginate(-1)}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                  />

                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDirection(index > currentIndex ? 1 : -1);
                          setCurrentIndex(index);
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-blue-500 scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    type="text"
                    icon={<RightOutlined />}
                    onClick={() => paginate(1)}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                  />
                </div>

                {/* Community Stats */}
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
                  <div className="text-center p-4">
                    <Title level={4} className="mb-4 text-gray-800">
                      Our Community Impact
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            4.9/5
                          </div>
                          <div className="text-sm text-gray-600">
                            Average Rating
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            98%
                          </div>
                          <div className="text-sm text-gray-600">
                            Success Rate
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            1,247
                          </div>
                          <div className="text-sm text-gray-600">Reviews</div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            24/7
                          </div>
                          <div className="text-sm text-gray-600">Support</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>

                {/* CTA */}
                <div className="text-center">
                  <Paragraph className="text-gray-600 mb-4">
                    Ready to create your own success story?
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Join Our Community
                  </Button>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
}
