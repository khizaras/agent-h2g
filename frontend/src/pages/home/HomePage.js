import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SEO from "../../components/seo/SEO";
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Carousel,
  Divider,
  Statistic,
  Space,
  Spin,
  Avatar,
  Progress,
  Tag,
} from "antd";
import {
  HeartFilled,
  TeamOutlined,
  RiseOutlined,
  ArrowRightOutlined,
  GiftOutlined,
  ShareAltOutlined,
  EditOutlined,
  GlobalOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { getCauses, reset } from "../../redux/slices/causesSlice";
import CauseCard from "../../components/causes/CauseCard";
import "./HomePage.css"; // Import a dedicated CSS file for HomePage styles

const { Title, Paragraph, Text } = Typography;

// Placeholder images - replace with your actual high-quality images
const HERO_BACKGROUND_URL =
  "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"; // Updated to a more modern helping hands image
const IMPACT_IMAGE_1_URL =
  "https://images.unsplash.com/photo-1509099652299-30938b0aeb63?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"; // Updated to more impactful community support image
const IMPACT_IMAGE_2_URL =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"; // Updated to more vibrant community event image

const HomePage = () => {
  const dispatch = useDispatch();
  const { causes, isLoading } = useSelector((state) => state.causes);

  useEffect(() => {
    dispatch(getCauses({ limit: 3 })); // Fetch 3 featured causes for a cleaner look

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  const statsData = [
    {
      title: "Lives Touched",
      value: 1200,
      icon: <TeamOutlined />,
      suffix: "+",
      color: "#4A6FDC", // Modern blue
      description: "People directly benefited from our initiatives",
    },
    {
      title: "Active Causes",
      value: 45,
      icon: <HeartFilled />,
      color: "#F06292", // Soft pink
      description: "Ongoing campaigns making real change",
    },
    {
      title: "Funds Raised",
      value: 5800,
      icon: <RiseOutlined />,
      prefix: "$",
      color: "#43A047", // Fresh green
      description: "Total contributions from our community",
    },
  ];
  const howItWorksSteps = [
    {
      icon: <EditOutlined style={{ fontSize: 48, color: "#4A6FDC" }} />,
      title: "Create or Find a Cause",
      description:
        "Easily start your own fundraising campaign or discover existing causes that resonate with you.",
      tag: "Step 1",
    },
    {
      icon: <ShareAltOutlined style={{ fontSize: 48, color: "#43A047" }} />,
      title: "Share & Spread Awareness",
      description:
        "Amplify your impact by sharing causes with your network through social media and email.",
      tag: "Step 2",
    },
    {
      icon: <GiftOutlined style={{ fontSize: 48, color: "#F9A825" }} />,
      title: "Contribute & Make a Difference",
      description:
        "Securely donate to causes you care about and see the tangible results of your generosity.",
      tag: "Step 3",
    },
  ];
  const testimonials = [
    {
      avatar: (
        <Avatar
          size={80}
          src="https://randomuser.me/api/portraits/women/44.jpg"
          style={{ border: "3px solid #4A6FDC" }}
        />
      ),
      quote:
        "Hands2gether provided an incredible platform to support local families. Seeing the direct impact of our collective effort was truly heartwarming.",
      name: "Jane Doe",
      role: "Community Volunteer",
      rating: 5,
    },
    {
      avatar: (
        <Avatar
          size={80}
          src="https://randomuser.me/api/portraits/men/32.jpg"
          style={{ border: "3px solid #4A6FDC" }}
        />
      ),
      quote:
        "As a small organization, fundraising was always a challenge. Hands2gether made it simple to reach a wider audience and secure the funds we needed.",
      name: "John Smith",
      role: "Non-Profit Founder",
      rating: 5,
    },
  ];
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hands2gether",
    url: "https://hands2gether.org",
    logo: "https://hands2gether.org/logo.png",
    description:
      "A community-driven platform connecting people in need with donors. Support local causes, make donations, and create meaningful impact in your community.",
    sameAs: [
      "https://facebook.com/hands2gether",
      "https://twitter.com/hands2gether",
      "https://instagram.com/hands2gether",
      "https://linkedin.com/company/hands2gether",
    ],
  };

  return (
    <div className="homepage-container">
      <SEO
        title="Empowering Communities Through Collective Action"
        description="Join Hands2gether to discover, support, or create causes that bring positive change to people's lives around the world. Make a difference in your community today."
        keywords="community help, donations, charity, fundraising, social impact, causes, community support, charitable giving, nonprofit, humanitarian aid"
        url="/"
        schemaData={organizationSchema}
      />
      {/* Hero Section - Modernized with gradient overlay */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(22, 28, 45, 0.7), rgba(22, 28, 45, 0.7)), url(${HERO_BACKGROUND_URL})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container text-center">
          <div className="hero-content">
            <Title level={1} className="hero-title">
              Empowering Communities, Together.
            </Title>
            <Paragraph className="hero-subtitle">
              Join Hands2gether to discover, support, or create causes that
              bring positive change to people's lives around the world.
            </Paragraph>
            <Space size="large" wrap className="hero-buttons">
              <Button
                type="primary"
                size="large"
                className="hero-button-primary"
              >
                <Link to="/causes">Explore Causes</Link>
              </Button>
              <Button size="large" className="hero-button-secondary">
                <Link to="/causes/create">Start a Cause</Link>
              </Button>
            </Space>
          </div>
        </div>
      </section>{" "}
      {/* Stats Section - Redesigned with cards and descriptions */}
      <section className="stats-section section-padding">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Our Impact So Far
            </Title>
            <Paragraph className="section-subtitle">
              Together we've achieved meaningful results through collective
              action
            </Paragraph>
          </div>
          <Row gutter={[32, 32]} justify="center">
            {statsData.map((stat, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card className="stat-card" bordered={false} hoverable>
                  <div className="stat-card-content">
                    <div
                      className="stat-icon-wrapper"
                      style={{ backgroundColor: stat.color }}
                    >
                      {React.cloneElement(stat.icon, {
                        style: { color: "#fff", fontSize: "24px" },
                      })}
                    </div>
                    <div className="stat-info">
                      <Statistic
                        title={
                          <Title level={5} className="stat-title">
                            {stat.title}
                          </Title>
                        }
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        valueStyle={{
                          color: "#2c3e50",
                          fontWeight: "bold",
                          fontSize: "2.2rem",
                        }}
                      />
                      <Paragraph className="stat-description">
                        {stat.description}
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>{" "}
      {/* Featured Causes Section - Enhanced with badges and call-to-action */}
      <section className="featured-causes-section section-padding background-light">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Featured Causes
            </Title>
            <Paragraph className="section-subtitle">
              These initiatives need your support right now
            </Paragraph>
            <Button type="text" className="section-viewall-button">
              <Link to="/causes">
                View All Causes <ArrowRightOutlined />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="text-center" style={{ padding: "50px 0" }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {causes && causes.length > 0 ? (
                causes.map((cause) => (
                  <Col xs={24} sm={12} md={8} key={cause.id}>
                    <CauseCard cause={cause} className="featured-cause-card" />
                    <div className="featured-cause-badges">
                      {/* Add a Most Popular or Urgent tag as appropriate */}
                      {cause.id % 2 === 0 ? (
                        <Tag color="#F06292" className="cause-tag">
                          URGENT
                        </Tag>
                      ) : (
                        <Tag color="#4A6FDC" className="cause-tag">
                          POPULAR
                        </Tag>
                      )}
                    </div>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <Card className="empty-causes-card">
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <GlobalOutlined className="empty-icon" />
                      <Title level={4}>No featured causes at the moment.</Title>
                      <Paragraph>
                        Why not be the first to{" "}
                        <Link to="/causes/create">create a new cause</Link>?
                      </Paragraph>
                      <Button type="primary">
                        <Link to="/causes/create">Start a Cause</Link>
                      </Button>
                    </div>
                  </Card>
                </Col>
              )}
            </Row>
          )}
        </div>
      </section>{" "}
      {/* How It Works Section - Improved with step numbers and connected flow */}
      <section className="how-it-works-section section-padding">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              How It Works
            </Title>
            <Paragraph className="section-subtitle">
              Making a difference is easier than you think
            </Paragraph>
          </div>
          <div className="steps-container">
            <Row gutter={[32, 32]} justify="center">
              {howItWorksSteps.map((step, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card
                    className="how-it-works-card text-center"
                    bordered={false}
                    hoverable
                  >
                    <Tag color="#4A6FDC" className="step-tag">
                      {step.tag}
                    </Tag>
                    <div className="how-it-works-icon">{step.icon}</div>
                    <Title
                      level={4}
                      style={{ marginTop: 20, marginBottom: 10 }}
                    >
                      {step.title}
                    </Title>
                    <Paragraph>{step.description}</Paragraph>
                    {index < howItWorksSteps.length - 1 && (
                      <div className="step-arrow">
                        <ArrowRightOutlined />
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          <div className="text-center" style={{ marginTop: 40 }}>
            <Button type="primary" size="large" className="get-started-button">
              <Link to="/register">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>{" "}
      {/* Impact Showcase Section - Enhanced with progress bars */}
      <section className="impact-showcase-section section-padding background-light">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Our Collective Impact
            </Title>
            <Paragraph className="section-subtitle">
              See how contributions like yours are changing lives and building
              stronger communities every day
            </Paragraph>
          </div>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={12}>
              <div className="impact-card">
                <img
                  src={IMPACT_IMAGE_1_URL}
                  alt="Impactful story 1"
                  className="impact-image"
                />
                <div className="impact-content">
                  <Title level={4}>Nourishing Families</Title>
                  <Paragraph>
                    With the funds raised, we've been able to provide over 500
                    families with essential food packages, ensuring no one in
                    our local area goes hungry.
                  </Paragraph>
                  <div className="impact-progress">
                    <span>Goal: 1,000 families</span>
                    <Progress percent={50} strokeColor="#4A6FDC" />
                    <div className="progress-stats">
                      <CheckCircleOutlined /> 500 families supported so far
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="impact-card">
                <img
                  src={IMPACT_IMAGE_2_URL}
                  alt="Impactful story 2"
                  className="impact-image"
                />
                <div className="impact-content">
                  <Title level={4}>Supporting Local Shelters</Title>
                  <Paragraph>
                    Emergency shelters received critical supplies and support,
                    helping them continue their vital work for those most in
                    need during challenging times.
                  </Paragraph>
                  <div className="impact-progress">
                    <span>Goal: $10,000 in supplies</span>
                    <Progress percent={75} strokeColor="#43A047" />
                    <div className="progress-stats">
                      <CheckCircleOutlined /> $7,500 in supplies delivered
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>{" "}
      {/* Testimonials Section - Improved with rating stars and modern design */}
      <section className="testimonials-section section-padding">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Voices from Our Community
            </Title>
            <Paragraph className="section-subtitle">
              Hear from the people who have experienced the power of collective
              action
            </Paragraph>
          </div>
          <Carousel
            autoplay
            dots={{ className: "testimonial-dots" }}
            effect="fade"
            className="testimonial-carousel"
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-slide">
                <Card className="testimonial-card" bordered={false}>
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star-icon">
                        ★
                      </span>
                    ))}
                  </div>
                  <Paragraph className="testimonial-quote">
                    <MessageOutlined
                      style={{ marginRight: 8, color: "#4A6FDC" }}
                    />
                    {testimonial.quote}
                  </Paragraph>
                  <Divider className="testimonial-divider" />
                  <Title level={5} className="testimonial-name">
                    {testimonial.name}
                  </Title>
                  <Text type="secondary" className="testimonial-role">
                    {testimonial.role}
                  </Text>
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      </section>{" "}
      {/* Call to Action Section - Enhanced with achievement badges */}
      <section className="cta-section">
        <div className="container text-center">
          <div className="cta-badges">
            <Tag icon={<CheckCircleOutlined />} color="#4A6FDC">
              Secure Donations
            </Tag>
            <Tag icon={<GlobalOutlined />} color="#43A047">
              Global Impact
            </Tag>
            <Tag icon={<ThunderboltOutlined />} color="#F9A825">
              Quick Start
            </Tag>
          </div>
          <Title level={2} className="cta-title">
            Ready to Make a Lasting Impact?
          </Title>
          <Paragraph className="cta-subtitle">
            Your support can change lives. Join our community of givers today
            and be part of something bigger.
          </Paragraph>
          <Space size="large" wrap className="cta-buttons">
            <Button type="primary" size="large" className="cta-button-primary">
              <Link to="/register">Sign Up & Get Involved</Link>
            </Button>
            <Button size="large" className="cta-button-secondary">
              <Link to="/causes">Explore Active Causes</Link>
            </Button>
          </Space>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
