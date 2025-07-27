"use client";

import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Space,
  Typography,
  Badge,
  Avatar,
  Dropdown,
} from "antd";
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
  HiOutlineCog,
  HiOutlineLogout,
} from "react-icons/hi";
import { motion } from "framer-motion";
import Link from "next/link";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  isAuthenticated?: boolean;
  userAvatar?: string;
  userName?: string;
  notificationCount?: number;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function Header({
  isAuthenticated = false,
  userAvatar,
  userName = "User",
  notificationCount = 0,
  onSignIn,
  onSignOut,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      key: "home",
      label: (
        <Link href="/" className="nav-link">
          <HiOutlineHome size={18} />
          Home
        </Link>
      ),
    },
    {
      key: "causes",
      label: (
        <Link href="/causes" className="nav-link">
          <HiOutlineHeart size={18} />
          Causes
        </Link>
      ),
    },
    {
      key: "education",
      label: (
        <Link href="/education" className="nav-link">
          <HiOutlineAcademicCap size={18} />
          Education
        </Link>
      ),
    },
    {
      key: "about",
      label: (
        <Link href="/about" className="nav-link">
          <HiOutlineInformationCircle size={18} />
          About
        </Link>
      ),
    },
    {
      key: "contact",
      label: (
        <Link href="/contact" className="nav-link">
          <HiOutlineMail size={18} />
          Contact
        </Link>
      ),
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      label: <Link href="/profile">Profile</Link>,
      icon: <HiOutlineUser size={16} />,
    },
    {
      key: "settings",
      label: <Link href="/settings">Settings</Link>,
      icon: <HiOutlineCog size={16} />,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: "Sign Out",
      icon: <HiOutlineLogout size={16} />,
      onClick: onSignOut,
    },
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <AntHeader className="header-modern">
        <div className="header-container">
          {/* Brand Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="header-brand"
          >
            <Link href="/" className="brand-link">
              <div className="brand-icon">
                <HiOutlineHeart size={20} />
              </div>
              <Text className="brand-text">Hands2gether</Text>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Menu
              mode="horizontal"
              selectedKeys={[]}
              items={navigationItems}
              className="nav-menu"
            />
          </nav>

          {/* User Actions */}
          <div className="header-actions">
            {isAuthenticated ? (
              <Space size="middle" className="user-actions">
                {/* Notifications */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge count={notificationCount} size="small">
                    <Button
                      type="text"
                      icon={<HiOutlineBell size={20} />}
                      className="action-btn"
                    />
                  </Badge>
                </motion.div>

                {/* User Menu */}
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button type="text" className="user-btn">
                      <Space>
                        <Avatar
                          src={userAvatar}
                          icon={<HiOutlineUser />}
                          size="small"
                        />
                        <Text className="user-name">{userName}</Text>
                      </Space>
                    </Button>
                  </motion.div>
                </Dropdown>
              </Space>
            ) : (
              <Space className="auth-actions">
                <Button
                  type="text"
                  onClick={onSignIn}
                  className="auth-btn auth-btn-signin"
                >
                  Sign In
                </Button>
                <Button
                  type="primary"
                  onClick={onSignIn}
                  className="auth-btn auth-btn-signup"
                >
                  Get Started
                </Button>
              </Space>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              type="text"
              icon={<HiOutlineMenu size={24} />}
              onClick={handleMobileMenuToggle}
              className="mobile-menu-btn"
            />
          </div>
        </div>
      </AntHeader>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title={
          <div className="mobile-header">
            <div className="mobile-brand">
              <HiOutlineHeart size={20} />
              <Text strong>Hands2gether</Text>
            </div>
            <Button
              type="text"
              icon={<HiOutlineX size={20} />}
              onClick={handleMobileMenuToggle}
              className="mobile-close"
            />
          </div>
        }
        placement="right"
        onClose={handleMobileMenuToggle}
        open={mobileMenuOpen}
        width={320}
        className="mobile-drawer"
        closable={false}
      >
        <div className="mobile-nav">
          <Menu
            mode="vertical"
            items={navigationItems}
            className="mobile-menu"
            onClick={handleMobileMenuToggle}
          />

          <div className="mobile-actions">
            {isAuthenticated ? (
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Button
                  type="text"
                  icon={<HiOutlineBell size={18} />}
                  className="mobile-action-btn"
                  block
                >
                  Notifications
                  {notificationCount > 0 && (
                    <Badge
                      count={notificationCount}
                      size="small"
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </Button>
                <Button
                  type="text"
                  icon={<HiOutlineUser size={18} />}
                  className="mobile-action-btn"
                  block
                >
                  Profile
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={onSignOut}
                  className="mobile-signout-btn"
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
                  type="text"
                  onClick={onSignIn}
                  className="mobile-auth-btn mobile-signin"
                  block
                >
                  Sign In
                </Button>
                <Button
                  type="primary"
                  onClick={onSignIn}
                  className="mobile-auth-btn mobile-signup"
                  block
                >
                  Get Started
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
