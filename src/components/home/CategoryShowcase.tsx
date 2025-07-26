"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, Row, Col, Typography, Button, Space, Statistic } from "antd";
import {
  HeartOutlined,
  BookOutlined,
  UserOutlined,
  ArrowRightOutlined,
  GlobalOutlined,
  TeamOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { unsplashImages, getCategoryImage } from "@/services/unsplashService";

const { Title, Paragraph } = Typography;

const categories = [
  {
    id: "emergency-relief",
    title: "Emergency Relief",
    description:
      "Immediate food assistance and emergency support for families in crisis situations.",
    icon: <HeartOutlined className="text-4xl" />,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50",
    stats: { causes: 1247, helped: 8942 },
    features: [
      "Emergency Food Relief",
      "Crisis Support",
      "Disaster Response",
      "Immediate Aid",
    ],
    image: unsplashImages.categories["emergency-relief"],
  },
  {
    id: "food-banks",
    title: "Food Banks",
    description:
      "Organized food distribution centers providing consistent support to community members.",
    icon: <GlobalOutlined className="text-4xl" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    stats: { causes: 856, helped: 5634 },
    features: [
      "Food Pantries",
      "Bulk Distribution",
      "Regular Support",
      "Community Centers",
    ],
    image: unsplashImages.categories["food-banks"],
  },
  {
    id: "community-kitchens",
    title: "Community Kitchens",
    description:
      "Shared cooking spaces and meal preparation programs bringing communities together.",
    icon: <TeamOutlined className="text-4xl" />,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    stats: { causes: 423, helped: 3251 },
    features: [
      "Shared Meals",
      "Cooking Classes",
      "Community Spaces",
      "Cultural Exchange",
    ],
    image: unsplashImages.categories["community-kitchens"],
  },
  {
    id: "school-meals",
    title: "School Programs",
    description:
      "Supporting children's nutrition through school meal programs and educational initiatives.",
    icon: <BookOutlined className="text-4xl" />,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    stats: { causes: 312, helped: 2876 },
    features: [
      "Breakfast Programs",
      "Lunch Support",
      "Nutrition Education",
      "Weekend Bags",
    ],
    image: unsplashImages.categories["school-meals"],
  },
  {
    id: "senior-support",
    title: "Senior Support",
    description:
      "Specialized meal delivery and nutrition programs for elderly community members.",
    icon: <UserOutlined className="text-4xl" />,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50",
    stats: { causes: 234, helped: 1892 },
    features: [
      "Meal Delivery",
      "Senior Centers",
      "Health Programs",
      "Social Connection",
    ],
    image: unsplashImages.categories["senior-support"],
  },
  {
    id: "holiday-meals",
    title: "Holiday Programs",
    description:
      "Special holiday meal programs ensuring no one goes without during celebrations.",
    icon: <GiftOutlined className="text-4xl" />,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    stats: { causes: 189, helped: 1456 },
    features: [
      "Holiday Dinners",
      "Food Baskets",
      "Community Celebrations",
      "Family Support",
    ],
    image: unsplashImages.categories["holiday-meals"],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardHover = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

export function CategoryShowcase() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="grid grid-cols-8 gap-4 transform -rotate-12 scale-150">
            {[...Array(64)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full opacity-20"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <Title
              level={2}
              className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Three Ways to Make a Difference
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose your impact area and join thousands of community members
              already making a difference
            </Paragraph>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <Row gutter={[32, 32]} className="max-w-7xl mx-auto">
            {categories.map((category, index) => (
              <Col xs={24} lg={8} key={category.id}>
                <motion.div
                  variants={fadeInUp}
                  whileHover="hover"
                  className="h-full"
                >
                  <Card
                    className={`h-full hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden group relative ${category.bgColor}`}
                    bodyStyle={{ padding: 0 }}
                  >
                    {/* Header with Icon and Stats */}
                    <div
                      className={`bg-gradient-to-r ${category.color} p-8 text-white relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 opacity-10">
                        <div className="text-8xl transform rotate-12">
                          {category.icon}
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-white/90">{category.icon}</div>
                          <Space
                            direction="vertical"
                            size={0}
                            className="text-right"
                          >
                            <Statistic
                              value={category.stats.causes}
                              valueStyle={{
                                color: "white",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                              }}
                              suffix="causes"
                            />
                            <div className="text-white/80 text-sm">active</div>
                          </Space>
                        </div>

                        <Title level={3} className="text-white mb-2">
                          {category.title}
                        </Title>

                        <div className="flex items-center space-x-4 text-white/90">
                          <div className="flex items-center space-x-1">
                            <TeamOutlined />
                            <span className="text-sm">
                              {category.stats.helped.toLocaleString()} helped
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GlobalOutlined />
                            <span className="text-sm">Worldwide</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Category Image */}
                    {category.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={category.image.url}
                          alt={category.image.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-8">
                      <Paragraph className="text-gray-600 mb-6 text-base leading-relaxed">
                        {category.description}
                      </Paragraph>

                      {/* Features */}
                      <div className="mb-8">
                        <Title level={5} className="mb-4 text-gray-800">
                          Popular Categories:
                        </Title>
                        <div className="grid grid-cols-2 gap-2">
                          {category.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-2 text-sm text-gray-600"
                            >
                              <GiftOutlined className="text-xs text-blue-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <Space
                        direction="vertical"
                        size="middle"
                        className="w-full"
                      >
                        <Link
                          href={`/causes?category=${category.id}`}
                          className="w-full"
                        >
                          <Button
                            type="primary"
                            size="large"
                            icon={<ArrowRightOutlined />}
                            className={`w-full h-12 bg-gradient-to-r ${category.color} border-none hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                          >
                            Explore {category.title}
                          </Button>
                        </Link>

                        <Link
                          href={`/causes/create?category=${category.id}`}
                          className="w-full"
                        >
                          <Button
                            size="large"
                            className="w-full h-10 border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                          >
                            Create Cause
                          </Button>
                        </Link>
                      </Space>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 max-w-4xl mx-auto">
            <div className="text-center text-white p-8">
              <Title level={3} className="text-white mb-4">
                Ready to Make an Impact?
              </Title>
              <Paragraph className="text-blue-100 mb-6 text-lg">
                Join our community of changemakers and start helping your
                neighbors today
              </Paragraph>
              <Space size="large">
                <Link href="/causes">
                  <Button
                    type="default"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    className="bg-white text-blue-600 border-0 hover:bg-blue-50 font-semibold h-12 px-8"
                  >
                    Browse All Causes
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="large"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold h-12 px-8 transition-all duration-300"
                  >
                    Join Community
                  </Button>
                </Link>
              </Space>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
