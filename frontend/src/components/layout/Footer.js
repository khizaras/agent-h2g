import React from "react";
import { Layout, Row, Col, Typography, Space, Divider, Button } from "antd";
import { Link } from "react-router-dom";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  HeartOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  GlobalOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter
      style={{
        background: "linear-gradient(to right, #001529, #002140)",
        color: "#fff",
        padding: "60px 0 20px",
        marginTop: 40,
      }}
    >
      <div className="container" style={{ padding: "0 24px" }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <div style={{ marginBottom: 24 }}>
              <Space align="center">
                <HeartOutlined style={{ fontSize: 28, color: "#ff4d4f" }} />
                <Title level={3} style={{ color: "#fff", margin: 0 }}>
                  Hands2gether
                </Title>
              </Space>
            </div>

            <Paragraph style={{ color: "#ccc", marginBottom: 24 }}>
              A community-driven platform connecting people in need with those
              who can help. Together, we can make a difference in the fight
              against hunger and food insecurity.
            </Paragraph>

            <Space size="large">
              <a href="#" style={{ color: "#fff", fontSize: 20 }}>
                <FacebookOutlined />
              </a>
              <a href="#" style={{ color: "#fff", fontSize: 20 }}>
                <TwitterOutlined />
              </a>
              <a href="#" style={{ color: "#fff", fontSize: 20 }}>
                <InstagramOutlined />
              </a>
              <a href="#" style={{ color: "#fff", fontSize: 20 }}>
                <LinkedinOutlined />
              </a>
            </Space>
          </Col>

          <Col xs={12} sm={12} md={8} lg={7}>
            <Title level={4} style={{ color: "#fff", marginBottom: 20 }}>
              Quick Links
            </Title>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: 12 }}>
                <Link to="/" style={{ color: "#ccc" }}>
                  <Space>
                    <HomeOutlined style={{ fontSize: 14 }} />
                    <span>Home</span>
                  </Space>
                </Link>
              </li>
              <li style={{ marginBottom: 12 }}>
                <Link to="/causes" style={{ color: "#ccc" }}>
                  <Space>
                    <HeartOutlined style={{ fontSize: 14 }} />
                    <span>Browse Causes</span>
                  </Space>
                </Link>
              </li>
              <li style={{ marginBottom: 12 }}>
                <Link to="/causes/create" style={{ color: "#ccc" }}>
                  <Space>
                    <SendOutlined style={{ fontSize: 14 }} />
                    <span>Create Cause</span>
                  </Space>
                </Link>
              </li>
              <li style={{ marginBottom: 12 }}>
                <Link to="/about" style={{ color: "#ccc" }}>
                  <Space>
                    <GlobalOutlined style={{ fontSize: 14 }} />
                    <span>About Us</span>
                  </Space>
                </Link>
              </li>
              <li style={{ marginBottom: 12 }}>
                <Link to="/profile" style={{ color: "#ccc" }}>
                  <Space>
                    <UserOutlined style={{ fontSize: 14 }} />
                    <span>My Account</span>
                  </Space>
                </Link>
              </li>
            </ul>
          </Col>

          <Col xs={12} sm={12} md={8} lg={9}>
            <Title level={4} style={{ color: "#fff", marginBottom: 20 }}>
              Contact Us
            </Title>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: 14 }}>
                <Space>
                  <PhoneOutlined style={{ color: "#4CAF50" }} />
                  <Text style={{ color: "#ccc" }}>+1 (123) 456-7890</Text>
                </Space>
              </li>
              <li style={{ marginBottom: 14 }}>
                <Space>
                  <MailOutlined style={{ color: "#4CAF50" }} />
                  <Text style={{ color: "#ccc" }}>info@hands2gether.org</Text>
                </Space>
              </li>
              <li style={{ marginBottom: 20 }}>
                <Space>
                  <HeartOutlined style={{ color: "#4CAF50" }} />
                  <Text style={{ color: "#ccc" }}>Donate to our mission</Text>
                </Space>
              </li>
            </ul>

            <div style={{ marginTop: 20 }}>
              <Button type="primary" size="large" style={{ borderRadius: 4 }}>
                Contact Us
              </Button>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: "#333", margin: "40px 0 20px" }} />

        <Row>
          <Col xs={24} sm={12}>
            <Text style={{ color: "#aaa", fontSize: "14px" }}>
              &copy; {currentYear} Hands2gether. All rights reserved.
            </Text>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: "right" }}>
            <Space
              split={
                <Divider type="vertical" style={{ borderColor: "#333" }} />
              }
            >
              <Link to="/privacy" style={{ color: "#aaa", fontSize: "14px" }}>
                Privacy Policy
              </Link>
              <Link to="/terms" style={{ color: "#aaa", fontSize: "14px" }}>
                Terms of Service
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;
