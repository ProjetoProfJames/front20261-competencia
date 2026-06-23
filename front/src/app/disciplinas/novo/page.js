'use client';

import { useRouter } from "next/navigation";

import DisciplinaForm from "@/components/forms/DisciplinaForm";
import { disciplinaService } from "@/services/disciplinaService";

export default function NovaDisciplinaPage() {
  const router = useRouter();

  async function handleSubmit(data) {
    await disciplinaService.create(data);
    router.push("/disciplinas");
  }

  return (
    <main>
      <DisciplinaForm
        onSubmit={handleSubmit}
      />
    </main>
  );
}