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
} from "antd";
import {
  HeartOutlined,
  TeamOutlined,
  RiseOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { getCauses, reset } from "../../redux/slices/causesSlice";
import CauseCard from "../../components/causes/CauseCard";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const dispatch = useDispatch();
  const { causes, isLoading } = useSelector((state) => state.causes);

  useEffect(() => {
    // Fetch featured/recent causes
    dispatch(getCauses({ limit: 6 }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          background:
            'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/hero-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 0",
          textAlign: "center",
          color: "#fff",
          marginBottom: 60,
        }}
      >
        <div className="container">
          <Title level={1} style={{ color: "#fff", marginBottom: 16 }}>
            Together We Can Make a Difference
          </Title>
          <Paragraph
            style={{ fontSize: 18, maxWidth: 800, margin: "0 auto 32px" }}
          >
            Hands2gether connects people who want to help with those in need of
            food assistance. Join our community and start making an impact
            today.
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large">
              <Link to="/causes">Explore Causes</Link>
            </Button>
            <Button size="large">
              <Link to="/causes/create">Create a Cause</Link>
            </Button>
          </Space>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" style={{ marginBottom: 60 }}>
        <div className="container">
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="People Helped"
                  value={1200}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Active Causes"
                  value={45}
                  prefix={<HeartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Contributions"
                  value={5800}
                  prefix={<RiseOutlined />}
                  suffix="$"
                />
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Featured Causes Section */}
      <section className="featured-causes" style={{ marginBottom: 60 }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <Title level={2}>Featured Causes</Title>
            <Button type="link">
              <Link to="/causes">
                View All <ArrowRightOutlined />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center" style={{ padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {causes && causes.length > 0 ? (
                causes.map((cause) => (
                  <Col xs={24} sm={12} md={8} key={cause.id}>
                    <CauseCard cause={cause} />
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Title level={4}>No causes found</Title>
                    <Paragraph>
                      Be the first to{" "}
                      <Link to="/causes/create">create a cause</Link>!
                    </Paragraph>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className="how-it-works"
        style={{
          background: "#f9f9f9",
          padding: "60px 0",
          marginBottom: 60,
        }}
      >
        <div className="container">
          <Title level={2} className="text-center" style={{ marginBottom: 40 }}>
            How It Works
          </Title>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={8}>
              <Card
                style={{ height: "100%", textAlign: "center" }}
                cover={
                  <div style={{ padding: 20 }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "#4CAF50",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        fontWeight: "bold",
                        margin: "0 auto",
                      }}
                    >
                      1
                    </div>
                  </div>
                }
              >
                <Title level={4}>Create a Cause</Title>
                <Paragraph>
                  Register an account and create a cause to help those in need.
                  Add details, images, and set funding or food goals.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                style={{ height: "100%", textAlign: "center" }}
                cover={
                  <div style={{ padding: 20 }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "#4CAF50",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        fontWeight: "bold",
                        margin: "0 auto",
                      }}
                    >
                      2
                    </div>
                  </div>
                }
              >
                <Title level={4}>Share Your Cause</Title>
                <Paragraph>
                  Share your cause with friends, family, and the community. The
                  more people who know, the more help you can receive.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                style={{ height: "100%", textAlign: "center" }}
                cover={
                  <div style={{ padding: 20 }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "#4CAF50",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        fontWeight: "bold",
                        margin: "0 auto",
                      }}
                    >
                      3
                    </div>
                  </div>
                }
              >
                <Title level={4}>Make an Impact</Title>
                <Paragraph>
                  Receive contributions and help people in need. Track your
                  progress and thank your contributors.
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <div className="text-center" style={{ marginTop: 40 }}>
            <Button type="primary" size="large">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" style={{ marginBottom: 60 }}>
        <div className="container">
          <Title level={2} className="text-center" style={{ marginBottom: 40 }}>
            What People Say
          </Title>

          <Carousel autoplay>
            <div>
              <Card style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
                <Paragraph style={{ fontSize: 18, fontStyle: "italic" }}>
                  "Hands2gether helped me connect with people who really needed
                  food assistance in my community. I was able to make a direct
                  impact and see the results of my contributions."
                </Paragraph>
                <Divider />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ marginRight: 16 }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TeamOutlined style={{ fontSize: 24 }} />
                    </div>
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      Sarah Johnson
                    </Title>
                    <Paragraph style={{ margin: 0 }}>
                      Volunteer, New York
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <Card style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
                <Paragraph style={{ fontSize: 18, fontStyle: "italic" }}>
                  "When our food bank was running low on supplies, I created a
                  cause on Hands2gether. Within days, we received enough
                  donations to help over 100 families."
                </Paragraph>
                <Divider />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ marginRight: 16 }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TeamOutlined style={{ fontSize: 24 }} />
                    </div>
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      Robert Chen
                    </Title>
                    <Paragraph style={{ margin: 0 }}>
                      Food Bank Manager, Chicago
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </div>
          </Carousel>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="cta"
        style={{
          background: "#4CAF50",
          padding: "60px 0",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div className="container">
          <Title level={2} style={{ color: "#fff", marginBottom: 16 }}>
            Ready to Make a Difference?
          </Title>
          <Paragraph style={{ fontSize: 18, marginBottom: 32 }}>
            Join our community today and start helping those in need.
          </Paragraph>
          <Space size="large">
            <Button
              size="large"
              style={{ background: "#fff", color: "#4CAF50" }}
            >
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button ghost size="large">
              <Link to="/causes">Browse Causes</Link>
            </Button>
          </Space>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
