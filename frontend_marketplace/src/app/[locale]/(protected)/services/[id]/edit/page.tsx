import { EditService } from "@/features/services/edit-service";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditService id={id} />;
}
