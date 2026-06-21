'use client';

import { useParams } from "next/navigation";
import TurmaForm from "@/components/forms/TurmaForm";

export default function EditarTurmaPage() {
  const params = useParams();
  return <TurmaForm id={params.id} />;
}
