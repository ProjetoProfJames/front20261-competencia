'use client';

import { useParams } from "next/navigation";
import DisciplinaForm from "@/components/forms/DisciplinaForm";

export default function EditarDisciplinaPage() {
  const params = useParams();
  return <DisciplinaForm id={params.id} />;
}