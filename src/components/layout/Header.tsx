"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Drawer,
  Typography,
} from "antd";
import {
  FiMenu,
  FiPlus,
  FiSearch,
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiHeart,
  FiGrid,
  FiMessageCircle,
  FiHelpCircle,
  FiChevronDown,
  FiTarget,
  FiBook,
  FiHome,
  FiBookOpen,
  FiMail,
} from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import Image from "next/image";

const { Header } = Layout;
const { Text } = Typography;

const LogoComponent = () => (
  <Link href="/" style={{ textDecoration: "none" }}>
    <Image
      src="/images/logo2.png"
      alt="Hands2gether Logo"
      height={60}
      width={50}
      priority
    />
  </Link>
);

// Navigation Menu Items - Focused on helping people
const navigationItems = [
  {
    key: "home",
    label: "Home",
    href: "/",
    icon: <FiHome size={16} />,
  },
  {
    key: "food",
    label: "Food Assistance",
    href: "/causes?category=food",
    icon: <FiHeart size={16} />,
  },
  {
    key: "clothing",
    label: "Clothing Support",
    href: "/causes?category=clothing",
    icon: <FiTarget size={16} />,
  },
  {
    key: "education",
    label: "Training & Education",
    href: "/education",
    icon: <FiBookOpen size={16} />,
  },
  {
    key: "contact",
    label: "Contact",
    href: "/contact",
    icon: <FiMail size={16} />,
  },
];

// User Menu Component - Microsoft style
const UserMenu = ({ user }: { user: any }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <FiUser size={16} />,
      onClick: () => router.push("/profile"),
    },
    {
      key: "my-causes",
      label: "My initiatives",
      icon: <FiTarget size={16} />,
      onClick: () => router.push("/profile#causes"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <FiSettings size={16} />,
      onClick: () => router.push("/profile#settings"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "help",
      label: "Help & support",
      icon: <FiHelpCircle size={16} />,
      onClick: () => router.push("/help"),
    },
    {
      key: "logout",
      label: "Sign out",
      icon: <FiLogOut size={16} />,
      onClick: handleSignOut,
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          padding: "6px 8px",
          borderRadius: 4,
          border: "1px solid transparent",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        <Avatar src={user?.avatar || user?.image} icon={<FiUser />} size={28} />
        <Text
          style={{
            color: "#323130",
            fontWeight: 500,
            fontSize: "14px",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}
        >
          {user?.name?.split(" ")[0] || "User"}
        </Text>
        <FiChevronDown size={14} style={{ color: "#605e5c" }} />
      </div>
    </Dropdown>
  );
};

// Mobile Menu Component - Microsoft style
const MobileMenu = ({
  visible,
  onClose,
  user,
  currentPath,
}: {
  visible: boolean;
  onClose: () => void;
  user: any;
  currentPath: string;
}) => {
  const router = useRouter();

  const handleMenuClick = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    onClose();
  };

  return (
    <Drawer
      title={<LogoComponent />}
      placement="left"
      onClose={onClose}
      open={visible}
      width={300}
      styles={{
        body: { padding: 0 },
        header: {
          borderBottom: "1px solid #edebe9",
          padding: "16px 24px",
        },
      }}
    >
      <div style={{ padding: "16px 0" }}>
        {/* Navigation Items */}
        <div style={{ marginBottom: 24 }}>
          {navigationItems.map((item) => (
            <div
              key={item.key}
              onClick={() => handleMenuClick(item.href)}
              style={{
                padding: "12px 24px",
                cursor: "pointer",
                backgroundColor:
                  currentPath === item.href ? "#deecf9" : "transparent",
                borderLeft:
                  currentPath === item.href ? "3px solid #0078d4" : "none",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    color: currentPath === item.href ? "#0078d4" : "#323130",
                  }}
                >
                  {item.icon}
                </div>
                <Text
                  style={{
                    color: currentPath === item.href ? "#0078d4" : "#323130",
                    fontWeight: currentPath === item.href ? 600 : 400,
                    fontSize: "14px",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                >
                  {item.label}
                </Text>
              </div>
            </div>
          ))}
        </div>

        {/* Create Initiative Button */}
        <div style={{ padding: "0 24px", marginBottom: 32 }}>
          <Button
            type="primary"
            block
            size="large"
            icon={<FiPlus size={16} />}
            onClick={() => handleMenuClick("/causes/create")}
            style={{
              backgroundColor: "#0078d4",
              borderColor: "#0078d4",
              borderRadius: 4,
              height: 40,
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: "'Segoe UI', system-ui, sans-serif",
            }}
          >
            Help someone today
          </Button>
        </div>

        {/* User Section */}
        {user ? (
          <div>
            <div
              style={{ padding: "20px 24px", borderTop: "1px solid #edebe9" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <Avatar
                  src={user?.avatar || user?.image}
                  icon={<FiUser />}
                  size={40}
                />
                <div>
                  <Text
                    style={{
                      fontWeight: 600,
                      display: "block",
                      fontSize: "14px",
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                    }}
                  >
                    {user?.name || "User"}
                  </Text>
                  <Text
                    style={{
                      color: "#605e5c",
                      fontSize: "12px",
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                    }}
                  >
                    {user?.email}
                  </Text>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Button
                  type="text"
                  block
                  icon={<FiUser size={16} />}
                  onClick={() => handleMenuClick("/profile")}
                  style={{
                    justifyContent: "flex-start",
                    height: 36,
                    borderRadius: 4,
                    fontSize: "14px",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                >
                  Profile
                </Button>
                <Button
                  type="text"
                  block
                  icon={<FiTarget size={16} />}
                  onClick={() => handleMenuClick("/profile#causes")}
                  style={{
                    justifyContent: "flex-start",
                    height: 36,
                    borderRadius: 4,
                    fontSize: "14px",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                >
                  My initiatives
                </Button>
                <Button
                  type="text"
                  block
                  icon={<FiSettings size={16} />}
                  onClick={() => handleMenuClick("/profile#settings")}
                  style={{
                    justifyContent: "flex-start",
                    height: 36,
                    borderRadius: 4,
                    fontSize: "14px",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                >
                  Settings
                </Button>
                <Button
                  type="text"
                  block
                  icon={<FiHelpCircle size={16} />}
                  onClick={() => handleMenuClick("/help")}
                  style={{
                    justifyContent: "flex-start",
                    height: 36,
                    borderRadius: 4,
                    fontSize: "14px",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                >
                  Help & support
                </Button>
                <Button
                  type="text"
                  block
                  icon={<FiLogOut size={16} />}
                  onClick={handleSignOut}
                  style={{
                    justifyContent: "flex-start",
                    height: 36,
                    borderRadius: 4,
                    color: "#d13438",
                    fontSize: "14px",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "20px 24px", borderTop: "1px solid #edebe9" }}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Button
                type="primary"
                block
                size="large"
                onClick={() => handleMenuClick("/auth/signin")}
                style={{
                  backgroundColor: "#0078d4",
                  borderColor: "#0078d4",
                  borderRadius: 4,
                  height: 40,
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}
              >
                Sign in
              </Button>
              <Button
                block
                size="large"
                onClick={() => handleMenuClick("/auth/signup")}
                style={{
                  borderRadius: 4,
                  height: 40,
                  fontWeight: 600,
                  borderColor: "#8a8886",
                  fontSize: "14px",
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}
              >
                Sign up
              </Button>
            </Space>
          </div>
        )}
      </div>
    </Drawer>
  );
};

// Main Header Component - Microsoft.com style
export default function RevampedHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const user = session?.user;

  return (
    <>
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 90,
          padding: 0,
          backgroundColor: "white",
          borderBottom: `1px solid ${isScrolled ? "#e5e5e5" : "rgba(0,0,0,0.08)"}`,
          boxShadow: isScrolled ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* Microsoft.com style centered container */}
        <div
          style={{
            maxWidth: 1600,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* Left - Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <LogoComponent />
          </div>

          {/* Center - Navigation (Microsoft.com style) */}
          <nav style={{ display: "none" }} className="microsoft-nav">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
              }}
            >
              {navigationItems.map((item) => {
                // Items with submenus
                if (["initiatives", "education"].includes(item.key)) {
                  const submenuItems =
                    item.key === "initiatives"
                      ? [
                          {
                            key: "browse",
                            label: "Find ways to help",
                            onClick: () => router.push("/causes"),
                          },
                          {
                            key: "create",
                            label: "Create a way to help",
                            onClick: () => router.push("/causes/create"),
                          },
                          {
                            key: "my-initiatives",
                            label: "My ways to help",
                            onClick: () => router.push("/profile#causes"),
                          },
                        ]
                      : [
                          {
                            key: "training",
                            label: "Training programs",
                            onClick: () =>
                              router.push("/education?type=training"),
                          },
                          {
                            key: "workshops",
                            label: "Workshops",
                            onClick: () =>
                              router.push("/education?type=workshops"),
                          },
                          {
                            key: "resources",
                            label: "Learning resources",
                            onClick: () =>
                              router.push("/education?type=resources"),
                          },
                        ];

                  return (
                    <Dropdown
                      key={item.key}
                      menu={{ items: submenuItems }}
                      trigger={["hover"]}
                      placement="bottomLeft"
                    >
                      <div
                        style={{
                          color: pathname === item.href ? "#0067b8" : "#262626",
                          fontWeight: pathname === item.href ? 600 : 400,
                          fontSize: "15px",
                          position: "relative",
                          cursor: "pointer",
                          transition: "color 0.2s ease",
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                          borderBottom:
                            pathname === item.href
                              ? "2px solid #0067b8"
                              : "2px solid transparent",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          paddingBottom: "2px",
                        }}
                        onMouseEnter={(e) => {
                          if (pathname !== item.href) {
                            e.currentTarget.style.color = "#0067b8";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (pathname !== item.href) {
                            e.currentTarget.style.color = "#262626";
                          }
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {item.icon}
                          {item.label}
                          <FiChevronDown
                            size={12}
                            style={{
                              marginLeft: 4,
                              opacity: 0.7,
                            }}
                          />
                        </div>
                      </div>
                    </Dropdown>
                  );
                }

                // Regular menu items without submenus
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        color: pathname === item.href ? "#0067b8" : "#262626",
                        fontWeight: pathname === item.href ? 600 : 400,
                        fontSize: "15px",
                        position: "relative",
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        borderBottom:
                          pathname === item.href
                            ? "2px solid #0067b8"
                            : "2px solid transparent",
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        paddingBottom: "2px",
                      }}
                      onMouseEnter={(e) => {
                        if (pathname !== item.href) {
                          e.currentTarget.style.color = "#0067b8";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pathname !== item.href) {
                          e.currentTarget.style.color = "#262626";
                        }
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right - Actions & User */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Search */}
            <div style={{ display: "none" }} className="microsoft-search">
              <Button
                type="text"
                icon={<FiSearch size={16} />}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#262626",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f3f2f1";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
                onClick={() => router.push("/causes?search=true")}
              />
            </div>

            {/* Create Initiative Button */}
            <div style={{ display: "none" }} className="microsoft-create">
              <Button
                type="primary"
                style={{
                  backgroundColor: "#0067b8",
                  borderColor: "#0067b8",
                  borderRadius: 2,
                  fontWeight: 600,
                  height: 32,
                  fontSize: "14px",
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  padding: "0 16px",
                }}
                onClick={() => router.push("/causes/create")}
              >
                Help someone today
              </Button>
            </div>

            {/* User Section */}
            <div style={{ display: "none" }} className="microsoft-user">
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Notifications */}
                  <Button
                    type="text"
                    icon={<FiBell size={16} />}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#262626",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f3f2f1";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                    onClick={() => router.push("/notifications")}
                  />

                  {/* User Menu */}
                  <UserMenu user={user} />
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Link href="/auth/signin">
                    <Button
                      style={{
                        border: "1px solid #8a8886",
                        background: "transparent",
                        color: "#262626",
                        borderRadius: 2,
                        fontWeight: 600,
                        height: 32,
                        fontSize: "14px",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        padding: "0 16px",
                      }}
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "#0067b8",
                        borderColor: "#0067b8",
                        borderRadius: 2,
                        fontWeight: 600,
                        height: 32,
                        fontSize: "14px",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        padding: "0 16px",
                      }}
                    >
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<FiMenu size={20} />}
              style={{
                border: "none",
                background: "transparent",
                color: "#262626",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
              }}
              className="mobile-menu-btn"
              onClick={() => setMobileMenuVisible(true)}
            />
          </div>
        </div>
      </Header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        visible={mobileMenuVisible}
        onClose={() => setMobileMenuVisible(false)}
        user={user}
        currentPath={pathname}
      />

      {/* Spacer for fixed header */}
      <div style={{ height: 60 }} />

      <style jsx global>{`
        /* Microsoft.com style responsive navigation */
        @media (min-width: 1024px) {
          .microsoft-nav {
            display: block !important;
          }
          .microsoft-search {
            display: block !important;
          }
          .microsoft-create {
            display: block !important;
          }
          .microsoft-user {
            display: block !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }

        @media (max-width: 1023px) {
          .microsoft-nav {
            display: none !important;
          }
          .microsoft-search {
            display: none !important;
          }
          .microsoft-create {
            display: none !important;
          }
          .microsoft-user {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }

        /* Microsoft.com style hover effects */
        .microsoft-nav a:hover {
          color: #0067b8 !important;
        }

        /* Dropdown animations */
        .ant-dropdown {
          border-radius: 2px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          border: 1px solid #e1dfdd;
        }

        .ant-dropdown-menu {
          border-radius: 2px;
          padding: 8px 0;
        }

        .ant-dropdown-menu-item {
          font-family: "Segoe UI", system-ui, sans-serif;
          font-size: 14px;
          padding: 8px 16px;
          transition: background-color 0.2s ease;
        }

        .ant-dropdown-menu-item:hover {
          background-color: #f3f2f1;
        }
      `}</style>
    </>
  );
}
