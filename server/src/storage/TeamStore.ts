import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export interface StoredTeam {
  id: string;
  name: string;
  platform: 'GitHub' | 'Jira';
  url: string;
  apiToken?: string;
  jiraEmail?: string;
  projectKey?: string;
  status: 'Active' | 'Inactive';
  addedAt: string;
  lastSynced?: string;
}

export class TeamStore {
  private filePath: string;
  private teams: StoredTeam[];

  constructor(dataDir: string) {
    const resolved = path.resolve(dataDir);
    if (!fs.existsSync(resolved)) {
      fs.mkdirSync(resolved, { recursive: true });
    }
    this.filePath = path.join(resolved, 'teams.json');
    this.teams = [];
    this.load();
  }

  getAll(): StoredTeam[] {
    return this.teams;
  }

  getById(id: string): StoredTeam | undefined {
    return this.teams.find((t) => t.id === id);
  }

  create(data: Omit<StoredTeam, 'id' | 'addedAt'>): StoredTeam {
    const team: StoredTeam = {
      ...data,
      id: randomUUID(),
      addedAt: new Date().toISOString(),
    };
    this.teams.push(team);
    this.save();
    return team;
  }

  update(id: string, data: Partial<StoredTeam>): StoredTeam | null {
    const idx = this.teams.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.teams[idx] = { ...this.teams[idx], ...data, id };
    this.save();
    return this.teams[idx];
  }

  delete(id: string): boolean {
    const idx = this.teams.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.teams.splice(idx, 1);
    this.save();
    return true;
  }

  private save(): void {
    fs.writeFileSync(this.filePath, JSON.stringify(this.teams, null, 2), 'utf-8');
  }

  private load(): void {
    if (!fs.existsSync(this.filePath)) {
      this.teams = [];
      return;
    }
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      this.teams = JSON.parse(raw);
    } catch {
      this.teams = [];
    }
  }
}
