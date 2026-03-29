import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import bcrypt from "bcryptjs";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  createdAt: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf8");
  }
}

async function readUsers(): Promise<StoredUser[]> {
  await ensureStore();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  const parsed = JSON.parse(raw) as StoredUser[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

async function ensureDemoUser(users: StoredUser[]): Promise<StoredUser[]> {
  const demoEmail = normalizeEmail(process.env.DEMO_USER_EMAIL || "demo@autodiag.app");
  const demoPassword = process.env.DEMO_USER_PASSWORD || "Demo@12345";

  if (users.some((user) => normalizeEmail(user.email) === demoEmail)) {
    return users;
  }

  const passwordHash = await bcrypt.hash(demoPassword, 10);
  const seededUser: StoredUser = {
    id: randomUUID(),
    name: "Demo User",
    email: demoEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  const nextUsers = [seededUser, ...users];
  await writeUsers(nextUsers);
  return nextUsers;
}

export async function getAllUsers(): Promise<StoredUser[]> {
  const users = await readUsers();
  return ensureDemoUser(users);
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const users = await getAllUsers();
  const normalized = normalizeEmail(email);
  return users.find((user) => normalizeEmail(user.email) === normalized) || null;
}

export async function validateCredentials(email: string, password: string): Promise<StoredUser | null> {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  return passwordMatches ? user : null;
}

export async function createUser(payload: SignupPayload): Promise<StoredUser> {
  const users = await getAllUsers();
  const email = normalizeEmail(payload.email);

  if (users.some((user) => normalizeEmail(user.email) === email)) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user: StoredUser = {
    id: randomUUID(),
    name: payload.name.trim(),
    email,
    passwordHash,
    phone: payload.phone?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);
  return user;
}
