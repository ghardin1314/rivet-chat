import { join } from "path";
import { homedir } from "os";
import { mkdir, unlink, stat } from "fs/promises";

const CREDENTIALS_DIR = join(homedir(), ".rivet-chat");
const CREDENTIALS_FILE = join(CREDENTIALS_DIR, "credentials.json");

interface Credentials {
  authToken?: string;
}

async function ensureCredentialsDir() {
  try {
    const stats = await stat(CREDENTIALS_DIR);
    if (!stats.isDirectory()) {
      // It's a file, remove it
      await unlink(CREDENTIALS_DIR);
      await mkdir(CREDENTIALS_DIR, { recursive: true });
    }
  } catch {
    // Doesn't exist, create it
    await mkdir(CREDENTIALS_DIR, { recursive: true });
  }
}

export async function saveAuthToken(token: string): Promise<void> {
  await ensureCredentialsDir();
  const credentials: Credentials = { authToken: token };
  await Bun.write(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const file = Bun.file(CREDENTIALS_FILE);
    if (!(await file.exists())) {
      return null;
    }
    const credentials = (await file.json()) as Credentials;
    return credentials.authToken ?? null;
  } catch {
    return null;
  }
}

export async function clearAuthToken(): Promise<void> {
  try {
    const file = Bun.file(CREDENTIALS_FILE);
    if (await file.exists()) {
      await Bun.write(CREDENTIALS_FILE, JSON.stringify({}, null, 2));
    }
  } catch {
    // Ignore errors
  }
}
