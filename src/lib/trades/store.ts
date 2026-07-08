import type { TradeOffer, TradeOfferInput } from "@/types";

const offers: TradeOffer[] = [];

export function createTradeOffer(
  input: TradeOfferInput,
  context: {
    fromUser: TradeOffer["fromUser"];
    toUser: TradeOffer["toUser"];
    offeredTitle: string;
    requestedTitle: string;
  }
): TradeOffer {
  const offer: TradeOffer = {
    id: `trade-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    message: input.message.trim(),
    offeredType: input.offeredType,
    offeredId: input.offeredId,
    offeredTitle: context.offeredTitle,
    requestedType: input.requestedType,
    requestedId: input.requestedId,
    requestedTitle: context.requestedTitle,
    fromUser: context.fromUser,
    toUser: context.toUser,
  };

  offers.unshift(offer);
  return offer;
}

export function getTradeOffersForUser(userId: string): TradeOffer[] {
  return offers.filter(
    (o) => o.fromUser.id === userId || o.toUser.id === userId
  );
}

export function getAllTradeOffers(): TradeOffer[] {
  return [...offers];
}
