import { redirect } from "next/navigation";

type SearchParams = Promise<{ craft?: string; sort?: string }>;

export default async function PatternsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.craft) qs.set("craft", params.craft);
  if (params.sort) qs.set("sort", params.sort);
  const query = qs.toString();
  redirect(`/showroom${query ? `?${query}` : ""}`);
}
