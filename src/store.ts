import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppData, EbRow, StoreType } from "./types";

// ponytail: read backend origin from env; fallback to dev default
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STORAGE_KEY = "tabledit_react_data";

const getTodayDate = () => new Date();
const dateToIso = (date: Date) => date.toISOString();

const isoToInputDate = (isoDate: string) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const inputDateToIso = (inputDate: string) => {
  if (!inputDate) return "";
  const date = new Date(inputDate);
  return date.toISOString();
};

const defaultData: AppData = {
  currentAvance: 1,
  avances: [{ id: 1, text: "", date: dateToIso(getTodayDate()) }],
  diagnostico: "",
  pda: "",
  diagnosticoQuickPhrases: [
    "Sin Respuesta al Ping",
    "No detecta Modulos de RF/FPFH",
    "Alarmas de energia Activas",
    "Actividad de modernizacion en curso",
  ],
  pdaQuickPhrases: [
    "Actividad programada para el dia de hoy",
    "Se debe verificar condiciones locales de Energia y TX ",
    "Se debe tramitar el permiso de ingreso con el area de seguridad",
  ],
  avanceQuickPhrases: [],
  ebData: [],
  siteOwners: [],
  ebs: [],
  otherQuickPhrases: [],
};

interface RemoteData {
  diagnostico?: string[];
  pda?: string[];
  avance?: string[];
  site_owners?: string[];
  ebs?: string[];
  other?: string[];
}

const apiAdd = async (type: StoreType, text: string) => {
  const res = await fetch(
    `${API}/data/${type}?text=${encodeURIComponent(text)}`,
    { method: "PUT" },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};

const apiDel = async (type: StoreType, text: string) => {
  const res = await fetch(
    `${API}/data/${type}?text=${encodeURIComponent(text)}`,
    { method: "DELETE" },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};

const writeClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

// ponytail: sort + dedupe at the source so display order == stored order;
// keeps index-based delete correct and matches backend sorted(set(...)).
const sortedUnique = (list: string[]) =>
  Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));

interface StoreState extends AppData {
  error: string | null;
  newDiagnosticoPhrase: string;
  newPdaPhrase: string;
  newAvancePhrase: string;
  newOtherPhrase: string;
  newSiteOwner: string;

  setError: (error: string | null) => void;

  setDiagnostico: (value: string) => void;
  setPda: (value: string) => void;
  setNewDiagnosticoPhrase: (value: string) => void;
  setNewPdaPhrase: (value: string) => void;
  setNewAvancePhrase: (value: string) => void;
  setNewOtherPhrase: (value: string) => void;
  setNewSiteOwner: (value: string) => void;

  navigateNext: () => void;
  navigatePrevious: () => void;
  deleteAvance: () => void;
  updateCurrentAvanceText: (value: string) => void;
  updateCurrentAvanceDate: (value: string) => void;

  addDiagnosticoPhrase: () => void;
  deleteDiagnosticoPhrase: (index: number) => void;
  addPdaPhrase: () => void;
  deletePdaPhrase: (index: number) => void;
  addAvanceQuickPhrase: () => void;
  deleteAvanceQuickPhrase: (index: number) => void;
  addOtherPhrase: () => void;
  deleteOtherPhrase: (index: number) => void;
  copyOtherPhrase: (phrase: string) => void;

  addEbRow: () => void;
  removeEbRow: (index: number) => void;
  clearEbRow: (index: number) => void;
  updateEbRow: (index: number, field: keyof EbRow, value: string) => void;

  addSiteOwner: () => void;
  removeSiteOwner: (index: number) => void;
  resetEbs: () => void;

  clearDiagnostico: () => void;
  clearPda: () => void;
  clearCurrentAvanceText: () => void;
  clearAllData: () => void;

  copyToClipboard: () => Promise<void>;
  copyDiagnostico: () => Promise<void>;
  copyPda: () => Promise<void>;
  copyCurrentAvance: () => Promise<void>;
  copyEbData: () => Promise<void>;

  getCurrentAvanceText: () => string;
  getCurrentAvanceDate: () => string;

  syncRemote: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...defaultData,
      error: null,
      newDiagnosticoPhrase: "",
      newPdaPhrase: "",
      newAvancePhrase: "",
      newOtherPhrase: "",
      newSiteOwner: "",

      setError: (error) => set({ error }),

      setDiagnostico: (diagnostico) => set({ diagnostico }),
      setPda: (pda) => set({ pda }),
      setNewDiagnosticoPhrase: (newDiagnosticoPhrase) =>
        set({ newDiagnosticoPhrase }),
      setNewPdaPhrase: (newPdaPhrase) => set({ newPdaPhrase }),
      setNewAvancePhrase: (newAvancePhrase) => set({ newAvancePhrase }),
      setNewOtherPhrase: (newOtherPhrase) => set({ newOtherPhrase }),
      setNewSiteOwner: (newSiteOwner) => set({ newSiteOwner }),

      navigateNext: () => {
        const { currentAvance, avances } = get();
        const nextId = currentAvance + 1;
        set({ currentAvance: nextId });
        if (!avances.find((a) => a.id === nextId)) {
          set({
            avances: [
              ...avances,
              { id: nextId, text: "", date: dateToIso(getTodayDate()) },
            ],
          });
        }
      },

      navigatePrevious: () => {
        set((state) => ({
          currentAvance: state.currentAvance > 1 ? state.currentAvance - 1 : 1,
        }));
      },

      deleteAvance: () => {
        const { currentAvance, avances } = get();
        if (currentAvance >= 2) {
          set({
            avances: avances.filter((a) => a.id < currentAvance),
            currentAvance: 1,
          });
        }
      },

      updateCurrentAvanceText: (value) => {
        const { currentAvance, avances } = get();
        set({
          avances: avances.map((a) =>
            a.id === currentAvance ? { ...a, text: value } : a,
          ),
        });
      },

      updateCurrentAvanceDate: (value) => {
        const { currentAvance, avances } = get();
        set({
          avances: avances.map((a) =>
            a.id === currentAvance
              ? { ...a, date: inputDateToIso(value) }
              : a,
          ),
        });
      },

      addDiagnosticoPhrase: () => {
        const { newDiagnosticoPhrase, diagnosticoQuickPhrases } = get();
        const text = newDiagnosticoPhrase.trim();
        if (!text) return;
        apiAdd("diagnostico", text).catch((e) =>
          set({ error: `Failed to save diagnostico phrase: ${e.message}` }),
        );
        set({
          diagnosticoQuickPhrases: sortedUnique([...diagnosticoQuickPhrases, text]),
          newDiagnosticoPhrase: "",
        });
      },

      deleteDiagnosticoPhrase: (index) => {
        const { diagnosticoQuickPhrases } = get();
        const phrase = diagnosticoQuickPhrases[index];
        apiDel("diagnostico", phrase).catch((e) =>
          set({ error: `Failed to delete diagnostico phrase: ${e.message}` }),
        );
        set({
          diagnosticoQuickPhrases: diagnosticoQuickPhrases.filter(
            (_, i) => i !== index,
          ),
        });
      },

      addPdaPhrase: () => {
        const { newPdaPhrase, pdaQuickPhrases } = get();
        const text = newPdaPhrase.trim();
        if (!text) return;
        apiAdd("pda", text).catch((e) =>
          set({ error: `Failed to save PDA phrase: ${e.message}` }),
        );
        set({ pdaQuickPhrases: sortedUnique([...pdaQuickPhrases, text]), newPdaPhrase: "" });
      },

      deletePdaPhrase: (index) => {
        const { pdaQuickPhrases } = get();
        const phrase = pdaQuickPhrases[index];
        apiDel("pda", phrase).catch((e) =>
          set({ error: `Failed to delete PDA phrase: ${e.message}` }),
        );
        set({
          pdaQuickPhrases: pdaQuickPhrases.filter((_, i) => i !== index),
        });
      },

      addAvanceQuickPhrase: () => {
        const { newAvancePhrase, avanceQuickPhrases } = get();
        const text = newAvancePhrase.trim();
        if (!text) return;
        apiAdd("avance", text).catch((e) =>
          set({ error: `Failed to save avance phrase: ${e.message}` }),
        );
        set({
          avanceQuickPhrases: sortedUnique([...avanceQuickPhrases, text]),
          newAvancePhrase: "",
        });
      },

      deleteAvanceQuickPhrase: (index) => {
        const { avanceQuickPhrases } = get();
        const phrase = avanceQuickPhrases[index];
        apiDel("avance", phrase).catch((e) =>
          set({ error: `Failed to delete avance phrase: ${e.message}` }),
        );
        set({
          avanceQuickPhrases: avanceQuickPhrases.filter((_, i) => i !== index),
        });
      },

      addOtherPhrase: () => {
        const { newOtherPhrase, otherQuickPhrases } = get();
        const text = newOtherPhrase.trim();
        if (!text) return;
        apiAdd("other", text).catch((e) =>
          set({ error: `Failed to save quick text: ${e.message}` }),
        );
        set({
          otherQuickPhrases: sortedUnique([...otherQuickPhrases, text]),
          newOtherPhrase: "",
        });
      },

      deleteOtherPhrase: (index) => {
        const { otherQuickPhrases } = get();
        const phrase = otherQuickPhrases[index];
        apiDel("other", phrase).catch((e) =>
          set({ error: `Failed to delete quick text: ${e.message}` }),
        );
        set({
          otherQuickPhrases: otherQuickPhrases.filter((_, i) => i !== index),
        });
      },

      copyOtherPhrase: async (phrase) => {
        await writeClipboard(phrase);
        set({ error: "Copiado!" });
      },

      addEbRow: () => {
        set((state) => ({
          ebData: [
            ...state.ebData,
            { id: Date.now(), eb: "", so1: "", so2: "", actividad: "" },
          ],
        }));
      },

      removeEbRow: (index) => {
        set((state) => ({
          ebData: state.ebData.filter((_, i) => i !== index),
        }));
      },

      clearEbRow: (index) => {
        set((state) => ({
          ebData: state.ebData.map((row, i) =>
            i === index
              ? { id: row.id, eb: "", so1: "", so2: "", actividad: "" }
              : row,
          ),
        }));
      },

      updateEbRow: (index, field, value) => {
        set((state) => {
          const row = { ...state.ebData[index], [field]: value };
          const ebData = [...state.ebData];
          ebData[index] = row;
          const next: Partial<AppData> = { ebData };
          return next as AppData;
        });
      },

      addSiteOwner: () => {
        const { newSiteOwner, siteOwners } = get();
        const text = newSiteOwner.trim();
        if (!text) return;
        apiAdd("site_owners", text).catch((e) =>
          set({ error: `Failed to save site owner: ${e.message}` }),
        );
        set({ siteOwners: sortedUnique([...siteOwners, text]), newSiteOwner: "" });
      },

      removeSiteOwner: (index) => {
        const { siteOwners } = get();
        const name = siteOwners[index];
        apiDel("site_owners", name).catch((e) =>
          set({ error: `Failed to delete site owner: ${e.message}` }),
        );
        set({ siteOwners: siteOwners.filter((_, i) => i !== index) });
      },

      resetEbs: () => {
        const { ebs } = get();
        for (const name of ebs) {
          apiDel("ebs", name).catch((e) =>
            set({ error: `Failed to delete EB: ${e.message}` }),
          );
        }
        set({ ebs: [] });
      },

      clearDiagnostico: () => set({ diagnostico: "" }),
      clearPda: () => set({ pda: "" }),
      clearCurrentAvanceText: () => {
        const { currentAvance, avances } = get();
        set({
          avances: avances.map((a) =>
            a.id === currentAvance ? { ...a, text: "" } : a,
          ),
        });
      },

      clearAllData: () =>
        set({
          currentAvance: 1,
          avances: [{ id: 1, text: "", date: dateToIso(getTodayDate()) }],
          diagnostico: "",
          pda: "",
          ebData: [],
        }),

      copyToClipboard: async () => {
        const { currentAvance, avances, diagnostico, pda } = get();
        const today = dateToIso(getTodayDate());
        const currentAvanceObj = avances.find((a) => a.id === currentAvance);
        if (!currentAvanceObj) return;

        const updatedAvance = { ...currentAvanceObj, date: today };
        set({
          avances: avances.map((a) =>
            a.id === currentAvance ? updatedAvance : a,
          ),
        });

        const textToCopy = [
          diagnostico ? `Diagnostico: ${diagnostico}` : null,
          pda ? `PDA: ${pda}` : null,
          updatedAvance.text
            ? `Avance ${updatedAvance.id} (${updatedAvance.date ? new Date(updatedAvance.date).toLocaleDateString() : "sin fecha"}): ${updatedAvance.text}`
            : null,
        ]
          .filter(Boolean)
          .join("\n\n");

        if (!textToCopy) {
          set({ error: "No hay nada que copiar" });
          return;
        }

        await writeClipboard(textToCopy);
        set({ error: "Copiado al portapapeles!" });
      },

      copyDiagnostico: async () => {
        const { diagnostico } = get();
        if (!diagnostico) {
          set({ error: "No Diagnostico to copy" });
          return;
        }
        await writeClipboard(diagnostico);
        set({ error: "Diagnostico copied!" });
      },

      copyPda: async () => {
        const { pda } = get();
        if (!pda) {
          set({ error: "No Pda to copy" });
          return;
        }
        await writeClipboard(pda);
        set({ error: "Pda copied!" });
      },

      copyCurrentAvance: async () => {
        const { currentAvance, avances } = get();
        const today = dateToIso(getTodayDate());
        const avance = avances.find((a) => a.id === currentAvance);
        if (!avance || !avance.text.trim()) {
          set({ error: "No Avance text to copy" });
          return;
        }

        const updatedAvance = { ...avance, date: today };
        set({
          avances: avances.map((a) =>
            a.id === currentAvance ? updatedAvance : a,
          ),
        });

        const dateObj = new Date(updatedAvance.date);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        const dateDisplay = `${day}-${month}-${year}`;
        const text = `Avance ${updatedAvance.id}: ${dateDisplay} ${updatedAvance.text}`;

        await writeClipboard(text);
        set({ error: "Avance copied!" });
      },

      copyEbData: async () => {
        const { ebData } = get();
        if (ebData.length === 0) {
          set({ error: "No EB data to copy" });
          return;
        }
        const nonEmptyRows = ebData.filter(
          (row) => row.eb || row.so1 || row.so2 || row.actividad,
        );
        if (nonEmptyRows.length === 0) {
          set({ error: "No EB data to copy" });
          return;
        }
        const { ebs } = get();
        const newEbs = nonEmptyRows
          .map((r) => r.eb.trim())
          .filter((name) => name && !ebs.includes(name));
        if (newEbs.length > 0) {
          for (const name of newEbs) {
            apiAdd("ebs", name).catch((e) =>
              set({ error: `Failed to save EB: ${e.message}` }),
            );
          }
          set({ ebs: sortedUnique([...ebs, ...newEbs]) });
        }
        const textToCopy = nonEmptyRows
          .map(
            (row) =>
              ` EB: *${row.eb || ""}*, SO1: @${row.so1 || ""}, ${row.so2 ? "SO2: @" : ""} ${row.so2 || ""}, Actividad: ${
                row.actividad || ""
              }`,
          )
          .join("\n");
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await writeClipboard(
          `*PARA MAÑANA: ${tomorrow.toISOString().split("T")[0]}*\n`.concat(
            textToCopy,
          ),
        );
        set({ error: "EB data copied!" });
      },

      getCurrentAvanceText: () => {
        const { currentAvance, avances } = get();
        const avance = avances.find((a) => a.id === currentAvance);
        return avance ? avance.text : "";
      },

      getCurrentAvanceDate: () => {
        const { currentAvance, avances } = get();
        const avance = avances.find((a) => a.id === currentAvance);
        return avance ? isoToInputDate(avance.date) : "";
      },

      syncRemote: async () => {
        try {
          const res = await fetch(`${API}/data`);
          const remote = (await res.json()) as RemoteData;
          const fields: [keyof AppData, string[] | undefined][] = [
            ["diagnosticoQuickPhrases", remote.diagnostico],
            ["pdaQuickPhrases", remote.pda],
            ["avanceQuickPhrases", remote.avance],
            ["siteOwners", remote.site_owners],
            ["ebs", remote.ebs],
            ["otherQuickPhrases", remote.other],
          ];
          set((state) => {
            const next = { ...state };
            for (const [key, remoteList] of fields) {
              if (!Array.isArray(remoteList)) continue;
              const local = state[key] as string[];
              const seen = new Set(local);
              const additions = remoteList.filter((v) => !seen.has(v));
              if (additions.length) {
                (next[key] as string[]) = sortedUnique([...local, ...additions]);
              }
            }
            return next;
          });
        } catch {
          // offline: keep local store
        }
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        currentAvance: state.currentAvance,
        avances: state.avances,
        diagnostico: state.diagnostico,
        pda: state.pda,
        diagnosticoQuickPhrases: state.diagnosticoQuickPhrases,
        pdaQuickPhrases: state.pdaQuickPhrases,
        avanceQuickPhrases: state.avanceQuickPhrases,
        ebData: state.ebData,
        siteOwners: state.siteOwners,
        ebs: state.ebs,
        otherQuickPhrases: state.otherQuickPhrases,
      }),
      merge: (persisted, current) => {
        const stored = persisted as Partial<AppData>;
        // ponytail: shallow copy keeps Zustand action functions intact; all
        // persisted fields are top-level arrays/scalars, so deep clone is
        // unnecessary and would strip functions.
        const merged = { ...current };
        for (const key of Object.keys(stored)) {
          const k = key as keyof AppData;
          if (stored[k] != null) merged[k] = stored[k] as never;
        }
        return merged;
      },
    },
  ),
);
