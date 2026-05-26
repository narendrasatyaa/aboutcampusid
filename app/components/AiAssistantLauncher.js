"use client";

import { useMemo, useState } from "react";
import { ASSISTANT_MENU, ASSISTANT_NAME } from "../../lib/assistant-knowledge";

function formatAssistantReply(reply) {
  return String(reply || "").trim();
}

export default function AiAssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Halo, saya ${ASSISTANT_NAME}. Tanyakan fitur, layanan, atau ketik /menu untuk melihat shortcut.`,
      links: [],
      suggestions: ["/menu", "/layanan", "/partnership"],
    },
  ]);

  const quickButtons = useMemo(() => ASSISTANT_MENU.slice(0, 4), []);

  async function sendMessage(text) {
    const content = String(text || "").trim();
    if (!content || loading) return;

    setError("");
    setLoading(true);

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: nextMessages.slice(-6).map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Gagal menghubungi assistant");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: formatAssistantReply(data.reply),
          links: data.links || [],
          suggestions: data.suggestions || [],
        },
      ]);
    } catch (requestError) {
      setError(requestError.message || "Gagal menghubungi assistant");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Saya belum bisa merespons saat ini. Coba lagi atau pilih /menu.",
          links: [
            { label: "Menu", href: "/" },
            { label: "Kontak", href: "/#kontak" },
          ],
          suggestions: ["/menu", "/kontak"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const panelStyle = {
    position: "fixed",
    right: 20,
    bottom: 92,
    width: "min(360px, calc(100vw - 24px))",
    maxHeight: "70vh",
    display: open ? "flex" : "none",
    flexDirection: "column",
    gap: 12,
    padding: 16,
    borderRadius: 20,
    background: "rgba(255,255,255,0.98)",
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 24px 60px rgba(15,23,42,0.18)",
    zIndex: 1250,
    overflow: "hidden",
  };

  const messageListStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
    paddingRight: 4,
    maxHeight: 280,
  };

  return (
    <>
      <button
        type="button"
        className="floating-wa ai-assistant-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-label="Buka Campus Buddy"
        aria-expanded={open}
        style={{ border: "none", cursor: "pointer" }}
      >
        <i className="fas fa-robot" />
      </button>

      <div className="assistant-panel" style={panelStyle}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
              {ASSISTANT_NAME}
            </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Assistant seputar website aboutcampusid.my.id dan produk About Campus ID</div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={`Tutup ${ASSISTANT_NAME}`}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: "1px solid rgba(15,23,42,0.08)",
              background: "#fff",
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div style={messageListStyle}>
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "90%",
                padding: "10px 12px",
                borderRadius: 16,
                background: message.role === "user" ? "#23B5B5" : "#f8fafc",
                color: message.role === "user" ? "#ffffff" : "#0f172a",
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                fontSize: 13,
                border: message.role === "user" ? "none" : "1px solid rgba(15,23,42,0.08)",
              }}
            >
              {message.content}
              {message.links?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                  {message.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: message.role === "user" ? "rgba(255,255,255,0.16)" : "rgba(35,181,181,0.12)",
                        color: message.role === "user" ? "#ffffff" : "#0f172a",
                        textDecoration: "none",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {loading ? (
            <div style={{ alignSelf: "flex-start", padding: "10px 12px", borderRadius: 16, background: "#f8fafc", border: "1px solid rgba(15,23,42,0.08)", fontSize: 13, color: "#64748b" }}>
              {ASSISTANT_NAME} sedang mengetik...
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {quickButtons.map((item) => (
            <button
              key={item.command}
              type="button"
              onClick={() => sendMessage(item.command)}
              style={{
                border: "1px solid rgba(15,23,42,0.08)",
                background: "#fff",
                color: "#0f172a",
                borderRadius: 999,
                padding: "7px 10px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {item.command}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
          style={{ display: "flex", gap: 8 }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tanya tentang layanan atau ketik /menu"    
            aria-label={`Pesan untuk ${ASSISTANT_NAME}`}
            style={{
              flex: 1,
              borderRadius: 14,
              border: "1px solid rgba(15,23,42,0.12)",
              padding: "11px 12px",
              fontSize: 14,
              color: "#0f172a",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              border: "none",
              borderRadius: 14,
              background: "#23B5B5",
              color: "#fff",
              padding: "0 14px",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Kirim
          </button>
        </form>

        {error ? <div style={{ fontSize: 12, color: "#b91c1c" }}>{error}</div> : null}
      </div>
    </>
  );
}
