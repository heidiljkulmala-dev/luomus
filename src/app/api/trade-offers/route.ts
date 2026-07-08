import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  createTradeOffer,
  getTradeOffersForUser,
} from "@/lib/trades/store";
import type { TradeListingType, TradeOfferInput } from "@/types";

async function resolveListing(
  type: TradeListingType,
  id: string
): Promise<{
  title: string;
  ownerId: string;
  owner: { id: string; username: string; displayName: string; avatar: string };
} | null> {
  if (type === "craft") {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });
    if (!product) return null;
    return {
      title: product.title,
      ownerId: product.sellerId,
      owner: product.seller,
    };
  }

  const tutorial = await prisma.tutorial.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, avatar: true },
      },
    },
  });
  if (!tutorial) return null;
  return {
    title: tutorial.title,
    ownerId: tutorial.authorId,
    owner: tutorial.author,
  };
}

async function resolveOfferedItem(
  type: TradeListingType,
  id: string,
  userId: string
): Promise<{ title: string } | null> {
  if (type === "craft") {
    const product = await prisma.product.findFirst({
      where: { id, sellerId: userId },
    });
    return product ? { title: product.title } : null;
  }

  const tutorial = await prisma.tutorial.findFirst({
    where: { id, authorId: userId },
  });
  return tutorial ? { title: tutorial.title } : null;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in to view trade offers." }, { status: 401 });
  }

  return NextResponse.json({ offers: getTradeOffersForUser(session.userId) });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in to propose a trade." }, { status: 401 });
  }

  let body: TradeOfferInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { message, offeredType, offeredId, requestedType, requestedId } = body;

  if (!message?.trim() || !offeredType || !offeredId || !requestedType || !requestedId) {
    return NextResponse.json({ error: "All trade fields are required." }, { status: 400 });
  }

  const fromUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, displayName: true, avatar: true },
  });
  if (!fromUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const requested = await resolveListing(requestedType, requestedId);
  if (!requested) {
    return NextResponse.json({ error: "Requested listing not found." }, { status: 404 });
  }

  if (requested.ownerId === session.userId) {
    return NextResponse.json({ error: "You cannot trade with yourself." }, { status: 400 });
  }

  const offered = await resolveOfferedItem(offeredType, offeredId, session.userId);
  if (!offered) {
    return NextResponse.json(
      { error: "You can only offer your own crafts or tutorials." },
      { status: 400 }
    );
  }

  const offer = createTradeOffer(body, {
    fromUser,
    toUser: requested.owner,
    offeredTitle: offered.title,
    requestedTitle: requested.title,
  });

  return NextResponse.json({ offer }, { status: 201 });
}
