"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CheckInButton({
  pesqueiroId,
  jaFezCheckIn,
}: {
  pesqueiroId: string;
  jaFezCheckIn: boolean;
}) {
  const router = useRouter();
  const [feito, setFeito] = useState(jaFezCheckIn);
  const [enviando, setEnviando] = useState(false);

  async function fazerCheckIn() {
    if (enviando || feito) return;
    setEnviando(true);
    try {
      const r = await fetch(`/api/pesqueiros/${pesqueiroId}/checkin`, {
        method: "POST",
      });
      if (!r.ok) throw new Error();
      setFeito(true);
      router.refresh();
    } catch {
      // silencioso — usuário pode tentar de novo
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Button
      variant="secondary"
      className="flex-1"
      onClick={fazerCheckIn}
      disabled={enviando || feito}
    >
      {enviando ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      )}
      {feito ? "Check-in feito" : "Check-in"}
    </Button>
  );
}
