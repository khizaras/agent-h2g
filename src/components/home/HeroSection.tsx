import React from "react";
import { Typography, Button } from "antd";
import { motion } from "framer-motion";
import { unsplashImages } from "@/services/unsplashService";
import "@/styles/components.css";

const stats = [
  { label: "Meals Shared", value: "12,500+" },
  { label: "Active Causes", value: "87" },
  { label: "Contributors", value: "2,300+" },
];

export default function HeroSection() {
  const heroImages = unsplashImages.heroes;
  const [bgIndex, setBgIndex] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((i) => (i + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section
      className="modern-hero"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <img
        src={heroImages[bgIndex].url}
        alt={heroImages[bgIndex].alt}
        className="modern-hero-bg"
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      <div
        className="modern-hero-overlay"
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
          zIndex: 1,
        }}
      />
      <div className="modern-hero-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: "center",
            color: "#fff",
            maxWidth: 700,
          }}
        >
          <Typography.Title
            level={1}
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "3rem",
              marginBottom: 16,
            }}
          >
            Hands2gether: Share Food, Spread Hope
          </Typography.Title>
          <Typography.Paragraph
            style={{
              color: "#fff",
              fontSize: "1.25rem",
              marginBottom: 32,
            }}
          >
            Join a community-driven platform connecting people in need with
            contributors. Create causes, share meals, and make an impact together.
          </Typography.Paragraph>
          <Button
            type="primary"
            size="large"
            style={{ marginBottom: 32 }}
          >
            Get Started
          </Button>
          <div className="modern-trust-row">
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{ textAlign: "center", minWidth: 120 }}
              >
                <Typography.Title
                  level={3}
                  style={{ color: "#fff", marginBottom: 0 }}
                >
                  {stat.value}
                </Typography.Title>
                <Typography.Text
                  style={{ color: "#fff", fontSize: "1rem" }}
                >
                  {stat.label}
                </Typography.Text>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

