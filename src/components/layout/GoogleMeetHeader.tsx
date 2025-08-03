"use client";

import React, { useState } from 'react';
import { Button, Avatar, Dropdown, Space, Drawer, Typography, Menu } from 'antd';
import {
  MenuOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const { Text } = Typography;

// Navigation Menu Items with Submenus
const navigationMenus = [
  {
    key: 'causes',
    label: 'Causes',
    href: '/causes',
    children: [
      { key: 'all-causes', label: 'All Causes', href: '/causes' },
      { key: 'food-support', label: '🍽️ Food Support', href: '/causes?category=food' },
      { key: 'clothing', label: '👕 Clothing', href: '/causes?category=clothes' },
      { key: 'training', label: '📚 Training', href: '/causes?category=training' },
      { key: 'create-cause', label: '➕ Create Cause', href: '/causes/create' },
    ],
  },
  {
    key: 'community',
    label: 'Community',
    href: '/community',
    children: [
      { key: 'members', label: '👥 Members', href: '/community/members' },
      { key: 'events', label: '📅 Events', href: '/community/events' },
      { key: 'groups', label: '🏢 Groups', href: '/community/groups' },
      { key: 'impact', label: '📊 Impact', href: '/impact' },
    ],
  },
  {
    key: 'resources',
    label: 'Resources',
    href: '/resources',
    children: [
      { key: 'help-center', label: '❓ Help Center', href: '/help' },
      { key: 'guidelines', label: '📋 Guidelines', href: '/guidelines' },
      { key: 'safety', label: '🛡️ Safety', href: '/safety' },
      { key: 'about', label: 'ℹ️ About Us', href: '/about' },
    ],
  },
];

// Desktop Navigation Menu with Submenus
const DesktopNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = navigationMenus.map(menu => ({
    key: menu.key,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>{menu.label}</span>
        <DownOutlined style={{ fontSize: 10 }} />
      </div>
    ),
    children: menu.children.map(child => ({
      key: child.key,
      label: (
        <Link href={child.href} style={{ textDecoration: 'none', color: 'inherit' }}>
          {child.label}
        </Link>
      ),
    })),
  }));

  return (
    <Menu
      mode="horizontal"
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: 14,
      }}
      items={menuItems}
    />
  );
};

// Google Apps Grid Component
const GoogleAppsGrid = () => {
  const apps = [
    { name: 'Causes', icon: '❤️', href: '/causes', color: '#ea4335' },
    { name: 'Training', icon: '📚', href: '/causes?category=training', color: '#4285f4' },
    { name: 'Food', icon: '🍽️', href: '/causes?category=food', color: '#34a853' },
    { name: 'Clothes', icon: '👕', href: '/causes?category=clothes', color: '#fbbc04' },
    { name: 'Profile', icon: '👤', href: '/profile', color: '#ea4335' },
    { name: 'About', icon: 'ℹ️', href: '/about', color: '#4285f4' },
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: 8, 
      padding: 16, 
      width: 240,
    }}>
      {apps.map((app) => (
        <Link key={app.name} href={app.href} style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 12,
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              fontSize: 24,
              marginBottom: 4,
            }}>
              {app.icon}
            </div>
            <Text style={{ 
              fontSize: 12, 
              color: '#3c4043',
              textAlign: 'center',
            }}>
              {app.name}
            </Text>
          </div>
        </Link>
      ))}
    </div>
  );
};

// User Menu Component
const UserMenu = ({ user }: { user: any }) => {
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const userMenuItems = [
    {
      key: 'profile-header',
      label: (
        <div style={{ padding: '8px 0', borderBottom: '1px solid #e8eaed', marginBottom: 8 }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: 12, color: '#5f6368' }}>{user?.email}</div>
          <Link href="/profile" style={{ color: '#1a73e8', fontSize: 12 }}>
            Manage your Hands2gether Account
          </Link>
        </div>
      ),
      disabled: true,
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => router.push('/profile#settings'),
    },
    {
      key: 'help',
      label: 'Help',
      icon: <QuestionCircleOutlined />,
      onClick: () => router.push('/help'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Sign out',
      icon: <LogoutOutlined />,
      onClick: handleSignOut,
    },
  ];

  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      placement="bottomRight"
      trigger={['click']}
      overlayStyle={{ width: 300 }}
    >
      <Avatar 
        src={user?.avatar || user?.image} 
        icon={<UserOutlined />}
        size={32}
        style={{ 
          cursor: 'pointer',
          border: '2px solid transparent',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#dadce0'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
      />
    </Dropdown>
  );
};

// Mobile Drawer Menu
const MobileDrawer = ({ 
  visible, 
  onClose, 
  user 
}: { 
  visible: boolean; 
  onClose: () => void; 
  user: any;
}) => {
  const router = useRouter();
  
  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    onClose();
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a73e8, #4285f4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            H2G
          </div>
          <Text style={{ fontWeight: 500 }}>Hands2gether</Text>
        </div>
      }
      placement="left"
      onClose={onClose}
      open={visible}
      width={280}
      styles={{
        body: { padding: 0 },
      }}
    >
      <div style={{ padding: 16 }}>
        {/* User Info */}
        {user && (
          <div style={{ 
            padding: 16, 
            borderBottom: '1px solid #e8eaed',
            marginBottom: 16,
            marginLeft: -16,
            marginRight: -16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar 
                src={user?.avatar || user?.image} 
                icon={<UserOutlined />}
                size={40}
              />
              <div>
                <div style={{ fontWeight: 500 }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: 12, color: '#5f6368' }}>{user?.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        {navigationMenus.map((menu) => (
          <div key={menu.key} style={{ marginBottom: 16 }}>
            <div style={{ 
              fontWeight: 600, 
              color: '#3c4043', 
              marginBottom: 8,
              fontSize: 14,
            }}>
              {menu.label}
            </div>
            {menu.children.map((child) => (
              <Button 
                key={child.key}
                type="text" 
                block 
                style={{ 
                  justifyContent: 'flex-start', 
                  height: 36,
                  marginBottom: 4,
                  color: '#5f6368',
                }}
                onClick={() => handleNavigation(child.href)}
              >
                {child.label}
              </Button>
            ))}
          </div>
        ))}

        {user ? (
          <>
            <div style={{ margin: '16px 0', height: 1, backgroundColor: '#e8eaed' }} />
            <Button 
              type="text" 
              block 
              style={{ justifyContent: 'flex-start', height: 40 }}
              onClick={() => handleNavigation('/profile')}
            >
              👤 Profile
            </Button>
            <Button 
              type="text" 
              block 
              style={{ justifyContent: 'flex-start', height: 40, color: '#ea4335' }}
              onClick={handleSignOut}
            >
              🚪 Sign out
            </Button>
          </>
        ) : (
          <>
            <div style={{ margin: '16px 0', height: 1, backgroundColor: '#e8eaed' }} />
            <Button 
              type="primary" 
              block 
              size="large"
              style={{ borderRadius: 8, fontWeight: 500, marginBottom: 8 }}
              onClick={() => handleNavigation('/auth/signin')}
            >
              Sign in
            </Button>
            <Button 
              block 
              size="large"
              style={{ borderRadius: 8, fontWeight: 500 }}
              onClick={() => handleNavigation('/auth/signup')}
            >
              Create account
            </Button>
          </>
        )}
      </div>
    </Drawer>
  );
};

// Main Header Component (exactly like Google Meet)
export default function GoogleMeetHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const user = session?.user;

  return (
    <>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 64,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e8eaed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxShadow: '0 1px 2px rgba(60,64,67,.1)',
      }}>
        {/* Left side - Logo and Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a73e8, #4285f4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
                H2G
              </div>
              <Text style={{ 
                fontSize: '22px', 
                fontWeight: 400, 
                color: '#5f6368',
                letterSpacing: '-0.5px',
              }}>
                Hands2gether
              </Text>
            </div>
          </Link>

          {/* Desktop Navigation with Submenus */}
          <div style={{ display: 'none' }} className="desktop-nav">
            <DesktopNavigation />
          </div>
        </div>

        {/* Right side - Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Support/Help */}
          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            style={{
              color: '#5f6368',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'none',
            }}
            className="desktop-only"
            onClick={() => router.push('/help')}
          />

          {/* Google Apps Grid */}
          <Dropdown
            overlay={<GoogleAppsGrid />}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<AppstoreOutlined />}
              style={{
                color: '#5f6368',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
              }}
            />
          </Dropdown>

          {/* User Avatar or Sign in */}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button
                style={{
                  borderRadius: 4,
                  fontWeight: 500,
                  height: 36,
                  display: 'none',
                }}
                className="desktop-only"
                onClick={() => router.push('/auth/signin')}
              >
                Sign in
              </Button>
              <Button
                type="primary"
                style={{
                  borderRadius: 4,
                  fontWeight: 500,
                  height: 36,
                  backgroundColor: '#1a73e8',
                  borderColor: '#1a73e8',
                }}
                onClick={() => router.push('/auth/signin')}
              >
                Sign in
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            style={{
              color: '#5f6368',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'none',
            }}
            className="mobile-only"
            onClick={() => setMobileDrawerVisible(true)}
          />
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        visible={mobileDrawerVisible}
        onClose={() => setMobileDrawerVisible(false)}
        user={user}
      />

      {/* Header spacer */}
      <div style={{ height: 64 }} />

      <style jsx global>{`
        @media (min-width: 768px) {
          .desktop-only {
            display: inline-flex !important;
          }
          .desktop-nav {
            display: block !important;
          }
          .mobile-only {
            display: none !important;
          }
        }
        
        @media (max-width: 767px) {
          .desktop-only {
            display: none !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .mobile-only {
            display: inline-flex !important;
          }
        }

        /* Ant Design Menu customization for Google Meet style */
        .ant-menu-horizontal {
          border-bottom: none !important;
        }
        
        .ant-menu-horizontal > .ant-menu-item,
        .ant-menu-horizontal > .ant-menu-submenu {
          border-bottom: none !important;
        }
        
        .ant-menu-horizontal > .ant-menu-item:hover,
        .ant-menu-horizontal > .ant-menu-submenu:hover {
          color: #1a73e8 !important;
          border-bottom: none !important;
        }
        
        .ant-menu-submenu-popup {
          border-radius: 8px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </>
  );
}