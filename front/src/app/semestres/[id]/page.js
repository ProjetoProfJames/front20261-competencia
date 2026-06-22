'use client';

import { useParams } from "next/navigation";
import SemestreForm from "@/components/forms/SemestreForm";

export default function EditarSemestrePage() {
  const params = useParams();
  return <SemestreForm id={params.id} />;
}
