import { SiteContent } from "@/types/siteContent";
export * from "@/types/siteContent";

export const defaultSiteContent: SiteContent = {
  "hero": {
    "heading": "We make brands etc",
    "headingItalic": "worth stopping",
    "subtitle": "Reels, content, social media, and creative campaigns for brands people remember. Built for restaurants, cafes, luxury hospitality, and D2C brands.",
    "mockReels": [
      {
        "poster": "/images/project_cafe.png",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-pouring-milk-into-a-cup-of-coffee-41875-large.mp4",
        "caption": "We make reels, shoot content, and build digital spaces that people remember. Delhi's social creative partner.",
        "likes": "12.8k",
        "comments": "342",
        "active": true
      },
      {
        "poster": "/images/project_restaurant.png",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42207-large.mp4",
        "caption": "Sizzling gourmet plates and cinematic restaurant showreels built to drive bookings. Delhi Diaries Official.",
        "likes": "18.5k",
        "comments": "521",
        "active": true
      },
      {
        "poster": "/images/project_lifestyle.png",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-fresh-vegetable-salad-41604-large.mp4",
        "caption": "Editorial lifestyle campaigns and minimal aesthetics for modern D2C products. Stop the scroll.",
        "likes": "9.2k",
        "comments": "198",
        "active": true
      }
    ]
  },
  "showreel": {
    "heading": "This is what we do.",
    "description": "We shoot short-form videos designed to convert casual scrollers into loyal customers. No stock templates, no boring structures.",
    "leftImages": [
      {
        "src": "/images/project_cafe.png",
        "label": "Cafe Reels",
        "active": true
      },
      {
        "src": "/images/restaurant_1.png",
        "label": "Gourmet Plating",
        "active": true
      },
      {
        "src": "/images/cafe_1.png",
        "label": "Coffee Pouring",
        "active": true
      }
    ],
    "centerVideos": [
      {
        "src": "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42207-large.mp4",
        "poster": "/images/project_restaurant.png",
        "label": "Watch 2026 Showreel",
        "active": true
      },
      {
        "src": "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-pouring-milk-into-a-cup-of-coffee-41875-large.mp4",
        "poster": "/images/cafe_2.png",
        "label": "Watch Cafe Showcase",
        "active": true
      },
      {
        "src": "https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-fresh-vegetable-salad-41604-large.mp4",
        "poster": "/images/restaurant_2.png",
        "label": "Watch Dining Story",
        "active": true
      }
    ],
    "rightImages": [
      {
        "src": "/images/project_lifestyle.png",
        "label": "Lifestyle Content",
        "active": true
      },
      {
        "src": "/images/lifestyle_1.png",
        "label": "Minimalist Ceramics",
        "active": true
      },
      {
        "src": "/images/d2c_1.png",
        "label": "Pure ASMR",
        "active": true
      }
    ]
  },
  "industries": [
    {
      "name": "Restaurants",
      "statement": "Make them hungry before they arrive.",
      "image": "/images/project_restaurant.png",
      "active": true
    },
    {
      "name": "Cafes",
      "statement": "Turn a location into a destination.",
      "image": "/images/project_cafe.png",
      "active": true
    },
    {
      "name": "Hospitality",
      "statement": "Design a journey worth sharing.",
      "image": "/images/project_restaurant.png",
      "active": true
    },
    {
      "name": "Fashion & Lifestyle",
      "statement": "Give your brand a visual language.",
      "image": "/images/project_lifestyle.png",
      "active": true
    },
    {
      "name": "Beauty",
      "statement": "Aesthetics that feel pure and luxury.",
      "image": "/images/project_d2c.png",
      "active": true
    },
    {
      "name": "D2C Brands",
      "statement": "Stop scrolling, start buying.",
      "image": "/images/project_d2c.png",
      "active": true
    },
    {
      "name": "Events",
      "statement": "Moments captured, memories branded.",
      "image": "/images/project_cafe.png",
      "active": true
    },
    {
      "name": "Local Businesses",
      "statement": "Bring local value to the digital map.",
      "image": "/images/project_lifestyle.png",
      "active": true
    }
  ],
  "testimonials": [
    {
      "quote": "Delhi Diaries Official didn't just give us reels. They gave our restaurant a soul online. Our table reservations booked out 2 weeks in advance within 60 days of partnering.",
      "author": "Aditya Malhotra",
      "company": "Dastan Dining",
      "industry": "Hospitality Group",
      "active": true
    },
    {
      "quote": "They understand Instagram better than any traditional marketing agency. They show up, shoot high-end assets, and publish content that actually goes viral.",
      "author": "Rhea Sen",
      "company": "Roast & Co.",
      "industry": "Cafe Founder",
      "active": true
    }
  ],
  "instagramFeed": [
    {
      "type": "Reel",
      "client": "Dastan",
      "campaign": "Modern Indian Feast",
      "image": "/images/restaurant_1.png",
      "active": true
    },
    {
      "type": "Photo",
      "client": "Roast & Co.",
      "campaign": "Golden Pastries",
      "image": "/images/cafe_1.png",
      "active": true
    },
    {
      "type": "Campaign",
      "client": "Mitti",
      "campaign": "Daylight Shadow",
      "image": "/images/lifestyle_1.png",
      "active": true
    },
    {
      "type": "BTS",
      "client": "Delhi Diaries Official Studio",
      "campaign": "Behind the Lens",
      "image": "/images/project_restaurant.png",
      "active": true
    },
    {
      "type": "Food Content",
      "client": "Dastan",
      "campaign": "Gourmet Plating",
      "image": "/images/restaurant_2.png",
      "active": true
    },
    {
      "type": "Lifestyle",
      "client": "Mitti",
      "campaign": "Morning Ceramic Setup",
      "image": "/images/lifestyle_2.png",
      "active": true
    },
    {
      "type": "Reel",
      "client": "Soma Skincare",
      "campaign": "ASMR Hydration",
      "image": "/images/d2c_1.png",
      "active": true
    },
    {
      "type": "Photo",
      "client": "Roast & Co.",
      "campaign": "Aroma Pour",
      "image": "/images/cafe_2.png",
      "active": true
    },
    {
      "type": "Campaign",
      "client": "Soma Skincare",
      "campaign": "Pure Serum Droplet",
      "image": "/images/d2c_2.png",
      "active": true
    }
  ]
};
