import fs from "fs";
import path from "path";
import { IDatabase } from "./interface";

export default class DBClient {
  public static $_instance: (DBClient | null) = null;
  private dbPath: string;

  public static instance() {
    if (!DBClient.$_instance) {
      DBClient.$_instance = new DBClient();
    }
    return DBClient.$_instance;
  }

  private constructor() {
    this.dbPath = path.resolve(__dirname, "../../../../data/db.json");
    if (!fs.existsSync(this.dbPath)) {
      this.dbPath = path.resolve(process.cwd(), "data/db.json");
    }
    if (!fs.existsSync(this.dbPath)) {
      this.dbPath = path.resolve(process.cwd(), "server/data/db.json");
    }
  }

  public readDB(): IDatabase {
    let raw = fs.readFileSync(this.dbPath, "utf-8");
    if (raw.charCodeAt(0) === 0xFEFF) {
      raw = raw.slice(1);
    }
    return JSON.parse(raw);
  }

  public writeDB(db: IDatabase): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(db, null, 2), "utf-8");
  }
}
