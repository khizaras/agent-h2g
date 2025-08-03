"use client";

import React, { useState } from "react";
import { Button, Dropdown, message, Modal } from "antd";
import {
  FiShare2,
  FiCopy,
  FiMessageCircle,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiMail,
} from "react-icons/fi";
import type { MenuProps } from "antd";

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  image?: string;
  hashtags?: string[];
}

export default function SocialShare({
  url,
  title,
  description,
  image,
  hashtags = ["Hands2gether", "Charity", "Community"],
}: SocialShareProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = image ? encodeURIComponent(image) : "";
  const hashtagString = hashtags
    .map((tag) => `#${tag.replace(/\s+/g, "")}`)
    .join(" ");
  const encodedHashtags = encodeURIComponent(hashtagString);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%0A%0A${encodedDescription}%0A%0A${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodeURIComponent(hashtags.join(","))}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}%0A%0A${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      message.success("Link copied to clipboard!");
    } catch (error) {
      message.error("Failed to copy link");
    }
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(
      shareUrl,
      "_blank",
      "width=600,height=400,scrollbars=yes,resizable=yes",
    );
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "whatsapp",
      icon: <FiMessageCircle className="text-green-500" />,
      label: "WhatsApp",
      onClick: () => openShareWindow(shareLinks.whatsapp),
    },
    {
      key: "facebook",
      icon: <FiFacebook className="text-blue-600" />,
      label: "Facebook",
      onClick: () => openShareWindow(shareLinks.facebook),
    },
    {
      key: "twitter",
      icon: <FiTwitter className="text-blue-400" />,
      label: "Twitter",
      onClick: () => openShareWindow(shareLinks.twitter),
    },
    {
      key: "linkedin",
      icon: <FiLinkedin className="text-blue-700" />,
      label: "LinkedIn",
      onClick: () => openShareWindow(shareLinks.linkedin),
    },
    {
      key: "telegram",
      icon: <FiMessageCircle className="text-blue-500" />,
      label: "Telegram",
      onClick: () => openShareWindow(shareLinks.telegram),
    },
    {
      type: "divider",
    },
    {
      key: "email",
      icon: <FiMail className="text-gray-600" />,
      label: "Email",
      onClick: () => (window.location.href = shareLinks.email),
    },
    {
      key: "copy",
      icon: <FiCopy className="text-gray-600" />,
      label: "Copy Link",
      onClick: copyToClipboard,
    },
    {
      key: "more",
      label: "More Options",
      onClick: () => setIsModalVisible(true),
    },
  ];

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.log("Native sharing failed:", error);
      }
    }
  };

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <Button
          icon={<FiShare2 />}
          type="default"
          onClick={(e) => {
            // Try native sharing first on mobile
            if (
              navigator.share &&
              /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent,
              )
            ) {
              e.preventDefault();
              nativeShare();
            }
          }}
        >
          Share
        </Button>
      </Dropdown>

      <Modal
        title="Share this cause"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">{title}</h4>
            <p className="text-gray-600 text-sm mb-3">{description}</p>
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <span className="text-xs text-gray-500 truncate mr-2">{url}</span>
              <Button size="small" onClick={copyToClipboard}>
                <FiCopy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              block
              onClick={() => openShareWindow(shareLinks.whatsapp)}
              className="flex items-center justify-center gap-2 h-12"
            >
              <FiMessageCircle className="text-green-500" />
              WhatsApp
            </Button>

            <Button
              block
              onClick={() => openShareWindow(shareLinks.facebook)}
              className="flex items-center justify-center gap-2 h-12"
            >
              <FiFacebook className="text-blue-600" />
              Facebook
            </Button>

            <Button
              block
              onClick={() => openShareWindow(shareLinks.twitter)}
              className="flex items-center justify-center gap-2 h-12"
            >
              <FiTwitter className="text-blue-400" />
              Twitter
            </Button>

            <Button
              block
              onClick={() => openShareWindow(shareLinks.linkedin)}
              className="flex items-center justify-center gap-2 h-12"
            >
              <FiLinkedin className="text-blue-700" />
              LinkedIn
            </Button>

            <Button
              block
              onClick={() => openShareWindow(shareLinks.telegram)}
              className="flex items-center justify-center gap-2 h-12"
            >
              <FiMessageCircle className="text-blue-500" />
              Telegram
            </Button>

            <Button
              block
              onClick={() => (window.location.href = shareLinks.email)}
              className="flex items-center justify-center gap-2 h-12"
            >
              <FiMail className="text-gray-600" />
              Email
            </Button>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500 mb-2">Share with hashtags:</p>
            <div className="flex flex-wrap gap-1">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `#${tag.replace(/\s+/g, "")}`,
                    );
                    message.success(`#${tag} copied!`);
                  }}
                >
                  #{tag.replace(/\s+/g, "")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
