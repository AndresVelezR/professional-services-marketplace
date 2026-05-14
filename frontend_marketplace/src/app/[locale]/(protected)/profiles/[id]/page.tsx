import { PublicProfile } from "@/features/profile/public-profile";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PublicProfile userId={id} />;
}
