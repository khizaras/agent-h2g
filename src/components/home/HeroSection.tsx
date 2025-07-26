'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button, Typography, Space } from 'antd';
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }
};

const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-1/4 left-1/6 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 2 }
          }}
          className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-200/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 4 }
          }}
          className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-pink-200/30 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Title 
              level={1} 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
              style={{ marginBottom: '2rem' }}
            >
              Transform Communities
              <br />
              <span className="text-4xl md:text-6xl">Together</span>
            </Title>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paragraph className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect hearts, share resources, and build stronger communities through 
              <span className="font-semibold text-blue-600"> food assistance</span>,
              <span className="font-semibold text-purple-600"> clothing donations</span>, and
              <span className="font-semibold text-pink-600"> educational opportunities</span>.
            </Paragraph>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Space size="large" className="flex flex-col sm:flex-row justify-center">
              <Link href="/causes">
                <Button 
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Explore Causes
                </Button>
              </Link>
              
              <Link href="/causes/create">
                <Button 
                  size="large"
                  icon={<PlayCircleOutlined />}
                  className="h-14 px-8 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Start Helping
                </Button>
              </Link>
            </Space>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={itemVariants}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-32 -right-32 w-64 h-64 border border-blue-200/30 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1]
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-32 -left-32 w-64 h-64 border border-purple-200/30 rounded-full"
        />
      </div>
    </section>
  );
}