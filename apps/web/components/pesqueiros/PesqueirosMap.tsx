"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";
import type { Pesqueiro } from "@fisgou/shared";

/**
 * Mapa real do Google (Maps JS API). Só é usado quando há
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (o pai cai no MapPlaceholder se não houver).
 */
export function PesqueirosMap({
  pesqueiros,
  apiKey,
}: {
  pesqueiros: Pesqueiro[];
  apiKey: string;
}) {
  const { isLoaded } = useJsApiLoader({
    id: "fisgou-gmaps",
    googleMapsApiKey: apiKey,
  });

  const comCoords = useMemo(
    () => pesqueiros.filter((p) => p.lat != null && p.lng != null),
    [pesqueiros],
  );

  const center = useMemo(() => {
    if (comCoords.length === 0) return { lat: -22.0, lng: -47.8 };
    const lat =
      comCoords.reduce((s, p) => s + (p.lat as number), 0) / comCoords.length;
    const lng =
      comCoords.reduce((s, p) => s + (p.lng as number), 0) / comCoords.length;
    return { lat, lng };
  }, [comCoords]);

  if (!isLoaded) {
    return <div className="skeleton h-44 w-full rounded-2xl" aria-hidden="true" />;
  }

  return (
    <div className="h-44 w-full overflow-hidden rounded-2xl border border-border">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={8}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        }}
      >
        {comCoords.map((p) => (
          <MarkerF
            key={p.id}
            position={{ lat: p.lat as number, lng: p.lng as number }}
            title={`${p.nome} · ★ ${p.nota}`}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
