// My Life OS · función "calorias"
// Calcula las calorías aproximadas de una comida a partir de lo que escribiste y/o una foto, usando Claude.
// La clave de Anthropic vive como secreto de Supabase (ANTHROPIC_API_KEY): nunca llega al navegador.
// Solo responde a personas con sesión iniciada en tu app.
import Anthropic from "npm:@anthropic-ai/sdk@1.2.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const client = new Anthropic(); // lee ANTHROPIC_API_KEY de los secretos de la función

const SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, portion: { type: "string" }, kcal: { type: "integer" } },
        required: ["name", "portion", "kcal"],
        additionalProperties: false,
      },
    },
    total_kcal: { type: "integer" },
    confidence: { type: "string", enum: ["alta", "media", "baja"] },
    note: { type: "string" },
  },
  required: ["items", "total_kcal", "confidence", "note"],
  additionalProperties: false,
};

const PROMPT = `Sos un asistente de nutrición. Estimá las calorías de esta comida para una app personal de seguimiento.
- Si hay foto, identificá los alimentos y estimá las porciones por lo que se ve.
- Si hay texto, usalo (manda sobre la foto si se contradicen). Cantidades no dichas: porción típica de un adulto.
- Contexto: la persona vive en Costa Rica (gallo pinto, casado, chifrijo, plátano maduro, etc. tienen sus porciones típicas de allá).
- Devolvé cada alimento con su porción estimada en palabras simples y sus kcal, el total, qué tan segura es la estimación y una nota breve en español (máximo 15 palabras).
- Si no hay comida reconocible, devolvé items vacío, total 0, confianza "baja" y explicalo en la nota.`;

async function signedIn(req: Request): Promise<boolean> {
  const auth = req.headers.get("Authorization") ?? "";
  const apikey = req.headers.get("apikey") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  if (!auth.startsWith("Bearer ")) return false;
  const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/auth/v1/user`, { headers: { Authorization: auth, apikey } });
  return res.ok;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!(await signedIn(req))) return json({ error: "no_auth" }, 401);

  let body: { text?: string; image?: string; meal?: string };
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400); }
  const text = (body.text ?? "").toString().slice(0, 500).trim();
  const image = (body.image ?? "").toString();
  if (!text && !image) return json({ error: "empty" }, 400);
  if (image.length > 4_000_000) return json({ error: "image_too_big" }, 413);

  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  if (image) content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } });
  content.push({ type: "text", text: `${PROMPT}\n\nComida: ${body.meal ?? "comida"}\nLo que escribió: ${text || "(nada, solo la foto)"}` });

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      messages: [{ role: "user", content }],
    });
    if (response.stop_reason === "refusal") return json({ error: "refusal" }, 422);
    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") return json({ error: "no_answer" }, 502);
    return json(JSON.parse(block.text));
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return json({ error: "bad_api_key" }, 500);
    if (err instanceof Anthropic.RateLimitError) return json({ error: "rate_limited" }, 429);
    if (err instanceof Anthropic.APIError) return json({ error: "api_error", status: err.status }, 502);
    return json({ error: "unknown" }, 500);
  }
});
