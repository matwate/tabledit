import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { useStore } from "./store";
import { useShallow } from "zustand/react/shallow";
import {
  DiagnosticoCard,
  PdaCard,
  AvanceCard,
  EbDataCard,
  SiteOwnersCard,
  TextosRapidosCard,
} from "./components";

function App() {
  const {
    error,
    setError,
    clearAllData,
    copyToClipboard,
    syncRemote,
  } = useStore(
    useShallow((s) => ({
      error: s.error,
      setError: s.setError,
      clearAllData: s.clearAllData,
      copyToClipboard: s.copyToClipboard,
      syncRemote: s.syncRemote,
    })),
  );

  useEffect(() => {
    syncRemote();
  }, [syncRemote]);

  return (
    <>
      <Box
        className="w-full flex justify-between items-center p-4 bg-gray-900 text-white"
        sx={{ bgcolor: "#111827" }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          Tabledit
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" color="error" onClick={clearAllData}>
            Clear All
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={copyToClipboard}
            startIcon={<ContentCopy />}
          >
            Copy
          </Button>
        </Box>
      </Box>

      <Box p={2}>
        <Card className="bg-gray-800" sx={{ p: 2 }}>
          <CardContent>
            <Box display="flex" gap={2} flexWrap="wrap">
              <DiagnosticoCard />
              <PdaCard />
              <AvanceCard />
            </Box>
            <Box display="flex" gap={2} mt={2} flexWrap="wrap">
              <EbDataCard />
              <SiteOwnersCard />
            </Box>
            <Box mt={2} width="100%">
              <TextosRapidosCard />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity={error?.startsWith("Failed") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
