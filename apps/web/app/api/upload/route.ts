import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getCurrentDbUser } from "@/lib/session";

export const runtime = "nodejs";

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
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Envie uma imagem." }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Imagem acima de 5 MB." }, { status: 400 });
    }

    const ext =
      (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "jpg";
    const nome = `${randomUUID()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, nome), Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({ url: `/uploads/${nome}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload de imagem." },
      { status: 500 },
    );
  }
}
