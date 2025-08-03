"use client";

import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import Link from 'next/link';

const { Footer: AntdFooter } = Layout;
const { Text } = Typography;

// Simple Google Meet-style footer (minimal)
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <AntdFooter
      style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e8eaed',
        padding: '40px 24px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Links */}
        <div style={{ marginBottom: 24 }}>
          <Space size={32} wrap>
            <Link href="/about" style={{ color: '#5f6368', textDecoration: 'none' }}>
              <Text style={{ color: '#5f6368', fontSize: 14 }}>About</Text>
            </Link>
            <Link href="/privacy" style={{ color: '#5f6368', textDecoration: 'none' }}>
              <Text style={{ color: '#5f6368', fontSize: 14 }}>Privacy</Text>
            </Link>
            <Link href="/terms" style={{ color: '#5f6368', textDecoration: 'none' }}>
              <Text style={{ color: '#5f6368', fontSize: 14 }}>Terms</Text>
            </Link>
            <Link href="/help" style={{ color: '#5f6368', textDecoration: 'none' }}>
              <Text style={{ color: '#5f6368', fontSize: 14 }}>Help</Text>
            </Link>
            <Link href="/contact" style={{ color: '#5f6368', textDecoration: 'none' }}>
              <Text style={{ color: '#5f6368', fontSize: 14 }}>Contact</Text>
            </Link>
          </Space>
        </div>

        <Divider style={{ margin: '24px 0', borderColor: '#e8eaed' }} />

        {/* Copyright */}
        <div>
          <Text style={{ color: '#5f6368', fontSize: 12 }}>
            © {currentYear} Hands2gether. All rights reserved.
          </Text>
        </div>
      </div>
    </AntdFooter>
  );
}