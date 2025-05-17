import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
  Avatar, // Added for testimonials
} from "antd";
import {
  HeartFilled, // Changed from HeartOutlined for more impact
  TeamOutlined,
  RiseOutlined,
  ArrowRightOutlined,
  GiftOutlined, // New: for How it Works & Impact
  ShareAltOutlined, // New: for How it Works
  EditOutlined, // New: for How it Works
  GlobalOutlined, // New: for general use, e.g. community
  MessageOutlined, // New: for testimonials
} from "@ant-design/icons";
import { getCauses, reset } from "../../redux/slices/causesSlice";
import CauseCard from "../../components/causes/CauseCard";
import "./HomePage.css"; // Import a dedicated CSS file for HomePage styles

const { Title, Paragraph, Text } = Typography;

// Placeholder images - replace with your actual high-quality images
const HERO_BACKGROUND_URL =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"; // Example: hands holding a plant
const IMPACT_IMAGE_1_URL =
  "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"; // Example: person receiving food
const IMPACT_IMAGE_2_URL =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"; // Example: community event

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
      color: "#3498db",
    }, // Using a vibrant blue
    {
      title: "Active Causes",
      value: 45,
      icon: <HeartFilled />,
      color: "#e74c3c",
    }, // Slightly adjusted red
    {
      title: "Funds Raised",
      value: 5800,
      icon: <RiseOutlined />,
      prefix: "$",
      color: "#2ecc71",
    }, // Using a fresh green
  ];

  const howItWorksSteps = [
    {
      icon: <EditOutlined style={{ fontSize: 48, color: "#1890ff" }} />,
      title: "Create or Find a Cause",
      description:
        "Easily start your own fundraising campaign or discover existing causes that resonate with you.",
    },
    {
      icon: <ShareAltOutlined style={{ fontSize: 48, color: "#52c41a" }} />,
      title: "Share & Spread Awareness",
      description:
        "Amplify your impact by sharing causes with your network through social media and email.",
    },
    {
      icon: <GiftOutlined style={{ fontSize: 48, color: "#faad14" }} />,
      title: "Contribute & Make a Difference",
      description:
        "Securely donate to causes you care about and see the tangible results of your generosity.",
    },
  ];

  const testimonials = [
    {
      avatar: (
        <Avatar
          size={64}
          icon={<TeamOutlined />}
          style={{ backgroundColor: "#87d068" }}
        />
      ),
      quote:
        "Hands2gether provided an incredible platform to support local families. Seeing the direct impact of our collective effort was truly heartwarming.",
      name: "Jane Doe",
      role: "Community Volunteer",
    },
    {
      avatar: (
        <Avatar
          size={64}
          icon={<TeamOutlined />}
          style={{ backgroundColor: "#1890ff" }}
        />
      ),
      quote:
        "As a small organization, fundraising was always a challenge. Hands2gether made it simple to reach a wider audience and secure the funds we needed.",
      name: "John Smith",
      role: "Non-Profit Founder",
    },
  ];

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${HERO_BACKGROUND_URL})`,
        }}
      >
        <div className="container text-center">
          <Title level={1} className="hero-title">
            Empowering Communities, Together.
          </Title>
          <Paragraph className="hero-subtitle">
            Join Hands2gether to discover, support, or create causes that bring
            positive change to people's lives.
          </Paragraph>
          <Space size="large" wrap>
            <Button type="primary" size="large" className="hero-button-primary">
              <Link to="/causes">Explore Causes</Link>
            </Button>
            <Button size="large" className="hero-button-secondary">
              <Link to="/causes/create">Start a Cause</Link>
            </Button>
          </Space>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section section-padding">
        <div className="container">
          <Row gutter={[32, 32]} justify="center">
            {statsData.map((stat, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card className="stat-card" bordered={false}>
                  <Statistic
                    title={
                      <Title level={5} className="stat-title">
                        {stat.title}
                      </Title>
                    }
                    value={stat.value}
                    prefix={
                      <span
                        className="stat-icon-wrapper"
                        style={{ backgroundColor: stat.color }}
                      >
                        {React.cloneElement(stat.icon, {
                          style: { color: "#fff", fontSize: "24px" },
                        })}
                      </span>
                    }
                    suffix={stat.suffix}
                    valueStyle={{
                      color: "#2c3e50",
                      fontWeight: "bold",
                      fontSize: "2.2rem",
                    }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Featured Causes Section */}
      <section className="featured-causes-section section-padding background-light">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Featured Causes
            </Title>
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
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Title level={4}>No featured causes at the moment.</Title>
                    <Paragraph>
                      Why not be the first to{" "}
                      <Link to="/causes/create">create a new cause</Link>?
                    </Paragraph>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section section-padding">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Making a Difference is Easy
            </Title>
          </div>
          <Row gutter={[32, 32]} justify="center">
            {howItWorksSteps.map((step, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  className="how-it-works-card text-center"
                  bordered={false}
                >
                  <div className="how-it-works-icon">{step.icon}</div>
                  <Title level={4} style={{ marginTop: 20, marginBottom: 10 }}>
                    {step.title}
                  </Title>
                  <Paragraph>{step.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center" style={{ marginTop: 40 }}>
            <Button type="primary" size="large">
              <Link to="/register">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Showcase Section */}
      <section className="impact-showcase-section section-padding background-light">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Our Collective Impact
            </Title>
            <Paragraph className="section-subtitle">
              See how contributions like yours are changing lives and building
              stronger communities.
            </Paragraph>
          </div>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={12}>
              <img
                src={IMPACT_IMAGE_1_URL}
                alt="Impactful story 1"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              />
              <Title level={4}>Nourishing Families</Title>
              <Paragraph>
                With the funds raised, we've been able to provide over 500
                families with essential food packages, ensuring no one in our
                local area goes hungry.
              </Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <img
                src={IMPACT_IMAGE_2_URL}
                alt="Impactful story 2"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              />
              <Title level={4}>Supporting Local Shelters</Title>
              <Paragraph>
                Emergency shelters received critical supplies and support,
                helping them continue their vital work for those most in need
                during challenging times.
              </Paragraph>
            </Col>
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section section-padding">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Voices from Our Community
            </Title>
          </div>
          <Carousel autoplay dots={{ className: "testimonial-dots" }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-slide">
                <Card className="testimonial-card" bordered={false}>
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <Paragraph className="testimonial-quote">
                    <MessageOutlined
                      style={{ marginRight: 8, color: "#1890ff" }}
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
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container text-center">
          <Title level={2} className="cta-title">
            Ready to Make a Lasting Impact?
          </Title>
          <Paragraph className="cta-subtitle">
            Your support can change lives. Join our community of givers today.
          </Paragraph>
          <Space size="large" wrap>
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
