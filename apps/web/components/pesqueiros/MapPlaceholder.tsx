import { MapPin, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatNota } from "@/lib/format";

interface Pin {
  /** Posição relativa (%) dentro do mapa. */
  x: number;
  y: number;
  nota: number;
}

/**
 * Mapa placeholder com pinos e notas.
 *
 * Vira a Google Places API depois (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY):
 * aqui entraria o <GoogleMap> com markers reais e o rótulo
 * "Locais via Google Maps" continua como atribuição.
 */
export function MapPlaceholder({
  pins,
  className,
}: {
  pins?: Pin[];
  className?: string;
}) {
  const data: Pin[] =
    pins ?? [
      { x: 22, y: 30, nota: 4.6 },
      { x: 60, y: 22, nota: 4.3 },
      { x: 74, y: 40, nota: 4.7 },
      { x: 38, y: 58, nota: 4.5 },
      { x: 66, y: 66, nota: 4.8 },
    ];

  return (
    <div
      className={cn(
        "relative h-44 w-full overflow-hidden rounded-2xl border border-border bg-surface-2",
        className,
      )}
    >
      {/* "Ruas" decorativas do mapa fake */}
      <div className="absolute inset-0 opacity-60" aria-hidden="true">
        <div className="absolute left-0 right-0 top-1/3 h-px bg-border" />
        <div className="absolute left-0 right-0 top-2/3 h-px bg-border" />
        <div className="absolute bottom-0 left-1/4 top-0 w-px bg-border" />
        <div className="absolute bottom-0 left-2/3 top-0 w-px bg-border" />
      </div>

      {data.map((pin, i) => (
        <div
          key={i}
          className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <span className="mb-0.5 inline-flex items-center gap-0.5 rounded-full bg-surface px-1.5 py-0.5 text-[10px] font-semibold shadow-sm">
            {/* Estrela DOURADA = nota do Google (convenção universal). */}
            <Star
              className="h-2.5 w-2.5 fill-[#F5B301] text-[#F5B301]"
              aria-hidden="true"
            />
            {formatNota(pin.nota)}
          </span>
          <MapPin
            className="h-6 w-6 fill-brand text-brand-fg"
            aria-hidden="true"
          />
        </div>
      ))}

      {/* Atribuição obrigatória ao plugar o Google Maps. */}
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] text-text-2">
        Locais via Google Maps
      </span>
    </div>
  );
}
