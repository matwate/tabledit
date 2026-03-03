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
import { createStore } from "solid-js/store";
import { createSignal } from "solid-js";
import {
  DiagnosticoCard,
  PcaCard,
  AvanceCard,
  EbDataCard,
  SiteOwnersCard,
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

  const [data, setData] = makePersisted(
    createStore({
      currentAvance: 1,
      avances: [{ id: 1, text: "", date: dateToIso(getTodayDate()) }],
      diagnostico: "",
      pca: "",
      diagnosticoQuickPhrases: [
        "Sin Respuesta al Ping",
        "No detecta Modulos de RF/FPFH",
        "Alarmas de energia Activas",
        "Actividad de modernizacion en curso",
      ],
      pcaQuickPhrases: [
        "Actividad programada para el dia de hoy",
        "Se debe verificar condiciones locales de Energia y TX ",
        "Se debe tramitar el permiso de ingreso con el area de seguridad",
      ],
      avanceQuickPhrases: [],
      ebData: [],
      siteOwners: [],
    }),
    { name: "tabledit_data" },
  );

  const [newSiteOwner, setNewSiteOwner] = createSignal("");

  const [newDiagnosticoPhrase, setNewDiagnosticoPhrase] = createSignal("");
  const [newPcaPhrase, setNewPcaPhrase] = createSignal("");
  const [newAvancePhrase, setNewAvancePhrase] = createSignal("");
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
      setData("avanceQuickPhrases", (prev) => [...prev, newAvancePhrase()]);
      setNewAvancePhrase("");
    }
  };

  const deleteAvanceQuickPhrase = (index) => {
    setData("avanceQuickPhrases", (prev) => prev.filter((_, i) => i !== index));
  };

  const deleteDiagnosticoPhrase = (index) => {
    setData("diagnosticoQuickPhrases", (prev) => prev.filter((_, i) => i !== index));
  };

  const addDiagnosticoPhrase = () => {
    if (newDiagnosticoPhrase().trim()) {
      setData("diagnosticoQuickPhrases", (prev) => [...prev, newDiagnosticoPhrase()]);
      setNewDiagnosticoPhrase("");
    }
  };

  const deletePcaPhrase = (index) => {
    setData("pcaQuickPhrases", (prev) => prev.filter((_, i) => i !== index));
  };

  const addPcaPhrase = () => {
    if (newPcaPhrase().trim()) {
      setData("pcaQuickPhrases", (prev) => [...prev, newPcaPhrase()]);
      setNewPcaPhrase("");
    }
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
      data.pca ? `PCA: ${data.pca}` : null,
      currentAvanceObj?.text
        ? `Avance (${currentAvanceObj.date ? new Date(currentAvanceObj.date).toLocaleDateString() : "sin fecha"}): ${currentAvanceObj.text}`
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

  const clearPca = () => {
    setData("pca", "");
  };

  const copyPca = () => {
    if (!data.pca) {
      setModalMessage("No Pca to copy");
      setModalOpen(true);
      return;
    }
    navigator.clipboard
      .writeText(data.pca)
      .then(() => {
        setModalMessage("Pca copied!");
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
    setData("pca", "");
    setData("ebData", []);
    setData("siteOwners", []);
  };

  const addEbRow = () => {
    setData("ebData", (prev) => [...prev, { id: Date.now(), eb: "", so1: "", so2: "", actividad: "" }]);
  };

  const removeEbRow = (index) => {
    setData("ebData", (prev) => prev.filter((_, i) => i !== index));
  };

  const clearEbRow = (index) => {
    setData("ebData", index, { eb: "", so1: "", so2: "", actividad: "" });
  };

  const updateEbRow = (index, field, value) => {
    setData("ebData", index, field, value);
  };

  const addSiteOwner = () => {
    if (newSiteOwner().trim()) {
      setData("siteOwners", (prev) => [...prev, newSiteOwner()]);
      setNewSiteOwner("");
    }
  };

  const removeSiteOwner = (index) => {
    setData("siteOwners", (prev) => prev.filter((_, i) => i !== index));
  };

  const copyEbData = () => {
    if (data.ebData.length === 0) {
      setModalMessage("No EB data to copy");
      setModalOpen(true);
      return;
    }
    const nonEmptyRows = data.ebData.filter(
      (row) => row.eb || row.so1 || row.so2 || row.actividad
    );
    if (nonEmptyRows.length === 0) {
      setModalMessage("No EB data to copy");
      setModalOpen(true);
      return;
    }
    const textToCopy = nonEmptyRows
      .map(
        (row) =>
          `EB: ${row.eb || ""}, SO1: ${row.so1 || ""}, SO2: ${row.so2 || ""}, Actividad: ${
            row.actividad || ""
          }`,
      )
      .join("\n");
    navigator.clipboard
      .writeText(textToCopy)
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
            <PcaCard
              data={data}
              setData={setData}
              newPcaPhrase={newPcaPhrase}
              setNewPcaPhrase={setNewPcaPhrase}
              addPcaPhrase={addPcaPhrase}
              deletePcaPhrase={deletePcaPhrase}
              copyPca={copyPca}
              clearPca={clearPca}
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
          <div className="flex gap-4 mt-2">
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
