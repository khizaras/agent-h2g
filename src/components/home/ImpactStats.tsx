'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Row, Col, Statistic, Card } from 'antd';
import { 
  UserOutlined, 
  HeartOutlined, 
  BookOutlined, 
  GlobalOutlined,
  TrophyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useRef } from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  title: string;
  suffix?: string;
  color: string;
  description: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  value, 
  title, 
  suffix, 
  color, 
  description, 
  delay 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let start = 0;
        const increment = value / 100;
        const timer = setInterval(() => {
          start += increment;
          if (start >= value) {
            setDisplayValue(value);
            clearInterval(timer);
          } else {
            setDisplayValue(Math.floor(start));
          }
        }, 20);
        return () => clearInterval(timer);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: delay / 1000,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="h-full"
    >
      <Card 
        className="text-center h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-md group overflow-hidden relative"
        bodyStyle={{ padding: '2rem' }}
      >
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        <div className="relative z-10">
          {/* Icon with animated background */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${color} text-white text-2xl mb-4 shadow-lg`}
          >
            {icon}
          </motion.div>

          {/* Animated counter */}
          <Statistic
            value={displayValue}
            suffix={suffix}
            valueStyle={{ 
              color: '#1e293b',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              lineHeight: 1
            }}
          />

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-3">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>

          {/* Decorative element */}
          <motion.div 
            className={`h-1 bg-gradient-to-r ${color} rounded-full mt-4 mx-auto`}
            initial={{ width: 0 }}
            animate={isInView ? { width: '60%' } : {}}
            transition={{ delay: (delay / 1000) + 0.5, duration: 0.8 }}
          />
        </div>
      </Card>
    </motion.div>
  );
};

const stats = [
  {
    icon: <UserOutlined />,
    value: 12847,
    title: 'Active Members',
    suffix: '+',
    color: 'from-blue-500 to-cyan-500',
    description: 'Community members actively helping others',
    delay: 200
  },
  {
    icon: <HeartOutlined />,
    value: 8432,
    title: 'Lives Impacted',
    suffix: '+',
    color: 'from-red-500 to-pink-500',
    description: 'People helped through our platform',
    delay: 400
  },
  {
    icon: <BookOutlined />,
    value: 2567,
    title: 'Active Causes',
    suffix: '',
    color: 'from-green-500 to-emerald-500',
    description: 'Currently active assistance requests',
    delay: 600
  },
  {
    icon: <TrophyOutlined />,
    value: 6834,
    title: 'Completed',
    suffix: '',
    color: 'from-yellow-500 to-orange-500',
    description: 'Successfully fulfilled assistance requests',
    delay: 800
  },
  {
    icon: <TeamOutlined />,
    value: 156,
    title: 'Organizations',
    suffix: '+',
    color: 'from-purple-500 to-indigo-500',
    description: 'Partner organizations and institutions',
    delay: 1000
  },
  {
    icon: <GlobalOutlined />,
    value: 34,
    title: 'Countries',
    suffix: '',
    color: 'from-teal-500 to-cyan-500',
    description: 'Global reach across multiple countries',
    delay: 1200
  }
];

export function ImpactStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <div ref={containerRef} className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <Row gutter={[24, 24]} className="max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} lg={8} xl={4} key={index}>
              <StatCard {...stat} />
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Additional impact showcase */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="mt-16 text-center"
      >
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 max-w-4xl mx-auto">
          <div className="text-white p-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                🎉 Growing Every Day
              </h3>
              <p className="text-blue-100 text-lg mb-6">
                Join our thriving community where every action creates a ripple effect of positive change
              </p>
              
              <Row gutter={[32, 16]} className="max-w-2xl mx-auto">
                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-300">98%</div>
                    <div className="text-blue-200 text-sm">Success Rate</div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-300">24/7</div>
                    <div className="text-blue-200 text-sm">Support Available</div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-300">4.9★</div>
                    <div className="text-blue-200 text-sm">User Rating</div>
                  </div>
                </Col>
              </Row>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}