"use client";

import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, Space, Typography, Badge } from "antd";
import {
  HiOutlineHome,
  HiOutlineHeart,
  HiOutlineInformationCircle,
  HiOutlineMail,
  HiOutlineAcademicCap,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBell,
  HiOutlineUser,
} from "react-icons/hi";
import { motion } from "framer-motion";
import Link from "next/link";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  isAuthenticated?: boolean;
  notificationCount?: number;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function Header({
  isAuthenticated = false,
  notificationCount = 0,
  onSignIn,
  onSignOut,
}: HeaderProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    {
      key: "home",
      icon: <HiOutlineHome size={18} />,
      label: <Link href="/">Home</Link>,
    },
    {
      key: "causes",
      icon: <HiOutlineHeart size={18} />,
      label: <Link href="/causes">Causes</Link>,
    },
    {
      key: "education",
      icon: <HiOutlineAcademicCap size={18} />,
      label: <Link href="/education">Education</Link>,
    },
    {
      key: "about",
      icon: <HiOutlineInformationCircle size={18} />,
      label: <Link href="/about">About</Link>,
    },
    {
      key: "contact",
      icon: <HiOutlineMail size={18} />,
      label: <Link href="/contact">Contact</Link>,
    },
  ];

  const handleDrawerToggle = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <AntHeader className="header">
      <div className="header-container">
        {/* Logo Section */}
        <motion.div
          className="header-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="logo-link">
            <Text className="logo-text">Hands2gether</Text>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="header-nav-desktop">
          <Menu
            mode="horizontal"
            selectedKeys={[]}
            items={menuItems}
            className="desktop-menu"
          />
        </div>

        {/* User Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            <Space size="middle">
              {/* Notifications */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge count={notificationCount} size="small">
                  <Button
                    type="text"
                    icon={<HiOutlineBell size={20} />}
                    className="action-button"
                  />
                </Badge>
              </motion.div>

              {/* Profile */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="text"
                  icon={<HiOutlineUser size={20} />}
                  className="action-button"
                />
              </motion.div>

              {/* Sign Out */}
              <Button
                type="primary"
                onClick={onSignOut}
                className="auth-button"
              >
                Sign Out
              </Button>
            </Space>
          ) : (
            <Space>
              <Button
                type="default"
                onClick={onSignIn}
                className="auth-button-outline"
              >
                Sign In
              </Button>
              <Button type="primary" onClick={onSignIn} className="auth-button">
                Get Started
              </Button>
            </Space>
          )}

          {/* Mobile Menu Toggle */}
          <div className="mobile-menu-toggle">
            <Button
              type="text"
              icon={<HiOutlineMenu size={24} />}
              onClick={handleDrawerToggle}
              className="menu-toggle-button"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title={
          <div className="drawer-header">
            <Text className="drawer-title">Menu</Text>
            <Button
              type="text"
              icon={<HiOutlineX size={20} />}
              onClick={handleDrawerToggle}
              className="drawer-close"
            />
          </div>
        }
        placement="right"
        onClose={handleDrawerToggle}
        open={drawerVisible}
        width={300}
        className="mobile-drawer"
        closable={false}
      >
        <div className="mobile-nav">
          <Menu
            mode="vertical"
            selectedKeys={[]}
            items={menuItems}
            className="mobile-menu"
            onClick={handleDrawerToggle}
          />

          {/* Mobile Auth Actions */}
          <div className="mobile-auth">
            {isAuthenticated ? (
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Button
                  type="text"
                  icon={<HiOutlineBell size={18} />}
                  className="mobile-action-button"
                  block
                >
                  Notifications
                  {notificationCount > 0 && (
                    <Badge count={notificationCount} size="small" />
                  )}
                </Button>
                <Button
                  type="text"
                  icon={<HiOutlineUser size={18} />}
                  className="mobile-action-button"
                  block
                >
                  Profile
                </Button>
                <Button
                  type="primary"
                  onClick={onSignOut}
                  className="mobile-auth-button"
                  block
                >
                  Sign Out
                </Button>
              </Space>
            ) : (
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Button
                  type="default"
                  onClick={onSignIn}
                  className="mobile-auth-button-outline"
                  block
                >
                  Sign In
                </Button>
                <Button
                  type="primary"
                  onClick={onSignIn}
                  className="mobile-auth-button"
                  block
                >
                  Get Started
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Drawer>

      <style jsx>{`
        :global(.header) {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.04);
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 0;
          height: 64px;
          line-height: 64px;
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 100%;
        }

        .header-logo {
          flex-shrink: 0;
        }

        .logo-link {
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .logo-link:hover {
          transform: translateY(-1px);
        }

        :global(.logo-text) {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-nav-desktop {
          flex: 1;
          display: flex;
          justify-content: center;
          margin: 0 40px;
        }

        :global(.desktop-menu) {
          background: transparent;
          border-bottom: none;
          font-weight: 500;
        }

        :global(.desktop-menu .ant-menu-item) {
          margin: 0 20px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        :global(.desktop-menu .ant-menu-item:hover) {
          background: rgba(82, 196, 26, 0.1);
          color: #52c41a;
        }

        :global(.desktop-menu .ant-menu-item a) {
          color: inherit;
          text-decoration: none;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        :global(.action-button) {
          border-radius: 8px;
          color: #666;
          transition: all 0.2s ease;
        }

        :global(.action-button:hover) {
          background: rgba(82, 196, 26, 0.1);
          color: #52c41a;
        }

        :global(.auth-button) {
          border-radius: 8px;
          font-weight: 600;
          padding: 8px 24px;
          height: auto;
          background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
          border: none;
          box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
          transition: all 0.2s ease;
        }

        :global(.auth-button:hover) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
        }

        :global(.auth-button-outline) {
          border-radius: 8px;
          font-weight: 600;
          padding: 8px 24px;
          height: auto;
          border: 1px solid #d9d9d9;
          color: #333;
          background: transparent;
          transition: all 0.2s ease;
        }

        :global(.auth-button-outline:hover) {
          border-color: #52c41a;
          color: #52c41a;
          background: rgba(82, 196, 26, 0.05);
        }

        .mobile-menu-toggle {
          display: none;
        }

        :global(.menu-toggle-button) {
          border-radius: 8px;
          color: #666;
          transition: all 0.2s ease;
        }

        :global(.menu-toggle-button:hover) {
          background: rgba(82, 196, 26, 0.1);
          color: #52c41a;
        }

        :global(.mobile-drawer .ant-drawer-header) {
          background: #fafafa;
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        :global(.drawer-title) {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        :global(.drawer-close) {
          border-radius: 6px;
        }

        .mobile-nav {
          padding: 24px 0;
        }

        :global(.mobile-menu) {
          border-right: none;
          background: transparent;
        }

        :global(.mobile-menu .ant-menu-item) {
          margin: 8px 0;
          border-radius: 8px;
          font-weight: 500;
        }

        :global(.mobile-menu .ant-menu-item a) {
          color: inherit;
          text-decoration: none;
        }

        .mobile-auth {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f0f0f0;
        }

        :global(.mobile-action-button) {
          border-radius: 8px;
          text-align: left;
          justify-content: flex-start;
          color: #333;
        }

        :global(.mobile-auth-button) {
          border-radius: 8px;
          font-weight: 600;
          height: 44px;
          background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
          border: none;
        }

        :global(.mobile-auth-button-outline) {
          border-radius: 8px;
          font-weight: 600;
          height: 44px;
          border: 1px solid #d9d9d9;
          color: #333;
          background: transparent;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-nav-desktop {
            display: none;
          }

          .mobile-menu-toggle {
            display: block;
          }

          .header-container {
            padding: 0 16px;
          }

          .header-actions {
            gap: 8px;
          }

          :global(.auth-button),
          :global(.auth-button-outline) {
            display: none;
          }
        }

        @media (max-width: 480px) {
          :global(.logo-text) {
            font-size: 20px;
          }

          .header-container {
            padding: 0 12px;
          }
        }
      `}</style>
    </AntHeader>
  );
}
