export interface Avance {
  id: number;
  text: string;
  date: string;
}

export interface EbRow {
  id: number;
  eb: string;
  so1: string;
  so2: string;
  actividad: string;
}

export interface AppData {
  currentAvance: number;
  avances: Avance[];
  diagnostico: string;
  pda: string;
  diagnosticoQuickPhrases: string[];
  pdaQuickPhrases: string[];
  avanceQuickPhrases: string[];
  ebData: EbRow[];
  siteOwners: string[];
  ebs: string[];
  otherQuickPhrases: string[];
}

export type StoreType =
  | "diagnostico"
  | "pda"
  | "avance"
  | "other"
  | "ebs"
  | "site_owners";
