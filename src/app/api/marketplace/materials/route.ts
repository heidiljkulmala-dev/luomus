import { NextResponse } from "next/server";
import { getMarketplaceMaterials } from "@/lib/data/materials";

export async function GET() {
  return NextResponse.json(getMarketplaceMaterials());
}
