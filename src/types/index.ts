export type BeadMatch = {
  id: string;
  name: string;
  description: string;
  searchQuery: string;
  matchScore: number;
  colorHex?: string;
  shopIds: string[];
};

export type ToolMatch = {
  name: string;
  purpose: string;
  searchQuery: string;
  shopIds: string[];
};

export type SupplyHint = {
  label: string;
  detail: string;
  shopSearch: string;
};

export type ScanResult = {
  scanMode: "jewelry" | "bead";
  confidence: number;
  dominantColors: { hex: string; name: string; percentage: number }[];
  detectedBeads: BeadMatch[];
  suggestedTools: ToolMatch[];
  supplyHints: SupplyHint[];
  patternName: string;
  stitchType: string;
  estimatedDifficulty: Difficulty;
  creationSteps: string[];
  suggestedShops: BeadShop[];
  similarPatterns: Pattern[];
};

export type ImageAnalysis = {
  dominantColors: { hex: string; name: string; percentage: number }[];
  colorCount: number;
  averageSaturation: number;
  averageLightness: number;
  isSingleBeadLikely: boolean;
};

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Pattern = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  stitchType: string;
  craft: string;
  beadCount: number;
  estimatedHours: number;
  image: string;
  tags: string[];
  author: string;
  likes: number;
};

export type ShowcaseItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  craft: CraftId;
  makerUsername: string;
  makerDisplayName: string;
  makerAvatar: string;
  likes: number;
  createdAt: string;
  patternId?: string;
  tutorialId?: string;
};

export type BeadShop = {
  id: string;
  name: string;
  website: string;
  location: string;
  countryCodes: string[];
  beadTypes: string[];
  priceRange: "$" | "$$" | "$$$";
  rating: number;
  shipping: string;
  specialty: string;
};

export type CraftId =
  | "beading"
  | "silversmithing"
  | "fiber"
  | "pottery"
  | "painting"
  | "drawing"
  | "macrame"
  | "paper"
  | "sewing"
  | "wood"
  | "candle";

export type CraftSubforum = {
  id: CraftId;
  label: string;
  emoji: string;
  description: string;
  postCount: number;
  memberCount: number;
  latestActivity: string;
};

export type CommunityPost = {
  id: string;
  author: string;
  avatar: string;
  username?: string;
  title: string;
  content: string;
  category: "tips" | "help" | "showcase" | "discussion";
  craft: CraftId;
  replies: number;
  likes: number;
  createdAt: string;
  tags: string[];
};

export type Tutorial = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  author: string;
  type: "video" | "link";
  url: string;
  difficulty: Difficulty;
  views: number;
  openToTrades?: boolean;
  tradeNotes?: string;
};

export type MarketplaceTutorialListing = {
  id: string;
  type: "tutorial";
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  difficulty: Difficulty;
  views: number;
  url: string;
  tutorialType: "video" | "link";
  openToTrades: boolean;
  tradeNotes?: string;
  owner: { username: string; displayName: string; avatar: string };
};

export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  materials: string[];
  openToTrades?: boolean;
  tradeNotes?: string;
};

export type MaterialCondition = "new" | "leftover";

export type MarketplaceMaterial = {
  id: string;
  type: "material";
  title: string;
  description: string;
  price: number;
  image: string;
  materialType: string;
  quantity: string;
  condition: MaterialCondition;
  craftCategory: CraftId;
  openToTrades: boolean;
  tradeNotes?: string;
  seller: { username: string; displayName: string; avatar: string };
};

export type TradeListingType = "craft" | "tutorial";

export type MarketplaceCraft = Product & {
  type: "craft";
  seller: { username: string; displayName: string; avatar: string };
};

export type MarketplaceTutorial = MarketplaceTutorialListing;

export type MarketplaceListing =
  | MarketplaceCraft
  | MarketplaceTutorialListing
  | MarketplaceMaterial;

export type TradeOfferStatus = "pending" | "accepted" | "declined";

export type TradeOffer = {
  id: string;
  status: TradeOfferStatus;
  createdAt: string;
  message: string;
  offeredType: TradeListingType;
  offeredId: string;
  offeredTitle: string;
  requestedType: TradeListingType;
  requestedId: string;
  requestedTitle: string;
  fromUser: { id: string; username: string; displayName: string; avatar: string };
  toUser: { id: string; username: string; displayName: string; avatar: string };
};

export type TradeOfferInput = {
  message: string;
  offeredType: TradeListingType;
  offeredId: string;
  requestedType: TradeListingType;
  requestedId: string;
};

export type TradeOfferable = {
  id: string;
  title: string;
  type: TradeListingType;
  image: string;
};

export type FeedPost = {
  id: string;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar: string;
  content: string;
  image?: string;
  craftTags: string[];
  likes: number;
  comments: number;
  createdAt: string;
};

export type UserProfile = {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  location: string;
  joined: string;
  followers: number;
  following: number;
  specialties: string[];
  products: Product[];
  tutorials: Tutorial[];
};

export type Project = {
  id: string;
  name: string;
  patternId: string;
  progress: number;
  status: "planning" | "in-progress" | "completed";
  startedAt: string;
};

export type EventType = "market" | "fair" | "workshop" | "meetup";

export type CraftEvent = {
  id: string;
  name: string;
  type: EventType;
  city: string;
  countryCode: string;
  startDate: string;
  endDate?: string;
  description: string;
  link?: string;
  craftTags: CraftId[];
};
