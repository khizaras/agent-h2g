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
      className="testimonials-section"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Pattern */}
      <div className="testimonials-bg-pattern">
        <div className="testimonials-bg-icons">
          <CommentOutlined className="testimonial-icon testimonial-icon-1" />
          <CommentOutlined className="testimonial-icon testimonial-icon-2" />
          <HeartFilled className="testimonial-icon testimonial-icon-3" />
          <HeartFilled className="testimonial-icon testimonial-icon-4" />
        </div>
      </div>

      <div className="testimonials-container">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="section-header"
        >
          <Title level={2} className="section-title">
            Stories That Inspire Change
          </Title>
          <Paragraph className="section-description">
            Real people sharing how Hands2gether has transformed their
            communities and lives
          </Paragraph>
        </motion.div>

        <div className="testimonials-content">
          <Row gutter={[48, 32]} align="middle">
            {/* Main Testimonial */}
            <Col xs={24} lg={14}>
              <div className="testimonial-carousel">
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
                    className="testimonial-slide"
                  >
                    <Card
                      className="testimonial-card-main"
                      bodyStyle={{
                        padding: "3rem",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Header */}
                      <div className="testimonial-header">
                        <div className="testimonial-author-section">
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
                            <div className="testimonial-author-header">
                              <Text className="testimonial-author-name">
                                {currentTestimonial.name}
                              </Text>
                              {currentTestimonial.verified && (
                                <CheckCircleOutlined className="testimonial-verified" />
                              )}
                            </div>
                            <Text className="testimonial-author-role">
                              {currentTestimonial.role}
                            </Text>
                            <Text className="testimonial-author-location">
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
                      <div className="testimonial-quote-section">
                        <CommentOutlined className="testimonial-quote-icon" />
                        <Paragraph className="testimonial-quote-text">
                          "{currentTestimonial.quote}"
                        </Paragraph>
                      </div>

                      {/* Impact Badge */}
                      <div className="testimonial-impact">
                        <div
                          className={`testimonial-impact-badge ${
                            currentTestimonial.impact.type === "helped"
                              ? "testimonial-impact-helped"
                              : "testimonial-impact-received"
                          }`}
                        >
                          <span className="testimonial-impact-category">
                            {currentTestimonial.impact.category}
                          </span>
                          <span className="testimonial-impact-separator">
                            •
                          </span>
                          <span className="testimonial-impact-achievement">
                            {currentTestimonial.impact.achievement}
                          </span>
                        </div>
                      </div>

                      {/* Story */}
                      <Paragraph className="testimonial-story">
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
                className="testimonial-nav-container"
              >
                {/* Navigation */}
                <div className="testimonial-nav">
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    onClick={() => paginate(-1)}
                    className="testimonial-nav-btn"
                  />

                  <div className="testimonial-dots">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDirection(index > currentIndex ? 1 : -1);
                          setCurrentIndex(index);
                        }}
                        className={`testimonial-dot ${
                          index === currentIndex
                            ? "testimonial-dot-active"
                            : "testimonial-dot-inactive"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    type="text"
                    icon={<RightOutlined />}
                    onClick={() => paginate(1)}
                    className="testimonial-nav-btn"
                  />
                </div>

                {/* Community Stats */}
                <Card className="testimonial-stats-card">
                  <div className="testimonial-stats-content">
                    <Title level={4} className="testimonial-stats-title">
                      Our Community Impact
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <div className="testimonial-stat">
                          <div className="testimonial-stat-value testimonial-stat-blue">
                            4.9/5
                          </div>
                          <div className="testimonial-stat-label">
                            Average Rating
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="testimonial-stat">
                          <div className="testimonial-stat-value testimonial-stat-purple">
                            98%
                          </div>
                          <div className="testimonial-stat-label">
                            Success Rate
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="testimonial-stat">
                          <div className="testimonial-stat-value testimonial-stat-green">
                            1,247
                          </div>
                          <div className="testimonial-stat-label">Reviews</div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="testimonial-stat">
                          <div className="testimonial-stat-value testimonial-stat-orange">
                            24/7
                          </div>
                          <div className="testimonial-stat-label">Support</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>

                {/* CTA */}
                <div className="testimonial-cta">
                  <Paragraph className="testimonial-cta-text">
                    Ready to create your own success story?
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    className="testimonial-cta-btn"
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
