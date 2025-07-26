'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, Row, Col, Typography, Button, Steps } from 'antd';
import { 
  SearchOutlined,
  HeartOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserAddOutlined,
  FormOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const { Title, Paragraph } = Typography;
const { Step } = Steps;

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const processSteps = [
  {
    icon: <UserAddOutlined className="text-3xl" />,
    title: "Join Community",
    description: "Sign up and become part of our caring community",
    details: [
      "Quick registration process",
      "Verify your identity safely",
      "Set up your profile",
      "Choose your interests"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <SearchOutlined className="text-3xl" />,
    title: "Discover Causes",
    description: "Browse and find causes that match your passion",
    details: [
      "Advanced filtering options",
      "Location-based search",
      "Category preferences",
      "Real-time updates"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <HeartOutlined className="text-3xl" />,
    title: "Take Action",
    description: "Contribute your time, skills, or resources",
    details: [
      "Multiple ways to help",
      "Flexible commitment options",
      "Skill-based volunteering",
      "Material donations"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <TrophyOutlined className="text-3xl" />,
    title: "See Impact",
    description: "Track your contributions and celebrate success",
    details: [
      "Real-time progress tracking",
      "Impact measurement",
      "Community recognition",
      "Success stories"
    ],
    color: "from-orange-500 to-red-500"
  }
];

const giveHelp = [
  {
    icon: <FormOutlined />,
    title: "Create a Cause",
    description: "Post your assistance request with detailed information",
    action: "Start Creating"
  },
  {
    icon: <TeamOutlined />,
    title: "Connect with Helpers",
    description: "Get matched with people who can provide what you need",
    action: "Find Helpers"
  },
  {
    icon: <CheckCircleOutlined />,
    title: "Receive Support",
    description: "Get the help you need and pay it forward when you can",
    action: "Get Started"
  }
];

export function HowItWorks() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-200 to-transparent" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-purple-200 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-pink-200 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <Title level={2} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              How Hands2gether Works
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
              Making community support simple, effective, and meaningful through our four-step process
            </Paragraph>
          </motion.div>
        </motion.div>

        {/* Main Process Steps */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mb-20"
        >
          <Row gutter={[32, 48]} className="max-w-7xl mx-auto">
            {processSteps.map((step, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div variants={fadeInUp} className="text-center h-full">
                  <Card 
                    className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white/80 backdrop-blur-sm group overflow-hidden relative"
                    bodyStyle={{ padding: '2rem' }}
                  >
                    {/* Step number */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-6 shadow-lg`}
                    >
                      {step.icon}
                    </motion.div>

                    {/* Content */}
                    <Title level={4} className="mb-3 text-gray-800">
                      {step.title}
                    </Title>

                    <Paragraph className="text-gray-600 mb-6">
                      {step.description}
                    </Paragraph>

                    {/* Details */}
                    <div className="space-y-2 mb-6">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center space-x-2 text-sm text-gray-500">
                          <CheckCircleOutlined className="text-green-500 flex-shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* Connector line */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-gray-300 to-transparent transform -translate-y-1/2" />
                    )}

                    {/* Hover effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Two Paths Section */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Title level={3} className="mb-4">
              Two Ways to Make a Difference
            </Title>
            <Paragraph className="text-gray-600 max-w-2xl mx-auto">
              Whether you're looking to help others or need assistance yourself, we've made it simple
            </Paragraph>
          </motion.div>

          <Row gutter={[48, 32]} className="max-w-6xl mx-auto">
            {/* Give Help */}
            <Col xs={24} lg={12}>
              <motion.div variants={fadeInUp}>
                <Card 
                  className="h-full bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300"
                  bodyStyle={{ padding: '2.5rem' }}
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-4xl mb-4 shadow-lg">
                      <HeartOutlined />
                    </div>
                    <Title level={3} className="text-blue-800 mb-4">
                      Give Help
                    </Title>
                    <Paragraph className="text-blue-600">
                      Share your resources, skills, or time to support others in your community
                    </Paragraph>
                  </div>

                  <Steps direction="vertical" size="small" className="mb-8">
                    <Step 
                      status="finish" 
                      title="Browse Active Causes" 
                      description="Find causes that match your interests and location"
                      icon={<SearchOutlined />}
                    />
                    <Step 
                      status="finish" 
                      title="Choose How to Help" 
                      description="Offer resources, volunteer time, or share skills"
                      icon={<HeartOutlined />}
                    />
                    <Step 
                      status="finish" 
                      title="Make an Impact" 
                      description="Connect directly with those in need"
                      icon={<TrophyOutlined />}
                    />
                  </Steps>

                  <Link href="/causes">
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<ArrowRightOutlined />}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 border-none hover:shadow-lg"
                    >
                      Start Helping
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </Col>

            {/* Get Help */}
            <Col xs={24} lg={12}>
              <motion.div variants={fadeInUp}>
                <Card 
                  className="h-full bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300"
                  bodyStyle={{ padding: '2.5rem' }}
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl mb-4 shadow-lg">
                      <TeamOutlined />
                    </div>
                    <Title level={3} className="text-purple-800 mb-4">
                      Get Help
                    </Title>
                    <Paragraph className="text-purple-600">
                      Request assistance from your community when you need support
                    </Paragraph>
                  </div>

                  <Steps direction="vertical" size="small" className="mb-8">
                    <Step 
                      status="finish" 
                      title="Create Your Cause" 
                      description="Describe what help you need with details"
                      icon={<FormOutlined />}
                    />
                    <Step 
                      status="finish" 
                      title="Get Matched" 
                      description="Connect with community members who can help"
                      icon={<TeamOutlined />}
                    />
                    <Step 
                      status="finish" 
                      title="Receive Support" 
                      description="Get the assistance you need"
                      icon={<CheckCircleOutlined />}
                    />
                  </Steps>

                  <Link href="/causes/create">
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<ArrowRightOutlined />}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:shadow-lg"
                    >
                      Request Help
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-0 max-w-4xl mx-auto">
            <div className="text-white p-8">
              <Title level={3} className="text-white mb-4">
                Ready to Join Our Community?
              </Title>
              <Paragraph className="text-indigo-100 mb-6 text-lg">
                Start making a difference today - whether giving help or receiving support
              </Paragraph>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/register">
                  <Button
                    size="large"
                    className="bg-white text-purple-600 border-0 hover:bg-purple-50 font-semibold h-12 px-8"
                  >
                    Join Community
                  </Button>
                </Link>
                <Link href="/causes">
                  <Button
                    size="large"
                    className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold h-12 px-8 transition-all duration-300"
                  >
                    Explore Causes
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}