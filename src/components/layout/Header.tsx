'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Input, Drawer, Space, Affix } from 'antd';
import { 
  MenuOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  PlusOutlined,
  HeartOutlined,
  MessageOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/store';
import { 
  toggleTheme, 
  toggleSidebar, 
  setNotificationsOpen,
  setSearchOpen,
  selectTheme,
  selectNotifications,
  selectSearch
} from '@/store/slices/uiSlice';

const { Header: AntHeader } = Layout;
const { Search } = Input;

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  authRequired?: boolean;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    key: 'home',
    label: 'Home',
    href: '/',
  },
  {
    key: 'causes',
    label: 'Causes',
    href: '/causes',
  },
  {
    key: 'education',
    label: 'Education',
    href: '/education',
  },
  {
    key: 'about',
    label: 'About',
    href: '/about',
  },
  {
    key: 'contact',
    label: 'Contact',
    href: '/contact',
  },
];

const userMenuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardOutlined />,
    href: '/dashboard',
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: <UserOutlined />,
    href: '/profile',
  },
  {
    key: 'my-causes',
    label: 'My Causes',
    icon: <HeartOutlined />,
    href: '/my-causes',
  },
  {
    key: 'messages',
    label: 'Messages',
    icon: <MessageOutlined />,
    href: '/messages',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <SettingOutlined />,
    href: '/settings',
  },
  {
    key: 'divider',
    type: 'divider',
  },
  {
    key: 'logout',
    label: 'Sign Out',
    icon: <LogoutOutlined />,
    onClick: () => signOut({ callbackUrl: '/' }),
  },
];

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const theme = useAppSelector(selectTheme);
  const notifications = useAppSelector(selectNotifications);
  const search = useAppSelector(selectSearch);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
    setMobileMenuOpen(false);
  };

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const getCurrentNavKey = () => {
    const currentItem = navItems.find(item => 
      item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href))
    );
    return currentItem?.key || '';
  };

  const userMenuWithHandlers = userMenuItems.map(item => ({
    ...item,
    onClick: item.onClick || (() => {
      if (item.href) {
        router.push(item.href);
      }
    }),
  }));

  return (
    <Affix offsetTop={0}>
      <AntHeader 
        className={`
          fixed top-0 left-0 right-0 z-50 px-0 h-16 leading-16
          transition-all duration-300 ease-in-out
          ${scrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
            : 'bg-white/95 backdrop-blur-sm'
          }
        `}
      >
        <div className="container mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <HeartOutlined className="text-white text-lg" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hands2gether
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Menu
                mode="horizontal"
                selectedKeys={[getCurrentNavKey()]}
                className="border-0 bg-transparent min-w-0"
                items={navItems.map(item => ({
                  key: item.key,
                  label: (
                    <Link 
                      href={item.href}
                      className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ),
                }))}
              />
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <Search
                placeholder="Search causes, skills, or locations..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                className="search-bar"
                style={{ borderRadius: '12px' }}
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                type="text"
                size="large"
                icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                onClick={() => dispatch(toggleTheme())}
                className="hover:bg-gray-100 rounded-full"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              />

              {/* Mobile Search */}
              <Button
                type="text"
                size="large"
                icon={<SearchOutlined />}
                onClick={() => dispatch(setSearchOpen(true))}
                className="md:hidden hover:bg-gray-100 rounded-full"
              />

              {session ? (
                <>
                  {/* Create Cause Button */}
                  <Link href="/causes/create">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg transition-all duration-300 rounded-full hidden sm:flex"
                    >
                      Create Cause
                    </Button>
                  </Link>

                  {/* Notifications */}
                  <Badge count={notifications.unreadCount} size="small">
                    <Button
                      type="text"
                      size="large"
                      icon={<BellOutlined />}
                      onClick={() => dispatch(setNotificationsOpen(!notifications.isOpen))}
                      className="hover:bg-gray-100 rounded-full"
                    />
                  </Badge>

                  {/* User Menu */}
                  <Dropdown
                    menu={{ items: userMenuWithHandlers }}
                    placement="bottomRight"
                    trigger={['click']}
                  >
                    <Button
                      type="text"
                      className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-2"
                    >
                      <Avatar
                        src={session.user.image}
                        icon={<UserOutlined />}
                        size="default"
                      />
                      <span className="hidden md:inline font-medium text-gray-700">
                        {session.user.name}
                      </span>
                    </Button>
                  </Dropdown>
                </>
              ) : (
                /* Auth Buttons */
                <Space>
                  <Link href="/auth/signin">
                    <Button type="text" className="font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button 
                      type="primary"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg transition-all duration-300 rounded-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </Space>
              )}

              {/* Mobile Menu Button */}
              <Button
                type="text"
                size="large"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden hover:bg-gray-100 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <Drawer
          title={
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <HeartOutlined className="text-white" />
              </div>
              <span className="text-lg font-bold">Hands2gether</span>
            </div>
          }
          placement="right"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={300}
          className="mobile-menu"
        >
          <div className="flex flex-col space-y-4">
            {/* Mobile Search */}
            <Search
              placeholder="Search..."
              allowClear
              enterButton
              onSearch={handleSearch}
              className="mb-4"
            />

            {/* Navigation Items */}
            <Menu
              mode="vertical"
              selectedKeys={[getCurrentNavKey()]}
              className="border-0"
              items={navItems.map(item => ({
                key: item.key,
                label: item.label,
                onClick: () => {
                  router.push(item.href);
                  setMobileMenuOpen(false);
                },
              }))}
            />

            {session ? (
              <>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar
                      src={session.user.image}
                      icon={<UserOutlined />}
                      size="large"
                    />
                    <div>
                      <div className="font-medium">{session.user.name}</div>
                      <div className="text-sm text-gray-500">{session.user.email}</div>
                    </div>
                  </div>

                  <Menu
                    mode="vertical"
                    className="border-0"
                    items={userMenuWithHandlers.filter(item => item.type !== 'divider')}
                  />
                </div>

                {/* Mobile Create Button */}
                <Link href="/causes/create">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    block
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none mt-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Cause
                  </Button>
                </Link>
              </>
            ) : (
              <div className="border-t pt-4 mt-4 space-y-3">
                <Link href="/auth/signin">
                  <Button 
                    block 
                    size="large"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    type="primary"
                    block
                    size="large"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Drawer>

        {/* Mobile Search Modal */}
        <Drawer
          title="Search"
          placement="top"
          onClose={() => dispatch(setSearchOpen(false))}
          open={search.isOpen}
          height="auto"
          className="search-drawer"
        >
          <Search
            placeholder="Search causes, skills, or locations..."
            allowClear
            enterButton="Search"
            size="large"
            autoFocus
            onSearch={(value) => {
              handleSearch(value);
              dispatch(setSearchOpen(false));
            }}
          />
        </Drawer>
      </AntHeader>
    </Affix>
  );
}