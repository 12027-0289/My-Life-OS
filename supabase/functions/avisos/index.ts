// My Life OS · función "avisos"
// Manda los recordatorios (agua, dormir, hábitos, skincare, alarma) aunque la app esté cerrada.
// - Un reloj de Supabase (pg_cron, ver supabase/avisos.sql) la llama cada minuto con {action:"tick"}.
// - Lee tus horarios y tu día (agua, hábitos…) de lo que la app ya sincroniza en mlos_state.
// - Usa Web Push estándar: las claves VAPID se crean solas la primera vez y quedan en la base,
//   la clave privada nunca sale de Supabase. No hace falta ningún servicio pago.
import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const SITE = "https://12027-0289.github.io/my-life-os/"; // contacto que piden Apple/Google en los avisos
const SB_URL = Deno.env.get("SUPABASE_URL") ?? "";
function serviceKey(): string {
  const k = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (k) return k;
  try { const all = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}"); return Object.values(all)[0] as string ?? ""; } catch { return ""; }
}

/* ---------------- Web Push (RFC 8291 + RFC 8292) con WebCrypto ---------------- */
const te = new TextEncoder();
const bytes = (n: number) => new Uint8Array(n);
type Bytes = ReturnType<typeof bytes>; // bytes en un ArrayBuffer común (lo que pide WebCrypto)
export const b64u = (buf: ArrayBuffer | Uint8Array): string => {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf); let s = "";
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
export const unb64u = (s: string): Bytes => {
  s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
  const bin = atob(s), out = bytes(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};
const concat = (...parts: Uint8Array[]): Bytes => {
  const out = bytes(parts.reduce((n, p) => n + p.length, 0)); let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
};
async function hkdf(salt: Bytes, ikm: Bytes, info: Bytes, len: number): Promise<Bytes> {
  const key = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, key, len * 8));
}
// Cifra el mensaje para un dispositivo (aes128gcm)
export async function encryptPayload(payload: Uint8Array, p256dh: string, auth: string): Promise<Bytes> {
  const uaPub = unb64u(p256dh), authSecret = unb64u(auth);
  const as = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPub = new Uint8Array(await crypto.subtle.exportKey("raw", as.publicKey));
  const uaKey = await crypto.subtle.importKey("raw", uaPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: uaKey }, as.privateKey, 256));
  const ikm = await hkdf(authSecret, shared, concat(concat(te.encode("WebPush: info\0")), uaPub, asPub), 32);
  const salt = crypto.getRandomValues(bytes(16));
  const cek = await hkdf(salt, ikm, concat(te.encode("Content-Encoding: aes128gcm\0")), 16);
  const nonce = await hkdf(salt, ikm, concat(te.encode("Content-Encoding: nonce\0")), 12);
  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, concat(payload, new Uint8Array([2]))));
  const header = bytes(21 + asPub.length);
  header.set(salt, 0); new DataView(header.buffer).setUint32(16, 4096); header[20] = asPub.length; header.set(asPub, 21);
  return concat(header, ct);
}
// Firma VAPID: prueba que el aviso viene de tu servidor
export async function vapidAuth(endpoint: string, publicKey: string, privateJwk: JsonWebKey): Promise<string> {
  const key = await crypto.subtle.importKey("jwk", privateJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const head = b64u(te.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const body = b64u(te.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: SITE })));
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, concat(te.encode(`${head}.${body}`))));
  return `vapid t=${head}.${body}.${b64u(sig)}, k=${publicKey}`;
}
export async function newVapidKeys() {
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  return { public_key: b64u(await crypto.subtle.exportKey("raw", kp.publicKey)), private_jwk: await crypto.subtle.exportKey("jwk", kp.privateKey) };
}

/* ---------------- Qué toca avisar (misma lógica que la app) ---------------- */
type Sub = { endpoint: string; user_id: string; p256dh: string; auth: string; tz: string };
type Msg = { key: string; title: string; body: string; tag: string };
// deno-lint-ignore no-explicit-any
type State = any;

export function localNow(tz: string, now = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short" })
    .formatToParts(now).map((x) => [x.type, x.value]));
  const day = `${p.year}-${p.month}-${p.day}`, idx = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday);
  const mon = new Date(Date.UTC(+p.year, +p.month - 1, +p.day - idx)), week = mon.toISOString().slice(0, 10);
  return { day, week, idx, mins: +p.hour * 60 + +p.minute };
}
const toMin = (t: string) => { const [h, m] = String(t || "").split(":").map(Number); return h * 60 + (m || 0); };
const inWindow = (t: string, mins: number) => { const d = mins - toMin(t); return d >= 0 && d < 5; }; // por si el reloj se atrasa un minuto

export function dueMessages(st: State, tz: string, now = new Date()): Msg[] {
  if (!st) return [];
  const { day, week, idx, mins } = localNow(tz, now), today = st.day === day, out: Msg[] = [];
  const rem = st.rem || {}, name = st.profile?.name ? `, ${st.profile.name}` : "";
  const water = today ? (st.water || 0) : 0;
  if (rem.agua?.on && mins >= 540 && mins <= 1260 && water < 8) {
    const per = (rem.agua.every || 2) * 60, slot = Math.floor((mins - 540) / per);
    if (slot >= 1 && (mins - 540) % per < 5) out.push({ key: `agua-${day}-${slot}`, title: "Hora de tomar agua", body: `Vas ${water} de 8 vasos`, tag: "agua" });
  }
  if (rem.dormir?.on && inWindow(rem.dormir.t, mins)) out.push({ key: `dormir-${day}`, title: "Hora de ir a dormir", body: "Celular lejos y luces bajas. Mañana te lo agradecés.", tag: "dormir" });
  const habits = st.habits || [], pending = habits.filter((h: State) => !(st.week === week && h.w?.[idx])).length;
  if (rem.habitos?.on && inWindow(rem.habitos.t, mins) && pending) out.push({ key: `hab-${day}`, title: "¿Marcaste tus hábitos?", body: `Te faltan ${pending} para hoy`, tag: "habitos" });
  const pm = (st.skin?.products || []).filter((p: State) => p.when === "pm" || p.when === "both"), done = today ? (st.skin?.done?.pm || []) : [];
  const left = pm.filter((p: State) => !done.includes(p.id)).length;
  if (rem.skin?.on && inWindow(rem.skin.t, mins) && left) out.push({ key: `skin-${day}`, title: "Skincare de noche", body: `${left} pasos y a dormir`, tag: "skin" });
  if (st.alarm?.on && inWindow(st.alarm.t, mins)) out.push({ key: `alarm-${day}`, title: `¡Buen día${name}!`, body: "Es la hora de tu alarma", tag: "alarm" });
  return out;
}

/* ---------------- Base de datos y envío ---------------- */
const db = () => createClient(SB_URL, serviceKey(), { auth: { persistSession: false } });

async function vapid(sb: ReturnType<typeof db>) {
  const { data } = await sb.from("mlos_push_keys").select("public_key, private_jwk").eq("id", 1).maybeSingle();
  if (data) return data as { public_key: string; private_jwk: JsonWebKey };
  const keys = await newVapidKeys();
  await sb.from("mlos_push_keys").upsert({ id: 1, ...keys }, { onConflict: "id", ignoreDuplicates: true });
  const again = await sb.from("mlos_push_keys").select("public_key, private_jwk").eq("id", 1).single();
  return again.data as { public_key: string; private_jwk: JsonWebKey };
}

async function send(sb: ReturnType<typeof db>, keys: { public_key: string; private_jwk: JsonWebKey }, sub: Sub, msg: Omit<Msg, "key">) {
  const body = await encryptPayload(te.encode(JSON.stringify(msg)), sub.p256dh, sub.auth);
  const res = await fetch(sub.endpoint, {
    method: "POST",
    headers: { TTL: "3600", Urgency: "high", "Content-Encoding": "aes128gcm", "Content-Type": "application/octet-stream", Authorization: await vapidAuth(sub.endpoint, keys.public_key, keys.private_jwk) },
    body,
  });
  if (res.status === 404 || res.status === 410) await sb.from("mlos_push_subs").delete().eq("endpoint", sub.endpoint); // el dispositivo ya no existe
  return res.status;
}

async function userId(req: Request): Promise<string | null> {
  const auth = req.headers.get("Authorization") ?? "", apikey = req.headers.get("apikey") ?? "";
  if (!auth.startsWith("Bearer ")) return null;
  const res = await fetch(`${SB_URL}/auth/v1/user`, { headers: { Authorization: auth, apikey } });
  if (!res.ok) return null;
  return (await res.json()).id ?? null;
}

async function tick() {
  const sb = db(), keys = await vapid(sb);
  const { data: subs } = await sb.from("mlos_push_subs").select("endpoint, user_id, p256dh, auth, tz");
  if (!subs?.length) return { sent: 0 };
  const ids = [...new Set(subs.map((s) => s.user_id))];
  const { data: rows } = await sb.from("mlos_state").select("user_id, data").in("user_id", ids);
  const stateOf = new Map((rows ?? []).map((r) => [r.user_id, r.data]));
  let sent = 0;
  for (const uid of ids) {
    const mine = subs.filter((s) => s.user_id === uid) as Sub[];
    for (const msg of dueMessages(stateOf.get(uid), mine[0].tz)) {
      // cada aviso una sola vez por persona, aunque el reloj llame varias veces
      const { data: fresh } = await sb.from("mlos_push_log").upsert({ user_id: uid, key: msg.key }, { onConflict: "user_id,key", ignoreDuplicates: true }).select();
      if (!fresh?.length) continue;
      for (const s of mine) { try { await send(sb, keys, s, { title: msg.title, body: msg.body, tag: msg.tag }); sent++; } catch { /* sigue con los demás */ } }
    }
  }
  if (new Date().getUTCMinutes() === 0) await sb.from("mlos_push_log").delete().lt("created_at", new Date(Date.now() - 3 * 864e5).toISOString());
  return { sent };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let body: { action?: string; subscription?: { endpoint: string; keys: { p256dh: string; auth: string } }; tz?: string; endpoint?: string } = {};
  try { body = await req.json(); } catch { /* vacío */ }
  try {
    if (body.action === "tick") return json(await tick());
    const sb = db();
    if (body.action === "key") return json({ publicKey: (await vapid(sb)).public_key });
    const uid = await userId(req); if (!uid) return json({ error: "no_auth" }, 401);
    if (body.action === "subscribe" && body.subscription?.endpoint) {
      const s = body.subscription;
      const { error } = await sb.from("mlos_push_subs").upsert({ endpoint: s.endpoint, user_id: uid, p256dh: s.keys.p256dh, auth: s.keys.auth, tz: body.tz || "America/Costa_Rica" }, { onConflict: "endpoint" });
      return error ? json({ error: error.message }, 500) : json({ ok: true });
    }
    if (body.action === "unsubscribe" && body.endpoint) { await sb.from("mlos_push_subs").delete().eq("endpoint", body.endpoint).eq("user_id", uid); return json({ ok: true }); }
    if (body.action === "test") {
      const keys = await vapid(sb), { data: mine } = await sb.from("mlos_push_subs").select("endpoint, user_id, p256dh, auth, tz").eq("user_id", uid);
      const st = await Promise.all((mine ?? []).map((s) => send(sb, keys, s as Sub, { title: "¡Avisos funcionando!", body: "Te van a llegar aunque la app esté cerrada", tag: "test" })));
      return json({ ok: true, devices: st.length, statuses: st });
    }
    return json({ error: "action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message || "unknown" }, 500);
  }
});
