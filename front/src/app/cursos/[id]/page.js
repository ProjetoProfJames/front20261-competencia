'use client';

import { useParams } from "next/navigation";
import CursoForm from "@/components/forms/CursoForm";

export default function EditarCursoPage() {
  const params = useParams();
  return <CursoForm id={params.id} />;
}
