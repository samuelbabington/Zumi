import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

/**
 * Tiny user store on Node's built-in SQLite (no native deps).
 * The file lives in ./data (git-ignored). Swap this module for a hosted
 * database (Postgres, Turso, …) before deploying to serverless hosting,
 * where the filesystem is not persistent.
 */
const file = process.env.DATABASE_FILE ?? path.join(process.cwd(), "data", "zumi.db");
mkdirSync(path.dirname(file), { recursive: true });

const globalForDb = globalThis as unknown as { zumiDb?: DatabaseSync };
const db = globalForDb.zumiDb ?? new DatabaseSync(file);
globalForDb.zumiDb = db;

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    email         TEXT UNIQUE COLLATE NOCASE,
    username      TEXT UNIQUE COLLATE NOCASE,
    name          TEXT,
    avatar_url    TEXT,
    password_hash TEXT,
    google_sub    TEXT UNIQUE,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export type UserRow = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  avatar_url: string | null;
  password_hash: string | null;
  google_sub: string | null;
  created_at: string;
};

export function findUserById(id: string) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
}

/** Looks a user up by email or username (case-insensitive). */
export function findUserByLogin(login: string) {
  return db
    .prepare("SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1")
    .get(login, login) as UserRow | undefined;
}

export function findUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
}

export function findUserByGoogleSub(sub: string) {
  return db.prepare("SELECT * FROM users WHERE google_sub = ?").get(sub) as UserRow | undefined;
}

export function isUsernameTaken(username: string) {
  return !!db.prepare("SELECT 1 FROM users WHERE username = ?").get(username);
}

export function isEmailTaken(email: string) {
  return !!db.prepare("SELECT 1 FROM users WHERE email = ?").get(email);
}

export function createUser(u: {
  email?: string | null;
  username?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  passwordHash?: string | null;
  googleSub?: string | null;
}) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO users (id, email, username, name, avatar_url, password_hash, google_sub)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    u.email ?? null,
    u.username ?? null,
    u.name ?? null,
    u.avatarUrl ?? null,
    u.passwordHash ?? null,
    u.googleSub ?? null,
  );
  return findUserById(id)!;
}

export function linkGoogle(id: string, sub: string, avatarUrl: string | null) {
  db.prepare("UPDATE users SET google_sub = ?, avatar_url = COALESCE(avatar_url, ?) WHERE id = ?").run(
    sub,
    avatarUrl,
    id,
  );
}
