import Image from "next/image";
import { cn } from "@/lib/cn";

interface AvatarProps {
  iniciais: string;
  cor: string;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Anel de contorno (útil em avatares sobrepostos). */
  ring?: boolean;
}

const sizes: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-24 w-24 text-2xl",
};

/** Avatar com foto ou placeholder de iniciais. */
export function Avatar({
  iniciais,
  cor,
  src,
  alt,
  size = "md",
  className,
  ring,
}: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white leading-none",
        sizes[size],
        ring && "ring-2 ring-surface",
        className,
      )}
      style={{ backgroundColor: cor }}
      aria-hidden={!src}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? "Foto de perfil"}
          fill
          sizes="100%"
          className="object-cover"
        />
      ) : (
        iniciais
      )}
    </span>
  );
}
