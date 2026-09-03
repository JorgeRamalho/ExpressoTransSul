import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'passengers.json');

const EMPTY_DB = { passengers: [] };

async function ensureDb() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DB_FILE, 'utf8');
  } catch {
    await writeFile(DB_FILE, JSON.stringify(EMPTY_DB, null, 2), 'utf8');
  }
}

async function readDb() {
  await ensureDb();
  const raw = await readFile(DB_FILE, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(data) {
  await ensureDb();
  await writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function findPassengerByCpf(cpf) {
  const db = await readDb();
  return db.passengers.find((passenger) => passenger.cpf === cpf) ?? null;
}

export async function findPassengerByEmail(email) {
  const db = await readDb();
  const normalized = email.trim().toLowerCase();
  return db.passengers.find((passenger) => passenger.email === normalized) ?? null;
}

export async function createPassenger(payload) {
  const db = await readDb();
  const passenger = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload,
  };
  db.passengers.push(passenger);
  await writeDb(db);
  return passenger;
}
