import { z } from "zod";
import { NextResponse } from "next/server";
import {
  ASSISTANT_LINKS,
  buildAssistantSystemPrompt,
  buildCommandResponse,
  detectAssistantCommand,
} from "../../../lib/assistant-knowledge";

const assistantSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .optional()
    .default([]),
});

function buildFallbackSuggestions(message) {
  const text = String(message || "").toLowerCase();
  if (text.includes("free")) return ["/free", "/partnership", "/menu"];
  if (text.includes("paid")) return ["/paid", "/partnership", "/menu"];
  if (text.includes("research") || text.includes("riset")) return ["/research", "/menu"];
  if (text.includes("store") || text.includes("merch")) return ["/store", "/menu"];
  if (text.includes("kontak") || text.includes("wa")) return ["/kontak", "/menu"];
  return ["/menu", "/layanan", "/partnership"];
}

function buildHistoryMessages(history) {
  return (history || [])
    .slice(-6)
    .map((item) => ({
      role: item.role,
      content: item.content,
    }));
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = assistantSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Payload assistant tidak valid" }, { status: 400 });
    }

    const message = parsed.data.message.trim();
    const command = detectAssistantCommand(message);

    if (command) {
      const response = buildCommandResponse(command);
      if (response) {
        return NextResponse.json({ ok: true, mode: "command", ...response });
      }
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

    if (!apiKey) {
      return NextResponse.json(
        {
          ok: true,
          mode: "fallback",
          title: "Qrok",
          reply:
            "Campus Buddy belum diatur. Saya bisa bantu seputar website dan layanan About Campus ID, atau pilih /menu untuk melihat shortcut.",
          suggestions: ["/menu", "/layanan", "/partnership"],
          links: [
            { label: "Menu", href: ASSISTANT_LINKS.menu },
            { label: "Partnership", href: ASSISTANT_LINKS.partnership },
          ],
        },
        { status: 200 }
      );
    }

    const messages = [
      { role: "system", content: buildAssistantSystemPrompt() },
      ...buildHistoryMessages(parsed.data.history),
      { role: "user", content: message },
    ];

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 350,
      }),
      cache: "no-store",
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      return NextResponse.json(
        {
          ok: true,
          mode: "fallback",
          title: "Qrok",
          reply:
            process.env.NODE_ENV === "development"
              ? `Campus Buddy gagal merespons: ${groqResponse.status} ${errorText}`
              : "Sistem AI sedang bermasalah. Coba /menu atau chat admin lewat WhatsApp.",
          suggestions: buildFallbackSuggestions(message),
          links: [
            { label: "Menu", href: ASSISTANT_LINKS.menu },
            { label: "Kontak", href: ASSISTANT_LINKS.kontak },
          ],
        },
        { status: 200 }
      );
    }

    const data = await groqResponse.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({
      ok: true,
      mode: "ai",
      title: "Qrok",
      reply:
        reply ||
        "Saya belum mendapatkan jawaban yang jelas. Coba /menu untuk lihat shortcut yang tersedia.",
      suggestions: buildFallbackSuggestions(message),
      links: [
        { label: "Menu", href: ASSISTANT_LINKS.menu },
        { label: "Partnership", href: ASSISTANT_LINKS.partnership },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: process.env.NODE_ENV === "development" ? error.message : "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}
