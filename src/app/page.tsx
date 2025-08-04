"use client";

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Avatar,
  Image,
  Statistic,
  Tag,
} from 'antd';
import {
  FiUsers,
  FiPlus,
  FiArrowRight,
  FiHeart,
  FiMapPin,
  FiTrendingUp,
  FiTarget,
  FiShield,
  FiCheck,
  FiBookOpen,
  FiMessageCircle,
  FiChevronRight,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { imageConfig, animations } from '@/config/theme';

const { Title, Text, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();
  
  // Redirect to premium new home page
  useEffect(() => {
    router.push('/new-home');
  }, [router]);
  
  return (
    <MainLayout>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #0078d4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <Text style={{ color: '#64748b', fontFamily: "'Inter', sans-serif" }}>
            Loading premium experience...
          </Text>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </MainLayout>
  );
}