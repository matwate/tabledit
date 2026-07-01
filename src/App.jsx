import {
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@suid/material";
import { ContentCopy } from "@suid/icons-material";
import { makePersisted } from "@solid-primitives/storage";
import { createStore, reconcile } from "solid-js/store";
import { createSignal, onMount } from "solid-js";

// ponytail: read backend origin from env; fallback to dev default
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiAdd = async (type, text) => {
  try {
    const res = await fetch(
      `${API}/data/${type}?text=${encodeURIComponent(text)}`,
      { method: "PUT" },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("apiAdd failed:", e);
  }
};
const apiDel = async (type, text) => {
  try {
    const res = await fetch(
      `${API}/data/${type}?text=${encodeURIComponent(text)}`,
      { method: "DELETE" },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("apiDel failed:", e);
  }
};
import {
  DiagnosticoCard,
  PdaCard,
  AvanceCard,
  EbDataCard,
  SiteOwnersCard,
  TextosRapidosCard,
} from "./components";

const App = () => {
  const getTodayDate = () => {
    return new Date();
  };

  const dateToIso = (date) => {
    if (!date) return "";
    return date.toISOString();
  };

  const isoToInputDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const inputDateToIso = (inputDate) => {
    if (!inputDate) return "";
    const date = new Date(inputDate);
    return date.toISOString();
  };

  const defaultData = {
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

  const [data, setData] = makePersisted(createStore(defaultData), {
    name: "tabledit_data",
    // ponytail: merge stored data over deep-cloned defaults so new fields
    // survive migrations; plain reconcile removes keys missing from storage.
    deserialize: (raw) => {
      const stored = JSON.parse(raw);
      const merged = JSON.parse(JSON.stringify(defaultData));
      for (const key of Object.keys(stored)) {
        if (stored[key] != null) merged[key] = stored[key];
      }
      return merged;
    },
  });

  onMount(async () => {
    try {
      const res = await fetch(`${API}/data`);
      const remote = await res.json();
      // ponytail: union-merge per field; only setData when remote has items
      // local lacks — avoids replacing array refs that equal local, which is
      // what triggers the <For> re-render / white flicker on every load.
      const fields = [
        ["diagnosticoQuickPhrases", remote.diagnostico],
        ["pdaQuickPhrases", remote.pda],
        ["avanceQuickPhrases", remote.avance],
        ["siteOwners", remote.site_owners],
        ["ebs", remote.ebs],
        ["otherQuickPhrases", remote.other],
      ];
      for (const [key, remoteList] of fields) {
        if (!Array.isArray(remoteList)) continue;
        const local = data[key];
        const seen = new Set(local);
        const additions = remoteList.filter((v) => !seen.has(v));
        if (additions.length) setData(key, [...local, ...additions]);
      }
    } catch (e) {
      // offline: keep local store
    }
  });

  const [newSiteOwner, setNewSiteOwner] = createSignal("");

  const [newDiagnosticoPhrase, setNewDiagnosticoPhrase] = createSignal("");
  const [newPdaPhrase, setNewPdaPhrase] = createSignal("");
  const [newAvancePhrase, setNewAvancePhrase] = createSignal("");
  const [newOtherPhrase, setNewOtherPhrase] = createSignal("");
  const [modalOpen, setModalOpen] = createSignal(false);
  const [modalMessage, setModalMessage] = createSignal("");

  const navigateNext = () => {
    const nextId = data.currentAvance + 1;
    setData("currentAvance", nextId);
    setData("avances", (prev) => {
      if (!prev.find((a) => a.id === nextId)) {
        return [
          ...prev,
          {
            id: nextId,
            text: "",
            date: dateToIso(getTodayDate()),
          },
        ];
      }
      return prev;
    });
  };

  const navigatePrevious = () => {
    setData("currentAvance", (prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  const deleteAvance = () => {
    if (data.currentAvance >= 2) {
      setData("avances", (prev) =>
        prev.filter((a) => a.id < data.currentAvance),
      );
      setData("currentAvance", 1);
    }
  };

  const getCurrentAvanceText = () => {
    const avance = data.avances.find((a) => a.id === data.currentAvance);
    return avance ? avance.text : "";
  };

  const updateCurrentAvanceText = (value) => {
    setData("avances", (prev) =>
      prev.map((a) =>
        a.id === data.currentAvance ? { ...a, text: value } : a,
      ),
    );
  };

  const getCurrentAvanceDate = () => {
    const avance = data.avances.find((a) => a.id === data.currentAvance);
    return avance ? isoToInputDate(avance.date) : "";
  };

  const updateCurrentAvanceDate = (e) => {
    const inputValue = e.target.value;
    setData("avances", (prev) =>
      prev.map((a) =>
        a.id === data.currentAvance
          ? { ...a, date: inputDateToIso(inputValue) }
          : a,
      ),
    );
  };

  const addAvanceQuickPhrase = () => {
    if (newAvancePhrase().trim()) {
      apiAdd("avance", newAvancePhrase());
      setData("avanceQuickPhrases", (prev) => [...prev, newAvancePhrase()]);
      setNewAvancePhrase("");
    }
  };

  const deleteAvanceQuickPhrase = (index) => {
    const phrase = data.avanceQuickPhrases[index];
    apiDel("avance", phrase);
    setData("avanceQuickPhrases", (prev) => prev.filter((_, i) => i !== index));
  };

  const deleteDiagnosticoPhrase = (index) => {
    const phrase = data.diagnosticoQuickPhrases[index];
    apiDel("diagnostico", phrase);
    setData("diagnosticoQuickPhrases", (prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const addDiagnosticoPhrase = () => {
    if (newDiagnosticoPhrase().trim()) {
      apiAdd("diagnostico", newDiagnosticoPhrase());
      setData("diagnosticoQuickPhrases", (prev) => [
        ...prev,
        newDiagnosticoPhrase(),
      ]);
      setNewDiagnosticoPhrase("");
    }
  };

  const deletePdaPhrase = (index) => {
    const phrase = data.pdaQuickPhrases[index];
    apiDel("pda", phrase);
    setData("pdaQuickPhrases", (prev) => prev.filter((_, i) => i !== index));
  };

  const addPdaPhrase = () => {
    if (newPdaPhrase().trim()) {
      apiAdd("pda", newPdaPhrase());
      setData("pdaQuickPhrases", (prev) => [...prev, newPdaPhrase()]);
      setNewPdaPhrase("");
    }
  };

  const addOtherPhrase = () => {
    if (newOtherPhrase().trim()) {
      apiAdd("other", newOtherPhrase());
      setData("otherQuickPhrases", (prev) => [...prev, newOtherPhrase()]);
      setNewOtherPhrase("");
    }
  };

  const deleteOtherPhrase = (index) => {
    const phrase = data.otherQuickPhrases[index];
    apiDel("other", phrase);
    setData("otherQuickPhrases", (prev) => prev.filter((_, i) => i !== index));
  };

  const copyOtherPhrase = (phrase) => {
    navigator.clipboard
      .writeText(phrase)
      .then(() => {
        setModalMessage("Copiado!");
        setModalOpen(true);
      })
      .catch((err) => {
        setModalMessage(`Error al copiar: ${err.message}`);
        setModalOpen(true);
      });
  };

  const clearDiagnostico = () => {
    setData("diagnostico", "");
  };

  const copyToClipboard = () => {
    const currentAvanceObj = data.avances.find(
      (a) => a.id === data.currentAvance,
    );
    const textToCopy = [
      data.diagnostico ? `Diagnostico: ${data.diagnostico}` : null,
      data.pda ? `PDA: ${data.pda}` : null,
      currentAvanceObj?.text
        ? `Avance ${currentAvanceObj.id} (${currentAvanceObj.date ? new Date(currentAvanceObj.date).toLocaleDateString() : "sin fecha"}): ${currentAvanceObj.text}`
        : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    if (!textToCopy) {
      setModalMessage("No hay nada que copiar");
      setModalOpen(true);
      return;
    }

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setModalMessage("Copiado al portapapeles!");
        setModalOpen(true);
      })
      .catch((err) => {
        setModalMessage(`Error al copiar: ${err.message}`);
        setModalOpen(true);
      });
  };

  const copyDiagnostico = () => {
    if (!data.diagnostico) {
      setModalMessage("No Diagnostico to copy");
      setModalOpen(true);
      return;
    }
    navigator.clipboard
      .writeText(data.diagnostico)
      .then(() => {
        setModalMessage("Diagnostico copied!");
        setModalOpen(true);
      })
      .catch((err) => {
        setModalMessage(`Failed to copy: ${err.message}`);
        setModalOpen(true);
      });
  };

  const clearPda = () => {
    setData("pda", "");
  };

  const copyPda = () => {
    if (!data.pda) {
      setModalMessage("No Pda to copy");
      setModalOpen(true);
      return;
    }
    navigator.clipboard
      .writeText(data.pda)
      .then(() => {
        setModalMessage("Pda copied!");
        setModalOpen(true);
      })
      .catch((err) => {
        setModalMessage(`Failed to copy: ${err.message}`);
        setModalOpen(true);
      });
  };

  const clearCurrentAvanceText = () => {
    updateCurrentAvanceText("");
  };

  const copyCurrentAvance = () => {
    const avance = data.avances.find((a) => a.id === data.currentAvance);
    if (!avance || !avance.text.trim()) {
      setModalMessage("No Avance text to copy");
      setModalOpen(true);
      return;
    }
    if (!avance.date) {
      setModalMessage("Cannot copy: Avance missing date");
      setModalOpen(true);
      return;
    }
    const dateObj = new Date(avance.date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const dateDisplay = `${day}-${month}-${year}`;
    const text = `Avance ${avance.id}: ${dateDisplay} ${avance.text}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setModalMessage("Avance copied!");
        setModalOpen(true);
      })
      .catch((err) => {
        setModalMessage(`Failed to copy: ${err.message}`);
        setModalOpen(true);
      });
  };

  const clearAllData = () => {
    setData("currentAvance", 1);
    setData("avances", [{ id: 1, text: "", date: dateToIso(getTodayDate()) }]);
    setData("diagnostico", "");
    setData("pda", "");
    setData("ebData", []);
  };

  const addEbRow = () => {
    setData("ebData", (prev) => [
      ...prev,
      { id: Date.now(), eb: "", so1: "", so2: "", actividad: "" },
    ]);
  };

  const removeEbRow = (index) => {
    setData("ebData", (prev) => prev.filter((_, i) => i !== index));
  };

  const clearEbRow = (index) => {
    setData("ebData", index, { eb: "", so1: "", so2: "", actividad: "" });
  };

  const updateEbRow = (index, field, value) => {
    setData("ebData", index, field, value);
    if (field === "eb" && value && !data.ebs?.includes(value)) {
      apiAdd("ebs", value);
      setData("ebs", (prev) => [...(prev || []), value]);
    }
  };

  const addSiteOwner = () => {
    if (newSiteOwner().trim()) {
      apiAdd("site_owners", newSiteOwner());
      setData("siteOwners", (prev) => [...prev, newSiteOwner()]);
      setNewSiteOwner("");
    }
  };

  const removeSiteOwner = (index) => {
    const name = data.siteOwners[index];
    apiDel("site_owners", name);
    setData("siteOwners", (prev) => prev.filter((_, i) => i !== index));
  };

  const copyEbData = () => {
    if (data.ebData.length === 0) {
      setModalMessage("No EB data to copy");
      setModalOpen(true);
      return;
    }
    const nonEmptyRows = data.ebData.filter(
      (row) => row.eb || row.so1 || row.so2 || row.actividad,
    );
    if (nonEmptyRows.length === 0) {
      setModalMessage("No EB data to copy");
      setModalOpen(true);
      return;
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
    navigator.clipboard
      .writeText(
        `*PARA MAÑANA: ${tomorrow.toISOString().split("T")[0]}*\n`.concat(
          textToCopy,
        ),
      )
      .then(() => {
        setModalMessage("EB data copied!");
        setModalOpen(true);
      })
      .catch((err) => {
        setModalMessage(`Failed to copy: ${err.message}`);
        setModalOpen(true);
      });
  };

  return (
    <>
      <div className="w-full flex justify-between items-center p-4 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">Tabledit</h1>
        <div className="flex gap-2">
          <Button variant="contained" color="error" onClick={clearAllData}>
            Clear All
          </Button>
          <Button variant="contained" color="primary" onClick={copyToClipboard}>
            <div className="flex items-center justify-between">
              <ContentCopy className="mr-4" />
              Copy
            </div>
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Card sx={{ bgcolor: "#1f2937", p: 2 }}>
          <div className="flex gap-4">
            <DiagnosticoCard
              data={data}
              setData={setData}
              newDiagnosticoPhrase={newDiagnosticoPhrase}
              setNewDiagnosticoPhrase={setNewDiagnosticoPhrase}
              addDiagnosticoPhrase={addDiagnosticoPhrase}
              deleteDiagnosticoPhrase={deleteDiagnosticoPhrase}
              copyDiagnostico={copyDiagnostico}
              clearDiagnostico={clearDiagnostico}
            />
            <PdaCard
              data={data}
              setData={setData}
              newPdaPhrase={newPdaPhrase}
              setNewPdaPhrase={setNewPdaPhrase}
              addPdaPhrase={addPdaPhrase}
              deletePdaPhrase={deletePdaPhrase}
              copyPda={copyPda}
              clearPda={clearPda}
            />
            <AvanceCard
              data={data}
              navigateNext={navigateNext}
              navigatePrevious={navigatePrevious}
              deleteAvance={deleteAvance}
              getCurrentAvanceText={getCurrentAvanceText}
              updateCurrentAvanceText={updateCurrentAvanceText}
              getCurrentAvanceDate={getCurrentAvanceDate}
              updateCurrentAvanceDate={updateCurrentAvanceDate}
              addAvanceQuickPhrase={addAvanceQuickPhrase}
              deleteAvanceQuickPhrase={deleteAvanceQuickPhrase}
              newAvancePhrase={newAvancePhrase}
              setNewAvancePhrase={setNewAvancePhrase}
              copyCurrentAvance={copyCurrentAvance}
              clearCurrentAvanceText={clearCurrentAvanceText}
            />
          </div>
          <div className="flex gap-4 mt-2 w-full">
            <EbDataCard
              data={data}
              addEbRow={addEbRow}
              removeEbRow={removeEbRow}
              updateEbRow={updateEbRow}
              copyEbData={copyEbData}
              clearEbRow={clearEbRow}
            />
            <SiteOwnersCard
              data={data}
              newSiteOwner={newSiteOwner}
              setNewSiteOwner={setNewSiteOwner}
              addSiteOwner={addSiteOwner}
              removeSiteOwner={removeSiteOwner}
            />
          </div>
          <div className="mt-2 w-full">
            <TextosRapidosCard
              data={data}
              newOtherPhrase={newOtherPhrase}
              setNewOtherPhrase={setNewOtherPhrase}
              addOtherPhrase={addOtherPhrase}
              deleteOtherPhrase={deleteOtherPhrase}
              copyOtherPhrase={copyOtherPhrase}
            />
          </div>
        </Card>
      </div>

      <Dialog
        open={modalOpen()}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notice</DialogTitle>
        <DialogContent>
          <DialogContentText>{modalMessage()}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default App;
