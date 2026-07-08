import type { UserProfile } from "@/types";
import { tutorials } from "./tutorials";

export const users: Record<string, UserProfile> = {
  "maya-chen": {
    username: "maya-chen",
    displayName: "Maya Chen",
    bio: "Multi-craft maker — beading, embroidery, and watercolor. Teaching wearable crafts from Portland, OR.",
    avatar: "MC",
    coverImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=400&fit=crop",
    location: "Portland, OR",
    joined: "March 2023",
    followers: 2840,
    following: 312,
    specialties: ["Beading", "Embroidery", "Watercolor"],
    products: [
      {
        id: "pr1",
        title: "Sunset Peyote Cuff",
        price: 89,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
        description: "Hand-beaded gradient cuff, adjustable fit.",
        materials: ["Miyuki delicas", "Nymo thread"],
      },
      {
        id: "pr2",
        title: "Botanical Coaster Set",
        price: 42,
        image: "https://images.unsplash.com/photo-1586075010923-2dd457f0f338?w=400&h=400&fit=crop",
        description: "Sashiko-embroidered linen coasters — set of 4.",
        materials: ["Linen", "Sashiko thread"],
      },
    ],
    tutorials: [tutorials[0], tutorials[2]],
  },
  "elena-rossi": {
    username: "elena-rossi",
    displayName: "Elena Rossi",
    bio: "Knitter, ceramicist, and candle maker based in Florence. Sharing slow-craft tutorials since 2019.",
    avatar: "ER",
    coverImage: "https://images.unsplash.com/photo-1578749552668-2a709924831a?w=1200&h=400&fit=crop",
    location: "Florence, Italy",
    joined: "January 2022",
    followers: 1520,
    following: 189,
    specialties: ["Knitting", "Pottery", "Candles"],
    products: [
      {
        id: "pr4",
        title: "Matte Bud Vase",
        price: 48,
        image: "https://images.unsplash.com/photo-1578749552668-2a709924831a?w=400&h=400&fit=crop",
        description: "Small wheel-thrown vase with satin white glaze.",
        materials: ["Stoneware clay", "Matte glaze"],
      },
      {
        id: "pr5",
        title: "Lavender Soy Candle",
        price: 24,
        image: "https://images.unsplash.com/photo-1602607290814-5edd8a721097?w=400&h=400&fit=crop",
        description: "Hand-poured soy candle with dried lavender top.",
        materials: ["Soy wax", "Cotton wick"],
      },
    ],
    tutorials: [tutorials[1], tutorials[3]],
  },
};

export const featuredCreators = Object.values(users);
