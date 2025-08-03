'use client';

import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import RevampedHeader from './Header';
import { Footer } from './Footer';
import { useAppDispatch, useAppSelector } from '@/store';
import { setViewportDimensions, selectViewport } from '@/store/slices/uiSlice';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

export function MainLayout({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className = '' 
}: MainLayoutProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const viewport = useAppSelector(selectViewport);

  // Handle viewport changes
  useEffect(() => {
    const handleResize = () => {
      dispatch(setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      }));
    };

    // Set initial dimensions
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Determine if we should show minimal layout (auth pages, etc.)
  const isAuthPage = pathname.startsWith('/auth/');
  const isAdminPage = pathname.startsWith('/admin/');
  const isFullPageApp = pathname.startsWith('/app/');

  // Override layout settings for special pages
  const shouldShowHeader = showHeader && !isFullPageApp;
  const shouldShowFooter = showFooter && !isAuthPage && !isAdminPage && !isFullPageApp;

  // Calculate content padding based on header (60px for Microsoft header)
  const contentStyle = {
    minHeight: shouldShowHeader ? 'calc(100vh - 60px)' : '100vh',
    paddingTop: shouldShowHeader ? '0' : '0',
  };

  return (
    <Layout className={className} style={{ minHeight: '100vh' }}>
      {/* Header */}
      <AnimatePresence mode="wait">
        {shouldShowHeader && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <RevampedHeader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <Content style={contentStyle} className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ width: '100%' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Scroll Progress Indicator */}
        <motion.div
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, var(--color-primary), #722ed1)',
            transformOrigin: 'left',
            zIndex: 50,
            scaleX: 0
          }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false, amount: 0 }}
          transition={{ duration: 0.3 }}
        />
      </Content>

      {/* Footer */}
      <AnimatePresence mode="wait">
        {shouldShowFooter && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.1 }}
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles and Effects */}
      <style jsx global>{`
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
          transition: background 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }

        /* Loading states */
        .loading-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* Focus styles for accessibility */
        .focus-visible:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .gradient-text {
            background: none !important;
            -webkit-background-clip: initial !important;
            -webkit-text-fill-color: initial !important;
            color: #000 !important;
          }

          .glass {
            background: rgba(255, 255, 255, 0.95) !important;
            border: 2px solid #000 !important;
          }
        }

        /* Mobile viewport adjustments */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }

        /* Print styles */
        @media print {
          .no-print,
          .ant-affix,
          header,
          footer,
          .fab,
          .floating-action {
            display: none !important;
          }

          body {
            background: white !important;
            color: black !important;
          }

          .glass,
          .gradient-bg {
            background: white !important;
            border: 1px solid #ccc !important;
          }
        }

        /* Custom ant design overrides */
        .ant-layout {
          background: transparent;
        }

        .ant-menu-horizontal {
          border-bottom: none;
        }

        .ant-menu-item:hover {
          color: #3b82f6 !important;
        }

        .ant-menu-item-selected {
          color: #3b82f6 !important;
        }

        .ant-menu-item-selected::after {
          border-bottom-color: #3b82f6 !important;
        }

        /* Newsletter search styling */
        .newsletter-search .ant-input {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }

        .newsletter-search .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        .newsletter-search .ant-input-search-button {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
          border: none !important;
        }

        /* Search drawer styling */
        .search-drawer .ant-drawer-body {
          padding: 2rem !important;
        }

        /* Mobile menu styling */
        .mobile-menu .ant-drawer-header {
          border-bottom: 1px solid #f0f0f0;
        }

        /* Animation delays */
        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Utility classes */
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .backdrop-blur {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .gradient-border {
          border: 2px solid transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, #3b82f6, #8b5cf6) border-box;
        }
      `}</style>
    </Layout>
  );
}