"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Spin,
  Empty,
  Input,
  Select,
  Tabs,
  Badge,
  Pagination,
  Affix,
  Dropdown,
  Tag,
  Slider,
} from "antd";
import {
  HeartOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  UserOutlined,
  EyeOutlined,
  ShareAltOutlined,
  BookOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  unsplashImages,
  getRandomCauseImage,
  getCategoryImage,
} from "@/services/unsplashService";

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Cause {
  id: number;
  title: string;
  description: string;
  short_description: string;
  location: string;
  category: string;
  priority: string;
  created_at: string;
  user_name: string;
  user_avatar?: string;
  view_count: number;
  like_count: number;
  saved_count: number;
  urgency_level: "low" | "medium" | "high" | "critical";
  goal_amount?: number;
  raised_amount?: number;
  percentage_complete?: number;
  image_url?: string;
  tags: string[];
  volunteers_needed: number;
  volunteers_joined: number;
  location_coordinates?: { lat: number; lng: number };
  deadline?: string;
  verified: boolean;
}

const mockCauses: Cause[] = [
  {
    id: 1,
    title: "Emergency Food Relief for Hurricane Victims",
    description:
      "Providing immediate food assistance to families displaced by recent hurricane damage in coastal communities.",
    short_description: "Emergency food relief for hurricane victims",
    location: "Miami, FL",
    category: "Emergency Relief",
    priority: "high",
    urgency_level: "critical",
    created_at: "2024-01-15",
    user_name: "Sarah Johnson",
    user_avatar: "/images/avatars/sarah.jpg",
    view_count: 1245,
    like_count: 189,
    saved_count: 67,
    goal_amount: 25000,
    raised_amount: 18500,
    percentage_complete: 74,
    image_url: unsplashImages.causes[0].url,
    tags: ["emergency", "food-relief", "hurricane", "families"],
    volunteers_needed: 50,
    volunteers_joined: 32,
    deadline: "2024-02-15",
    verified: true,
  },
  {
    id: 2,
    title: "Community Food Bank Expansion",
    description:
      "Expanding our local food bank to serve 500 more families weekly with fresh produce and nutritious meals.",
    short_description: "Expanding food bank to serve more families",
    location: "Seattle, WA",
    category: "Food Banks",
    priority: "high",
    urgency_level: "high",
    created_at: "2024-01-14",
    user_name: "Mike Chen",
    user_avatar: "/images/avatars/mike.jpg",
    view_count: 892,
    like_count: 145,
    saved_count: 89,
    goal_amount: 50000,
    raised_amount: 28000,
    percentage_complete: 56,
    image_url: unsplashImages.causes[1].url,
    tags: ["food-bank", "expansion", "families", "nutrition"],
    volunteers_needed: 25,
    volunteers_joined: 18,
    deadline: "2024-03-01",
    verified: true,
  },
  {
    id: 3,
    title: "Mobile Community Kitchen Initiative",
    description:
      "Creating a mobile kitchen to deliver hot, nutritious meals to underserved neighborhoods and elderly residents.",
    short_description: "Mobile kitchen for hot meals delivery",
    location: "Austin, TX",
    category: "Community Kitchens",
    priority: "medium",
    urgency_level: "medium",
    created_at: "2024-01-13",
    user_name: "Lisa Rodriguez",
    user_avatar: "/images/avatars/lisa.jpg",
    view_count: 567,
    like_count: 78,
    saved_count: 34,
    goal_amount: 35000,
    raised_amount: 12000,
    percentage_complete: 34,
    image_url: unsplashImages.causes[2].url,
    tags: ["mobile-kitchen", "elderly", "neighborhoods", "hot-meals"],
    volunteers_needed: 15,
    volunteers_joined: 8,
    deadline: "2024-04-01",
    verified: true,
  },
  {
    id: 4,
    title: "School Breakfast Program Enhancement",
    description:
      "Improving school breakfast programs to ensure no child starts their day hungry, focusing on nutritious options.",
    short_description: "Enhanced school breakfast for students",
    location: "Denver, CO",
    category: "School Meals",
    priority: "medium",
    urgency_level: "medium",
    created_at: "2024-01-12",
    user_name: "David Park",
    view_count: 423,
    like_count: 56,
    saved_count: 23,
    goal_amount: 20000,
    raised_amount: 8500,
    percentage_complete: 43,
    image_url: unsplashImages.causes[3].url,
    tags: ["school-meals", "children", "nutrition", "education"],
    volunteers_needed: 12,
    volunteers_joined: 5,
    deadline: "2024-03-15",
    verified: true,
  },
  {
    id: 5,
    title: "Senior Meal Delivery Service",
    description:
      "Providing weekly meal deliveries to homebound seniors, ensuring they receive proper nutrition and social connection.",
    short_description: "Weekly meal delivery for seniors",
    location: "Portland, OR",
    category: "Senior Support",
    priority: "high",
    urgency_level: "high",
    created_at: "2024-01-11",
    user_name: "Emily Watson",
    view_count: 634,
    like_count: 92,
    saved_count: 45,
    goal_amount: 30000,
    raised_amount: 19000,
    percentage_complete: 63,
    image_url: unsplashImages.causes[4].url,
    tags: ["seniors", "meal-delivery", "homebound", "nutrition"],
    volunteers_needed: 20,
    volunteers_joined: 14,
    deadline: "2024-02-28",
    verified: true,
  },
  {
    id: 6,
    title: "Holiday Meal Distribution Drive",
    description:
      "Organizing special holiday meal packages for families in need, including traditional foods and festive treats.",
    short_description: "Holiday meals for families in need",
    location: "Boston, MA",
    category: "Holiday Meals",
    priority: "urgent",
    urgency_level: "critical",
    created_at: "2024-01-10",
    user_name: "Robert Kim",
    view_count: 789,
    like_count: 134,
    saved_count: 78,
    goal_amount: 15000,
    raised_amount: 11200,
    percentage_complete: 75,
    image_url: unsplashImages.causes[5].url,
    tags: ["holiday-meals", "families", "celebration", "community"],
    volunteers_needed: 30,
    volunteers_joined: 22,
    deadline: "2024-01-25",
    verified: true,
  },
];

const urgencyColors = {
  low: "#10B981",
  medium: "#F59E0B",
  high: "#EF4444",
  critical: "#DC2626",
};

const categoryColors = {
  "Emergency Relief": "#EF4444",
  "Food Banks": "#3B82F6",
  "Community Kitchens": "#10B981",
  "School Meals": "#F59E0B",
  "Senior Support": "#8B5CF6",
  "Holiday Meals": "#EC4899",
};

const categories = [
  "All Categories",
  "Emergency Relief",
  "Food Banks",
  "Community Kitchens",
  "School Meals",
  "Senior Support",
  "Holiday Meals",
];

const sortOptions = [
  { label: "Most Recent", value: "recent" },
  { label: "Most Popular", value: "popular" },
  { label: "Ending Soon", value: "ending" },
  { label: "Most Funded", value: "funded" },
  { label: "Most Urgent", value: "urgent" },
];

export default function CausesPage() {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [filteredCauses, setFilteredCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedUrgency, setSelectedUrgency] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCauses(mockCauses);
      setFilteredCauses(mockCauses);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...causes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (cause) =>
          cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cause.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cause.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cause.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (cause) => cause.category === selectedCategory,
      );
    }

    // Urgency filter
    if (selectedUrgency.length > 0) {
      filtered = filtered.filter((cause) =>
        selectedUrgency.includes(cause.urgency_level),
      );
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort(
          (a, b) => b.like_count + b.view_count - (a.like_count + a.view_count),
        );
        break;
      case "ending":
        filtered.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        });
        break;
      case "funded":
        filtered.sort(
          (a, b) => (b.percentage_complete || 0) - (a.percentage_complete || 0),
        );
        break;
      case "urgent":
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        filtered.sort(
          (a, b) =>
            urgencyOrder[b.urgency_level] - urgencyOrder[a.urgency_level],
        );
        break;
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    }

    setFilteredCauses(filtered);
    setCurrentPage(1);
  }, [causes, searchTerm, selectedCategory, selectedUrgency, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const paginatedCauses = filteredCauses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Title level={1} className="text-white mb-6 text-5xl font-bold">
                Discover Meaningful Causes
              </Title>
              <Paragraph className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of changemakers creating real impact in
                communities worldwide. Every action matters, every contribution
                counts.
              </Paragraph>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">
                    2,567
                  </div>
                  <div className="text-blue-200">Active Causes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">
                    12,847
                  </div>
                  <div className="text-blue-200">Volunteers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">
                    $2.3M
                  </div>
                  <div className="text-blue-200">Raised</div>
                </div>
              </div>

              <Space size="large">
                <Link href="/causes/create">
                  <Button
                    type="primary"
                    size="large"
                    icon={<HeartOutlined />}
                    className="bg-white text-blue-600 border-white hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 h-12"
                  >
                    Start a Cause
                  </Button>
                </Link>
                <Button
                  size="large"
                  className="bg-transparent text-white border-white hover:bg-white/10 font-semibold px-8 h-12"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Explore Causes
                </Button>
              </Space>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Search and Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="p-6">
                {/* Search Bar */}
                <div className="mb-6">
                  <Search
                    placeholder="Search by title, location, or tags..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    style={{ borderRadius: "12px" }}
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-3">
                    <Select
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      size="large"
                      style={{ minWidth: 160 }}
                      className="rounded-lg"
                    >
                      {categories.map((cat) => (
                        <Option key={cat} value={cat}>
                          {cat}
                        </Option>
                      ))}
                    </Select>

                    <Select
                      mode="multiple"
                      placeholder="Urgency Level"
                      value={selectedUrgency}
                      onChange={setSelectedUrgency}
                      size="large"
                      style={{ minWidth: 160 }}
                      className="rounded-lg"
                    >
                      <Option value="critical">Critical</Option>
                      <Option value="high">High</Option>
                      <Option value="medium">Medium</Option>
                      <Option value="low">Low</Option>
                    </Select>

                    <Select
                      value={sortBy}
                      onChange={setSortBy}
                      size="large"
                      style={{ minWidth: 160 }}
                      className="rounded-lg"
                    >
                      {sortOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type={showFilters ? "primary" : "default"}
                      icon={<FilterOutlined />}
                      onClick={() => setShowFilters(!showFilters)}
                      size="large"
                    >
                      Filters
                    </Button>

                    <Text className="text-gray-600">
                      {filteredCauses.length} cause
                      {filteredCauses.length !== 1 ? "s" : ""} found
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results Section */}
          {loading ? (
            <div className="text-center py-20">
              <Spin size="large" />
              <div className="mt-4 text-gray-600 text-lg">
                Finding the best causes for you...
              </div>
            </div>
          ) : filteredCauses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Empty
                description={
                  <div className="text-center py-8">
                    <Title level={3} className="text-gray-400 mb-4">
                      No causes found
                    </Title>
                    <Paragraph className="text-gray-500 mb-6">
                      Try adjusting your search criteria or explore different
                      categories.
                    </Paragraph>
                    <Button
                      type="primary"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All Categories");
                        setSelectedUrgency([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                }
                className="py-20"
              />
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Row gutter={[24, 32]}>
                    {paginatedCauses.map((cause, index) => (
                      <Col xs={24} md={12} lg={8} key={cause.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        >
                          <Card
                            className="h-full hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl overflow-hidden group cursor-pointer"
                            cover={
                              <div className="relative h-56 overflow-hidden">
                                <Image
                                  src={
                                    cause.image_url || getRandomCauseImage().url
                                  }
                                  alt={cause.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                {/* Overlay badges */}
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                  <div className="flex gap-2">
                                    <Badge
                                      status="processing"
                                      text={
                                        <span
                                          className="px-3 py-1 rounded-full text-xs font-medium text-white bg-black/30 backdrop-blur-sm"
                                          style={{
                                            backgroundColor: `${categoryColors[cause.category as keyof typeof categoryColors]}88`,
                                          }}
                                        >
                                          {cause.category}
                                        </span>
                                      }
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    {cause.verified && (
                                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                        ✓ Verified
                                      </div>
                                    )}
                                    <div
                                      className="px-2 py-1 rounded-full text-xs font-medium text-white capitalize"
                                      style={{
                                        backgroundColor:
                                          urgencyColors[cause.urgency_level],
                                      }}
                                    >
                                      {cause.urgency_level}
                                    </div>
                                  </div>
                                </div>

                                {/* Deadline warning */}
                                {getDaysLeft(cause.deadline) !== null &&
                                  getDaysLeft(cause.deadline)! <= 7 && (
                                    <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                      {getDaysLeft(cause.deadline)} days left
                                    </div>
                                  )}
                              </div>
                            }
                          >
                            <div className="p-6">
                              {/* Title */}
                              <Title
                                level={4}
                                className="mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors"
                              >
                                {cause.title}
                              </Title>

                              {/* Description */}
                              <Paragraph className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {cause.short_description}
                              </Paragraph>

                              {/* Progress Bar */}
                              {cause.goal_amount && (
                                <div className="mb-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <Text className="text-sm font-medium text-gray-700">
                                      {formatCurrency(cause.raised_amount || 0)}{" "}
                                      raised
                                    </Text>
                                    <Text className="text-sm text-gray-500">
                                      {cause.percentage_complete}% complete
                                    </Text>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min(cause.percentage_complete || 0, 100)}%`,
                                      }}
                                    />
                                  </div>
                                  <Text className="text-xs text-gray-500 mt-1">
                                    Goal: {formatCurrency(cause.goal_amount)}
                                  </Text>
                                </div>
                              )}

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mb-4">
                                {cause.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Tag
                                    key={tagIndex}
                                    className="text-xs rounded-full border-blue-200 text-blue-600"
                                  >
                                    {tag}
                                  </Tag>
                                ))}
                                {cause.tags.length > 3 && (
                                  <Tag className="text-xs rounded-full">
                                    +{cause.tags.length - 3} more
                                  </Tag>
                                )}
                              </div>

                              {/* Meta Information */}
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-500 text-sm">
                                  <EnvironmentOutlined className="mr-2 text-blue-500" />
                                  {cause.location}
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                  <UserOutlined className="mr-2 text-blue-500" />
                                  {cause.volunteers_joined}/
                                  {cause.volunteers_needed} volunteers
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                  <CalendarOutlined className="mr-2 text-blue-500" />
                                  Created {formatDate(cause.created_at)}
                                </div>
                              </div>

                              {/* Stats Footer */}
                              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center hover:text-red-500 transition-colors cursor-pointer">
                                    <HeartOutlined className="mr-1" />
                                    {cause.like_count}
                                  </span>
                                  <span className="flex items-center">
                                    <EyeOutlined className="mr-1" />
                                    {cause.view_count}
                                  </span>
                                  <span className="flex items-center hover:text-blue-500 transition-colors cursor-pointer">
                                    <BookOutlined className="mr-1" />
                                    {cause.saved_count}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Button
                                    type="text"
                                    icon={<ShareAltOutlined />}
                                    size="small"
                                    className="text-gray-400 hover:text-blue-500"
                                  />
                                </div>
                              </div>

                              {/* Creator Info */}
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {cause.user_name.charAt(0)}
                                  </div>
                                  <div>
                                    <Text className="text-sm font-medium text-gray-700">
                                      {cause.user_name}
                                    </Text>
                                    <div className="text-xs text-gray-500">
                                      Organizer
                                    </div>
                                  </div>
                                </div>

                                <Link href={`/causes/${cause.id}`}>
                                  <Button
                                    type="primary"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg transition-all duration-300 rounded-full"
                                  >
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {filteredCauses.length > pageSize && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-12 flex justify-center"
                >
                  <Pagination
                    current={currentPage}
                    total={filteredCauses.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} causes`
                    }
                    className="text-center"
                  />
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
