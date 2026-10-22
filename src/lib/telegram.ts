// Sends a plain Telegram message to the hotel's chat. Never throws: a failed alert must not fail a booking.
export async function sendTelegramMessage(html: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram not configured; skipping alert.");
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML" }),
    });
    const result = await res.json();
    if (!result.ok) console.error("Telegram API error:", result);
  } catch (err) {
    console.error("Telegram alert failed:", err);
  }
}

export const escapeTelegram = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
