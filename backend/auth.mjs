import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

async function readStore(usersPath) {
  try {
    const raw = await fs.readFile(usersPath, "utf8");
    const store = JSON.parse(raw);
    return {
      users: Array.isArray(store.users) ? store.users : [],
      sessions: Array.isArray(store.sessions) ? store.sessions : [],
    };
  } catch (error) {
    if (error.code === "ENOENT") return { users: [], sessions: [] };
    throw error;
  }
}

async function writeStore(usersPath, store) {
  await fs.mkdir(path.dirname(usersPath), { recursive: true });
  await fs.writeFile(usersPath, JSON.stringify(store, null, 2), "utf8");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function validateCredentials({ name, email, password }, needsName = false) {
  const cleanName = String(name || "").trim();
  const cleanEmail = normalizeEmail(email);
  const cleanPassword = String(password || "");

  if (needsName && cleanName.length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return "Enter a valid email address.";
  }

  if (cleanPassword.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return "";
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

async function verifyPassword(password, passwordHash) {
  const [salt, storedHash] = String(passwordHash || "").split(":");
  if (!salt || !storedHash) return false;

  const hash = await scrypt(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, "hex");
  return storedBuffer.length === hash.length && crypto.timingSafeEqual(storedBuffer, hash);
}

function createSession(userId) {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
}

export async function signupUser(usersPath, credentials) {
  const validationError = validateCredentials(credentials, true);
  if (validationError) {
    return { ok: false, status: 400, error: validationError };
  }

  const store = await readStore(usersPath);
  const email = normalizeEmail(credentials.email);
  const existing = store.users.find((user) => user.email === email);
  if (existing) {
    return { ok: false, status: 409, error: "An account already exists for this email." };
  }

  const user = {
    id: crypto.randomUUID(),
    name: String(credentials.name).trim(),
    email,
    passwordHash: await hashPassword(String(credentials.password)),
    role: store.users.length === 0 ? "admin" : "user",
    createdAt: new Date().toISOString(),
  };
  const session = createSession(user.id);

  store.users.push(user);
  store.sessions.push(session);
  await writeStore(usersPath, store);

  return { ok: true, status: 201, user: publicUser(user), token: session.token };
}

export async function loginUser(usersPath, credentials) {
  const validationError = validateCredentials(credentials);
  if (validationError) {
    return { ok: false, status: 400, error: validationError };
  }

  const store = await readStore(usersPath);
  const email = normalizeEmail(credentials.email);
  const user = store.users.find((item) => item.email === email);
  const passwordMatches = user && (await verifyPassword(String(credentials.password), user.passwordHash));
  if (!passwordMatches) {
    return { ok: false, status: 401, error: "Invalid email or password." };
  }

  const now = Date.now();
  const session = createSession(user.id);
  store.sessions = store.sessions.filter((item) => new Date(item.expiresAt).getTime() > now);
  store.sessions.push(session);
  await writeStore(usersPath, store);

  return { ok: true, status: 200, user: publicUser(user), token: session.token };
}

export async function getSessionUser(usersPath, token) {
  if (!token) return null;

  const store = await readStore(usersPath);
  const now = Date.now();
  const activeSessions = store.sessions.filter((session) => new Date(session.expiresAt).getTime() > now);
  const session = activeSessions.find((item) => item.token === token);

  if (activeSessions.length !== store.sessions.length) {
    store.sessions = activeSessions;
    await writeStore(usersPath, store);
  }

  if (!session) return null;

  const user = store.users.find((item) => item.id === session.userId);
  return user ? publicUser(user) : null;
}

export async function logoutUser(usersPath, token) {
  if (!token) return;

  const store = await readStore(usersPath);
  store.sessions = store.sessions.filter((session) => session.token !== token);
  await writeStore(usersPath, store);
}
