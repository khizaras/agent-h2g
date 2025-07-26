'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Input, Drawer, Space, Affix, Col, Row, Typography, Card } from 'antd';
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
  MoonOutlined,
  DownOutlined,
  BookOutlined,
  TeamOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  StarOutlined
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
const { Title, Text } = Typography;

interface MenuItem {
  key: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  description?: string;
  featured?: boolean;
}

interface MegaMenuSection {
  title: string;
  items: MenuItem[];
}

const causesMenu: MegaMenuSection[] = [
  {
    title: "Discover",
    items: [
      {
        key: 'all-causes',
        label: 'All Causes',
        href: '/causes',
        icon: <HeartOutlined />,
        description: 'Browse all active causes'
      },
      {
        key: 'emergency-relief',
        label: 'Emergency Relief',
        href: '/causes?category=emergency',
        icon: <ThunderboltOutlined />,
        description: 'Urgent community needs'
      },
      {
        key: 'food-security',
        label: 'Food Security',
        href: '/causes?category=food',
        icon: <SafetyCertificateOutlined />,
        description: 'Fighting hunger together'
      },
      {
        key: 'education',
        label: 'Education',
        href: '/causes?category=education',
        icon: <BookOutlined />,
        description: 'Supporting learning opportunities'
      }
    ]
  },
  {
    title: "Get Involved",
    items: [
      {
        key: 'create-cause',
        label: 'Start a Cause',
        href: '/causes/create',
        icon: <PlusOutlined />,
        description: 'Launch your community initiative',
        featured: true
      },
      {
        key: 'volunteer',
        label: 'Volunteer',
        href: '/volunteer',
        icon: <TeamOutlined />,
        description: 'Find volunteer opportunities'
      },
      {
        key: 'fundraise',
        label: 'Fundraise',
        href: '/fundraise',
        icon: <TrophyOutlined />,
        description: 'Raise funds for causes'
      },
      {
        key: 'share-skills',
        label: 'Share Skills',
        href: '/skills',
        icon: <StarOutlined />,
        description: 'Offer your expertise'
      }
    ]
  }
];

const aboutMenu: MenuItem[] = [
  {
    key: 'our-story',
    label: 'Our Story',
    href: '/about',
    icon: <BookOutlined />,
    description: 'Learn about our mission'
  },
  {
    key: 'impact',
    label: 'Our Impact',
    href: '/impact',
    icon: <BarChartOutlined />,
    description: 'See the change we\'re making'
  },
  {
    key: 'team',
    label: 'Our Team',
    href: '/team',
    icon: <TeamOutlined />,
    description: 'Meet the people behind Hands2gether'
  },
  {
    key: 'careers',
    label: 'Careers',
    href: '/careers',
    icon: <GlobalOutlined />,
    description: 'Join our mission'
  },
  {
    key: 'press',
    label: 'Press',
    href: '/press',
    icon: <FileTextOutlined />,
    description: 'Media resources and news'
  }
];

const resourcesMenu: MenuItem[] = [
  {
    key: 'help-center',
    label: 'Help Center',
    href: '/help',
    icon: <BookOutlined />,
    description: 'Get answers to common questions'
  },
  {
    key: 'safety-guidelines',
    label: 'Safety Guidelines',
    href: '/safety',
    icon: <SafetyCertificateOutlined />,
    description: 'Community safety and trust'
  },
  {
    key: 'success-stories',
    label: 'Success Stories',
    href: '/success-stories',
    icon: <TrophyOutlined />,
    description: 'Inspiring community achievements'
  },
  {
    key: 'blog',
    label: 'Blog',
    href: '/blog',
    icon: <FileTextOutlined />,
    description: 'Tips, insights, and updates'
  }
];

const contactMenu: MenuItem[] = [
  {
    key: 'contact-us',
    label: 'Contact Us',
    href: '/contact',
    icon: <PhoneOutlined />,
    description: 'Get in touch with our team'
  },
  {
    key: 'support',
    label: 'Support',
    href: '/support',
    icon: <MessageOutlined />,
    description: '24/7 customer support'
  },
  {
    key: 'partnerships',
    label: 'Partnerships',
    href: '/partnerships',
    icon: <TeamOutlined />,
    description: 'Partner with us'
  },
  {
    key: 'feedback',
    label: 'Feedback',
    href: '/feedback',
    icon: <MailOutlined />,
    description: 'Share your thoughts'
  }
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
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

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
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/causes')) return 'causes';
    if (pathname.startsWith('/about') || pathname.startsWith('/team') || pathname.startsWith('/impact')) return 'about';
    if (pathname.startsWith('/help') || pathname.startsWith('/blog') || pathname.startsWith('/success-stories')) return 'resources';
    if (pathname.startsWith('/contact') || pathname.startsWith('/support')) return 'contact';
    return '';
  };

  const userMenuWithHandlers = userMenuItems.map(item => ({
    ...item,
    onClick: item.onClick || (() => {
      if (item.href) {
        router.push(item.href);
      }
    }),
  }));

  // Megamenu component
  const MegaMenu = ({ sections, className = "" }: { sections: MegaMenuSection[], className?: string }) => (
    <div className={`absolute top-full left-0 w-screen bg-white border-t border-gray-100 shadow-xl z-[60] ${className}`}>
      <div className="container mx-auto px-6 py-8">
        <Row gutter={[32, 24]}>
          {sections.map((section, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <div className="mb-4">
                <Title level={5} className="text-gray-900 mb-3 font-semibold">
                  {section.title}
                </Title>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href || '#'}
                      className={`block p-3 rounded-lg hover:bg-gray-50 transition-colors group ${
                        item.featured ? 'bg-blue-50 border border-blue-100' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`text-lg mt-0.5 ${
                          item.featured ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${
                            item.featured ? 'text-blue-900' : 'text-gray-900 group-hover:text-blue-600'
                          }`}>
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );

  // Simple dropdown menu component
  const SimpleDropdown = ({ items, className = "" }: { items: MenuItem[], className?: string }) => (
    <div className={`absolute top-full left-0 min-w-[280px] bg-white border border-gray-100 rounded-lg shadow-xl z-[60] ${className}`}>
      <div className="py-2">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href || '#'}
            className="block px-4 py-3 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-start space-x-3">
              <div className="text-gray-500 group-hover:text-blue-600 mt-0.5">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900 group-hover:text-blue-600">
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <Affix offsetTop={0}>
        <AntHeader 
          className={`
            fixed top-0 left-0 right-0 z-50 px-0 h-16 leading-16
            transition-all duration-300 ease-in-out bg-white shadow-sm border-b border-gray-100
          `}
        >
          <div className="container mx-auto px-6 h-full">
            <div className="flex items-center justify-between h-full">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 z-50"
              >
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                    <HeartOutlined className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-semibold text-gray-900">
                    Hands2gether
                  </span>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-2">
                {/* Home */}
                <Link 
                  href="/"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    getCurrentNavKey() === 'home' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>

                {/* Causes Megamenu */}
                <div 
                  className="relative"
                  onMouseEnter={() => setHoveredMenu('causes')}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                      getCurrentNavKey() === 'causes' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Causes</span>
                    <DownOutlined className="text-xs" />
                  </button>
                  {hoveredMenu === 'causes' && <MegaMenu sections={causesMenu} />}
                </div>

                {/* About Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setHoveredMenu('about')}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                      getCurrentNavKey() === 'about' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>About</span>
                    <DownOutlined className="text-xs" />
                  </button>
                  {hoveredMenu === 'about' && <SimpleDropdown items={aboutMenu} />}
                </div>

                {/* Resources Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setHoveredMenu('resources')}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                      getCurrentNavKey() === 'resources' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Resources</span>
                    <DownOutlined className="text-xs" />
                  </button>
                  {hoveredMenu === 'resources' && <SimpleDropdown items={resourcesMenu} />}
                </div>

                {/* Contact Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setHoveredMenu('contact')}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                      getCurrentNavKey() === 'contact' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Contact</span>
                    <DownOutlined className="text-xs" />
                  </button>
                  {hoveredMenu === 'contact' && <SimpleDropdown items={contactMenu} />}
                </div>
              </nav>

              {/* Search Bar */}
              <div className="hidden md:block flex-1 max-w-sm mx-8">
                <Search
                  placeholder="Search causes, skills, or locations..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                  className="search-bar"
                  style={{ borderRadius: '8px' }}
                />
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-3">
                {/* Mobile Search */}
                <Button
                  type="text"
                  size="middle"
                  icon={<SearchOutlined />}
                  onClick={() => dispatch(setSearchOpen(true))}
                  className="md:hidden hover:bg-gray-50 rounded-lg"
                />

                {session ? (
                  <>
                    {/* Create Cause Button */}
                    <Link href="/causes/create">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="bg-blue-600 hover:bg-blue-700 border-none shadow-sm hover:shadow-md transition-all duration-200 rounded-lg hidden sm:flex font-medium"
                        size="middle"
                      >
                        Create Cause
                      </Button>
                    </Link>

                    {/* Notifications */}
                    <Badge count={notifications.unreadCount} size="small">
                      <Button
                        type="text"
                        size="middle"
                        icon={<BellOutlined />}
                        onClick={() => dispatch(setNotificationsOpen(!notifications.isOpen))}
                        className="hover:bg-gray-50 rounded-lg"
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
                        className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <Avatar
                          src={session.user.image}
                          icon={<UserOutlined />}
                          size="small"
                        />
                        <span className="hidden md:inline font-medium text-gray-700 text-sm">
                          {session.user.name}
                        </span>
                        <DownOutlined className="text-xs text-gray-400" />
                      </Button>
                    </Dropdown>
                  </>
                ) : (
                  /* Auth Buttons */
                  <Space size="small">
                    <Link href="/auth/signin">
                      <Button 
                        type="text" 
                        className="font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                        size="middle"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button 
                        type="primary"
                        className="bg-blue-600 hover:bg-blue-700 border-none shadow-sm hover:shadow-md transition-all duration-200 rounded-lg font-medium"
                        size="middle"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </Space>
                )}

                {/* Mobile Menu Button */}
                <Button
                  type="text"
                  size="middle"
                  icon={<MenuOutlined />}
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden hover:bg-gray-50 rounded-lg"
                />
              </div>
            </div>
          </div>
        </AntHeader>
      </Affix>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <HeartOutlined className="text-white" />
            </div>
            <span className="text-lg font-semibold">Hands2gether</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={320}
        className="mobile-menu"
      >
        <div className="flex flex-col space-y-6">
          {/* Mobile Search */}
          <Search
            placeholder="Search..."
            allowClear
            enterButton
            onSearch={handleSearch}
            style={{ borderRadius: '8px' }}
          />

          {/* Quick Actions */}
          {session && (
            <Link href="/causes/create">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                block
                className="bg-blue-600 hover:bg-blue-700 border-none font-medium rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Cause
              </Button>
            </Link>
          )}

          {/* Navigation Sections */}
          <div className="space-y-6">
            {/* Causes Section */}
            <div>
              <Title level={5} className="text-gray-900 mb-3">Causes</Title>
              <div className="space-y-1">
                {causesMenu.flatMap(section => section.items).map(item => (
                  <Link
                    key={item.key}
                    href={item.href || '#'}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-500">{item.icon}</div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* About & Resources */}
            <div>
              <Title level={5} className="text-gray-900 mb-3">Company</Title>
              <div className="space-y-1">
                {[...aboutMenu.slice(0, 3), ...resourcesMenu.slice(0, 2)].map(item => (
                  <Link
                    key={item.key}
                    href={item.href || '#'}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-500">{item.icon}</div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {session ? (
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar
                  src={session.user.image}
                  icon={<UserOutlined />}
                  size="large"
                />
                <div>
                  <div className="font-medium text-gray-900">{session.user.name}</div>
                  <div className="text-sm text-gray-500">{session.user.email}</div>
                </div>
              </div>

              <div className="space-y-1">
                {userMenuItems.filter(item => item.type !== 'divider').map(item => (
                  <button
                    key={item.key}
                    onClick={() => {
                      handleMenuClick(item);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="text-gray-500">{item.icon}</div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-t pt-6 mt-6 space-y-3">
              <Link href="/auth/signin">
                <Button 
                  block 
                  size="large"
                  className="rounded-lg font-medium"
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
                  className="bg-blue-600 hover:bg-blue-700 border-none rounded-lg font-medium"
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
          style={{ borderRadius: '8px' }}
        />
      </Drawer>
    </div>
  );
}