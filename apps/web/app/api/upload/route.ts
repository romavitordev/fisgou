import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getCurrentDbUser } from "@/lib/session";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Detecta o tipo real da imagem pelos magic bytes — `file.type` e o nome
 * do arquivo são controlados pelo cliente e não podem ser confiados
 * (um "image/png" forjado num .html servido de /uploads seria XSS).
 * SVG fica de fora de propósito: é XML e pode executar script.
 */
function detectarTipoImagem(buf: Buffer): "jpg" | "png" | "gif" | "webp" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
    return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38)
    return "gif";
  if (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  )
    return "webp";
  return null;
}

/**
 * Upload de imagem (FASE 2 — armazenamento LOCAL em public/uploads).
 * Em produção isso vira storage externo (S3/Supabase/Cloudinary).
 */
export async function POST(req: Request) {
  try {
    const me = await getCurrentDbUser();
    if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const form = await req.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Imagem acima de 5 MB." }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const tipo = detectarTipoImagem(buf);
    if (!tipo) {
      return NextResponse.json(
        { error: "Envie uma imagem JPG, PNG, GIF ou WebP." },
        { status: 400 },
      );
    }

    // Extensão vem do tipo DETECTADO — nunca do nome enviado.
    const nome = `${randomUUID()}.${tipo}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, nome), buf);

    return NextResponse.json({ url: `/uploads/${nome}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload de imagem." },
      { status: 500 },
    );
  }
}
