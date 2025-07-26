"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button, Typography, Space, Carousel } from "antd";
import { ArrowRightOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { unsplashImages } from "@/services/unsplashService";

const { Title, Paragraph } = Typography;

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Professional Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel
          autoplay
          dots={false}
          effect="fade"
          autoplaySpeed={6000}
          className="h-full"
        >
          {unsplashImages.heroes.map((image, index) => (
            <div key={image.id} className="relative h-screen">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Content overlay */}
      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
      >
        <motion.div variants={itemVariants}>
          <Title
            level={1}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ textShadow: "2px 4px 8px rgba(0,0,0,0.3)" }}
          >
            Bringing{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Communities
            </span>{" "}
            Together
          </Title>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paragraph
            className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: "1px 2px 4px rgba(0,0,0,0.5)" }}
          >
            Connect with causes that matter. Make a real impact in your
            community through food assistance and emergency relief programs.
          </Paragraph>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Space
            size="large"
            className="flex flex-col sm:flex-row justify-center"
          >
            <Link href="/causes">
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-2xl hover:scale-105 transition-all duration-300"
                style={{ boxShadow: "0 8px 32px rgba(37, 99, 235, 0.4)" }}
              >
                Explore Causes
              </Button>
            </Link>

            <Link href="/causes/create">
              <Button
                size="large"
                icon={<PlayCircleOutlined />}
                className="h-14 px-8 text-lg font-semibold bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Start Helping
              </Button>
            </Link>
          </Space>
        </motion.div>

        {/* Trust indicators */}
        <motion.div variants={itemVariants} className="mt-16">
          <div className="flex flex-wrap justify-center items-center space-x-8 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">Active Causes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$2M+</div>
              <div className="text-sm">Funds Raised</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm">Communities</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating elements for visual appeal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/6 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-3/4 right-1/6 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [5, -5, 5],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-white/5 rounded-full backdrop-blur-sm"
        />
      </div>
    </section>
  );
}
