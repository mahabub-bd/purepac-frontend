export default async function BrandsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <div>Brands {slug}</div>;
}
