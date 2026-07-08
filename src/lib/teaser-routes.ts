export type TeaserRouteId =
  | "showroom"
  | "tutorials"
  | "marketplace"
  | "events"
  | "community"
  | "traditional-crafts"
  | "feed";

export const teaserContent: Record<
  TeaserRouteId,
  { title: string; description: string }
> = {
  showroom: {
    title: "Showroom",
    description:
      "Browse finished crafts from makers worldwide — filter by discipline and discover work worth studying. Sign in to save favorites and connect with makers.",
  },
  tutorials: {
    title: "Tutorials",
    description:
      "Watch creator videos and explore curated links to the best craft tutorials on the web. Sign in to upload your own lessons and bookmark guides.",
  },
  marketplace: {
    title: "Maker Shop",
    description:
      "Shop handmade crafts and supplies from craftopia makers — or propose a trade. Sign in to buy, sell, and send trade offers.",
  },
  events: {
    title: "Craft Events",
    description:
      "Find local craft markets, maker fairs, workshops, and meetups near you. Sign in to add events and get personalized local picks.",
  },
  community: {
    title: "Community Forum",
    description:
      "Ask questions, share ideas, and get advice from makers in every craft. Sign in to post, reply, and join subforum discussions.",
  },
  "traditional-crafts": {
    title: "Traditional Crafts",
    description:
      "Discover heritage making traditions from every continent — from African beadwork to European lace. Sign in to save traditions and share your own.",
  },
  feed: {
    title: "Your Feed",
    description:
      "Follow crafters and see their latest posts in one place — projects, tips, and studio moments. Sign in to build your personalized maker feed.",
  },
};
