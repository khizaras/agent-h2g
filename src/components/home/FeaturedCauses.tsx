'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card, Button, Tag, Typography, Row, Col, Avatar, Progress } from 'antd';
import { 
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const { Title, Paragraph, Text } = Typography;

interface CauseCardProps {
  cause: {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    image: string;
    user: {
      name: string;
      avatar?: string;
    };
    stats: {
      views: number;
      likes: number;
      shares: number;
      progress: number;
      target: number;
    };
    createdAt: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'active' | 'completed';
    tags: string[];
  };
  index: number;
}

const CauseCard: React.FC<CauseCardProps> = ({ cause, index }) => {
  const [liked, setLiked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'processing';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return 'red';
      case 'clothes': return 'blue';
      case 'education': return 'purple';
      default: return 'default';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1] 
      }}
      whileHover={{ y: -12 }}
      className="h-full"
    >
      <Card 
        className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-white"
        bodyStyle={{ padding: 0 }}
        cover={
          <div className="relative h-64 overflow-hidden">
            <Image
              src={cause.image}
              alt={cause.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Priority badge */}
            <div className="absolute top-4 left-4">
              <Tag color={getPriorityColor(cause.priority)} className="font-semibold">
                {cause.priority.toUpperCase()}
              </Tag>
            </div>

            {/* Category badge */}
            <div className="absolute top-4 right-4">
              <Tag color={getCategoryColor(cause.category)} className="font-semibold">
                {cause.category}
              </Tag>
            </div>

            {/* Stats overlay */}
            <div className="absolute bottom-4 right-4 flex space-x-2 text-white">
              <span className="flex items-center space-x-1 text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                <EyeOutlined />
                <span>{cause.stats.views}</span>
              </span>
              <span className="flex items-center space-x-1 text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                <HeartOutlined />
                <span>{cause.stats.likes}</span>
              </span>
            </div>
          </div>
        }
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar 
                src={cause.user.avatar} 
                icon={<UserOutlined />}
                size="small"
              />
              <div>
                <Text className="font-medium text-gray-800">{cause.user.name}</Text>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <ClockCircleOutlined />
                  <span>{formatDistanceToNow(new Date(cause.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <Title level={4} className="mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {cause.title}
          </Title>

          {/* Description */}
          <Paragraph className="text-gray-600 mb-4 line-clamp-3">
            {cause.description}
          </Paragraph>

          {/* Location */}
          <div className="flex items-center space-x-1 text-gray-500 mb-4">
            <EnvironmentOutlined />
            <Text className="text-sm">{cause.location}</Text>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <Text className="text-sm font-medium">Progress</Text>
              <Text className="text-sm text-gray-500">
                {cause.stats.progress}% completed
              </Text>
            </div>
            <Progress 
              percent={cause.stats.progress} 
              strokeColor={{
                '0%': '#3b82f6',
                '100%': '#8b5cf6',
              }}
              showInfo={false}
              strokeWidth={8}
              className="mb-2"
            />
            <Text className="text-xs text-gray-500">
              Target: {cause.stats.target} people
            </Text>
          </div>

          {/* Tags */}
          <div className="mb-6">
            {cause.tags.slice(0, 3).map((tag, tagIndex) => (
              <Tag key={tagIndex} className="mb-1 mr-1 text-xs">
                {tag}
              </Tag>
            ))}
            {cause.tags.length > 3 && (
              <Tag className="mb-1 text-xs">+{cause.tags.length - 3} more</Tag>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                type={liked ? "primary" : "text"}
                icon={liked ? <HeartFilled /> : <HeartOutlined />}
                onClick={() => setLiked(!liked)}
                className="flex items-center space-x-1"
                size="small"
              >
                {cause.stats.likes + (liked ? 1 : 0)}
              </Button>
              
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                size="small"
                className="text-gray-500 hover:text-blue-500"
              />
            </div>

            <Link href={`/causes/${cause.id}`}>
              <Button 
                type="primary"
                icon={<ArrowRightOutlined />}
                className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Help Now
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Mock data for featured causes
const featuredCauses = [
  {
    id: 1,
    title: "Emergency Food Relief for Flood Victims",
    description: "Providing immediate food assistance to families affected by recent flooding. We need fresh produce, canned goods, and prepared meals for 200+ families.",
    category: "Food",
    location: "Downtown Community Center",
    image: "/images/causes/food-relief.jpg",
    user: {
      name: "Sarah Community Kitchen",
      avatar: "/images/avatars/sarah.jpg"
    },
    stats: {
      views: 1247,
      likes: 89,
      shares: 23,
      progress: 67,
      target: 200
    },
    createdAt: "2024-01-15T10:30:00Z",
    priority: "urgent" as const,
    status: "active" as const,
    tags: ["Emergency", "Food", "Families", "Disaster Relief"]
  },
  {
    id: 2,
    title: "Winter Clothing Drive for Homeless Shelter",
    description: "Collecting warm clothing, blankets, and winter essentials for the upcoming cold season. Focus on adult sizes and waterproof items.",
    category: "Clothes",
    location: "Metro Homeless Shelter",
    image: "/images/causes/winter-clothes.jpg",
    user: {
      name: "Mike's Helping Hands",
      avatar: "/images/avatars/mike.jpg"
    },
    stats: {
      views: 856,
      likes: 67,
      shares: 18,
      progress: 43,
      target: 150
    },
    createdAt: "2024-01-12T14:20:00Z",
    priority: "high" as const,
    status: "active" as const,
    tags: ["Winter", "Clothing", "Homeless", "Shelter"]
  },
  {
    id: 3,
    title: "Free Web Development Bootcamp",
    description: "Teaching essential web development skills to unemployed youth. 12-week intensive program covering HTML, CSS, JavaScript, and React.",
    category: "Education",
    location: "Tech Community Hub",
    image: "/images/causes/coding-bootcamp.jpg",
    user: {
      name: "Lisa Tech Educator",
      avatar: "/images/avatars/lisa.jpg"
    },
    stats: {
      views: 642,
      likes: 94,
      shares: 31,
      progress: 78,
      target: 25
    },
    createdAt: "2024-01-10T09:15:00Z",
    priority: "medium" as const,
    status: "active" as const,
    tags: ["Technology", "Skills", "Youth", "Career"]
  }
];

export function FeaturedCauses() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Title level={2} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Featured Causes Making Impact
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover urgent causes and ongoing initiatives where your help can make an immediate difference
          </Paragraph>
        </motion.div>

        <Row gutter={[32, 32]} className="max-w-7xl mx-auto">
          {featuredCauses.map((cause, index) => (
            <Col xs={24} md={12} lg={8} key={cause.id}>
              <CauseCard cause={cause} index={index} />
            </Col>
          ))}
        </Row>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link href="/causes">
            <Button 
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-14 px-8 text-lg font-semibold"
            >
              Explore All Causes
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}