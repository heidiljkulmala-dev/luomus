import type { FeedPost } from "@/types";

/** Default usernames the demo user (maya-chen) follows on first visit. */
export const defaultFollowing = ["elena-rossi", "yarnloop", "studioluna"];

export const feedPosts: FeedPost[] = [
  {
    id: "f1",
    authorUsername: "maya-chen",
    authorDisplayName: "Maya Chen",
    authorAvatar: "MC",
    content:
      "Finished this sunset gradient peyote cuff after two weeks of evening sessions. The color transition from coral to gold was tricky but worth it!",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop",
    craftTags: ["Beading", "Peyote", "Jewelry"],
    likes: 142,
    comments: 23,
    createdAt: "2 hours ago",
  },
  {
    id: "f2",
    authorUsername: "elena-rossi",
    authorDisplayName: "Elena Rossi",
    authorAvatar: "ER",
    content:
      "Studio day in Florence — pulled my first set of matte white bud vases from the kiln. Soft satin finish, no crawling this time!",
    image:
      "https://images.unsplash.com/photo-1578749552668-2a709924831a?w=800&h=600&fit=crop",
    craftTags: ["Pottery", "Ceramics", "Wheel-throwing"],
    likes: 89,
    comments: 14,
    createdAt: "4 hours ago",
  },
  {
    id: "f3",
    authorUsername: "yarnloop",
    authorDisplayName: "Yarn Loop",
    authorAvatar: "YL",
    content:
      "Three weeks of knitting and my chunky cardigan is finally off the needles! Used the Cloud Cardigan template on luomus. Now for blocking…",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=600&fit=crop",
    craftTags: ["Knitting", "Fiber", "Wearable"],
    likes: 156,
    comments: 18,
    createdAt: "5 hours ago",
  },
  {
    id: "f4",
    authorUsername: "maya-chen",
    authorDisplayName: "Maya Chen",
    authorAvatar: "MC",
    content:
      "Pro tip for cross-craft makers: keep a small watercolor palette next to your beading tray. Sketch color ideas before committing to bead colors — saves so much frogging.",
    craftTags: ["Beading", "Watercolor", "Tips"],
    likes: 203,
    comments: 31,
    createdAt: "8 hours ago",
  },
  {
    id: "f5",
    authorUsername: "studioluna",
    authorDisplayName: "Studio Luna",
    authorAvatar: "SL",
    content:
      "Organized my paint tubes by undertone instead of hue this weekend. Warm vs cool versions of each color — game changer for mixing sessions.",
    image:
      "https://images.unsplash.com/photo-1513364774534-5ad4f327f081?w=800&h=600&fit=crop",
    craftTags: ["Painting", "Organization", "Studio"],
    likes: 178,
    comments: 27,
    createdAt: "1 day ago",
  },
  {
    id: "f6",
    authorUsername: "elena-rossi",
    authorDisplayName: "Elena Rossi",
    authorAvatar: "ER",
    content:
      "Hand-poured a batch of lavender soy candles for the weekend market. The dried lavender tops are from my garden — love when crafts connect to place.",
    image:
      "https://images.unsplash.com/photo-1602607290814-5edd8a721097?w=800&h=600&fit=crop",
    craftTags: ["Candles", "Soy wax", "Market prep"],
    likes: 67,
    comments: 9,
    createdAt: "1 day ago",
  },
  {
    id: "f7",
    authorUsername: "maya-chen",
    authorDisplayName: "Maya Chen",
    authorAvatar: "MC",
    content:
      "Sashiko meets peyote: used geometric sashiko patterns as graph paper for a new cuff design. The results are stunning — anyone else blend disciplines like this?",
    craftTags: ["Beading", "Embroidery", "Fusion"],
    likes: 234,
    comments: 42,
    createdAt: "2 days ago",
  },
  {
    id: "f8",
    authorUsername: "elena-rossi",
    authorDisplayName: "Elena Rossi",
    authorAvatar: "ER",
    content:
      "Slow Sunday knitting — working on a lace shawl for a friend's wedding. Merino lace weight is unforgiving but the drape is worth every dropped stitch.",
    craftTags: ["Knitting", "Lace", "Gift"],
    likes: 94,
    comments: 11,
    createdAt: "2 days ago",
  },
  {
    id: "f9",
    authorUsername: "yarnloop",
    authorDisplayName: "Yarn Loop",
    authorAvatar: "YL",
    content:
      "Found the perfect yarn for colorwork at a local shop in Reykjavik. Icelandic wool has such character — already planning a fair isle hat pattern.",
    craftTags: ["Knitting", "Colorwork", "Travel"],
    likes: 112,
    comments: 16,
    createdAt: "3 days ago",
  },
  {
    id: "f10",
    authorUsername: "maya-chen",
    authorDisplayName: "Maya Chen",
    authorAvatar: "MC",
    content:
      "Botanical coaster set done! Sashiko-embroidered linen coasters — set of four. Listing them in my shop this week.",
    image:
      "https://images.unsplash.com/photo-1586075010923-2dd457f0f338?w=800&h=600&fit=crop",
    craftTags: ["Embroidery", "Sashiko", "Home"],
    likes: 88,
    comments: 12,
    createdAt: "3 days ago",
  },
  {
    id: "f11",
    authorUsername: "studioluna",
    authorDisplayName: "Studio Luna",
    authorAvatar: "SL",
    content:
      "Golden hour in the studio. Working on a series of small landscapes inspired by the coast — trying to capture that blush-pink sky before it fades.",
    image:
      "https://images.unsplash.com/photo-1541961017774-fa489d1a9d91?w=800&h=600&fit=crop",
    craftTags: ["Painting", "Landscape", "Watercolor"],
    likes: 145,
    comments: 19,
    createdAt: "4 days ago",
  },
  {
    id: "f12",
    authorUsername: "elena-rossi",
    authorDisplayName: "Elena Rossi",
    authorAvatar: "ER",
    content:
      "Pricing handmade work is hard. How do you all factor in labor + materials for craft fairs? Would love to hear how pros handle this across different crafts.",
    craftTags: ["Business", "Pricing", "Craft fair"],
    likes: 89,
    comments: 47,
    createdAt: "5 days ago",
  },
];

export function getPostsByUsername(username: string): FeedPost[] {
  return feedPosts.filter((p) => p.authorUsername === username);
}

export function getFeedForFollowing(following: string[]): FeedPost[] {
  if (following.length === 0) return [];
  return feedPosts.filter((p) => following.includes(p.authorUsername));
}
