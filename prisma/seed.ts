import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("luomus123", 12);

  const maya = await prisma.user.upsert({
    where: { username: "maya-chen" },
    update: { email: "maya@luomus.com", passwordHash },
    create: {
      email: "maya@luomus.com",
      passwordHash,
      username: "maya-chen",
      displayName: "Maya Chen",
      bio: "Multi-craft maker — beading, embroidery, and watercolor. Portland, OR.",
      avatar: "MC",
      coverImage:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=400&fit=crop",
      location: "Portland, OR",
      specialties: JSON.stringify(["Beading", "Embroidery", "Watercolor"]),
    },
  });

  const elena = await prisma.user.upsert({
    where: { username: "elena-rossi" },
    update: { email: "elena@luomus.com", passwordHash },
    create: {
      email: "elena@luomus.com",
      passwordHash,
      username: "elena-rossi",
      displayName: "Elena Rossi",
      bio: "Knitter, ceramicist, and candle maker. Florence, Italy.",
      avatar: "ER",
      coverImage:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=400&fit=crop",
      location: "Florence, Italy",
      specialties: JSON.stringify(["Knitting", "Pottery", "Candles"]),
    },
  });

  await prisma.follow.upsert({
    where: {
      followerId_followingId: { followerId: elena.id, followingId: maya.id },
    },
    update: {},
    create: { followerId: elena.id, followingId: maya.id },
  });

  const posts = [
    {
      title: "Best thread for peyote cuffs that won't fray?",
      content:
        "I've been using Nymo B but my cuffs always seem to fray at the edges after a few wears. What do you all recommend for durability?",
      category: "help",
      tags: JSON.stringify(["peyote", "thread", "durability"]),
      authorId: maya.id,
      likes: 45,
    },
    {
      title: "Just finished my first herringbone necklace! 🎉",
      content:
        "Took me three weeks but I'm so proud. The ocean wave pattern from Beaders was my guide. Any tips for attaching a clasp cleanly?",
      category: "showcase",
      tags: JSON.stringify(["showcase", "herringbone", "necklace"]),
      authorId: elena.id,
      likes: 156,
    },
    {
      title: "Pro tip: Color-match your bead soup before starting",
      content:
        "Sort your mixed beads by finish (matte vs AB vs metallic) before you begin. It saves hours of second-guessing mid-project.",
      category: "tips",
      tags: JSON.stringify(["organization", "tips", "workflow"]),
      authorId: maya.id,
      likes: 203,
    },
    {
      title: "Selling at craft fairs — pricing your work?",
      content:
        "How do you price labor + materials? I feel like I'm either underselling or pricing myself out.",
      category: "discussion",
      tags: JSON.stringify(["business", "pricing", "craft-fair"]),
      authorId: elena.id,
      likes: 89,
    },
  ];

  for (const post of posts) {
    const existing = await prisma.communityPost.findFirst({
      where: { title: post.title },
    });
    if (!existing) {
      await prisma.communityPost.create({ data: post });
    }
  }

  const products = [
    {
      title: "Sunset Peyote Cuff",
      description: "Hand-beaded gradient cuff, adjustable fit.",
      price: 89,
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
      materials: JSON.stringify(["Miyuki delicas", "Nymo thread", "Button clasp"]),
      sellerId: maya.id,
    },
    {
      title: "Galaxy Spiral Bracelet",
      description: "Cosmic purple spiral rope with gold accents.",
      price: 65,
      image:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
      materials: JSON.stringify(["Size 11 seed beads", "Gold-lined accents"]),
      sellerId: maya.id,
    },
    {
      title: "Crystal Bloom Earrings",
      description: "Swarovski crystal floral drops.",
      price: 52,
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
      materials: JSON.stringify(["Swarovski crystals", "Miyuki beads"]),
      sellerId: elena.id,
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { title: product.title, sellerId: product.sellerId },
    });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  const tutorials = [
    {
      title: "Herringbone Wave Necklace — Full Tutorial",
      description: "Maya Chen walks through the Ocean Wave pattern start to finish.",
      thumbnail:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=340&fit=crop",
      duration: "45:30",
      type: "video",
      url: "#",
      difficulty: "advanced",
      views: 12400,
      authorId: maya.id,
    },
    {
      title: "Brick Stitch Flower Petals",
      description: "Create dimensional flowers for earrings and pendants.",
      thumbnail:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=340&fit=crop",
      duration: "12:15",
      type: "link",
      url: "https://www.youtube.com/watch?v=example2",
      difficulty: "intermediate",
      views: 89000,
      authorId: elena.id,
    },
  ];

  for (const tutorial of tutorials) {
    const existing = await prisma.tutorial.findFirst({
      where: { title: tutorial.title, authorId: tutorial.authorId },
    });
    if (!existing) {
      await prisma.tutorial.create({ data: tutorial });
    }
  }

  await prisma.project.deleteMany({ where: { userId: maya.id } });
  await prisma.project.createMany({
    data: [
      {
        name: "Sunset Peyote Cuff",
        patternId: "p1",
        progress: 65,
        status: "in-progress",
        userId: maya.id,
      },
      {
        name: "Crystal Bloom Earrings",
        patternId: "p2",
        progress: 100,
        status: "completed",
        userId: maya.id,
      },
    ],
  });

  await prisma.savedPalette.deleteMany({ where: { userId: maya.id } });
  await prisma.savedPalette.createMany({
    data: [
      {
        name: "Sunset Gradient",
        colors: JSON.stringify(["#FF6B6B", "#E8B86D", "#FF8A8A", "#F5D092"]),
        userId: maya.id,
      },
      {
        name: "Ocean Depths",
        colors: JSON.stringify(["#2EC4B6", "#1A535C", "#4ECDC4", "#FFE66D"]),
        userId: maya.id,
      },
    ],
  });

  console.log("Seed complete. Demo login: maya@luomus.com / luomus123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
