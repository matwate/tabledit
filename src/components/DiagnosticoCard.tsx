import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { memo } from "react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

function DiagnosticoCard() {
  const {
    diagnostico,
    diagnosticoQuickPhrases,
    newDiagnosticoPhrase,
    setDiagnostico,
    setNewDiagnosticoPhrase,
    addDiagnosticoPhrase,
    deleteDiagnosticoPhrase,
    copyDiagnostico,
    clearDiagnostico,
  } = useStore(
    useShallow((s) => ({
      diagnostico: s.diagnostico,
      diagnosticoQuickPhrases: s.diagnosticoQuickPhrases,
      newDiagnosticoPhrase: s.newDiagnosticoPhrase,
      setDiagnostico: s.setDiagnostico,
      setNewDiagnosticoPhrase: s.setNewDiagnosticoPhrase,
      addDiagnosticoPhrase: s.addDiagnosticoPhrase,
      deleteDiagnosticoPhrase: s.deleteDiagnosticoPhrase,
      copyDiagnostico: s.copyDiagnostico,
      clearDiagnostico: s.clearDiagnostico,
    })),
  );

  return (
    <Card className="bg-gray-700" sx={{ flex: 1, p: 1 }}>
      <CardContent>
        <Typography variant="h6" className="text-white py-2">
          Diagnostico
        </Typography>
        <TextField
          label="Diagnostico"
          variant="outlined"
          size="medium"
          fullWidth
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          className="bg-gray-800" sx={{ mb: 2 }}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#9ca3af" } }}
        />
        <List
          className="bg-gray-800"
          sx={{
            maxHeight: 200,
            overflow: "auto",
            mb: 2,
          }}
        >
          {diagnosticoQuickPhrases.map((phrase, index) => (
            <ListItem
              key={phrase}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => deleteDiagnosticoPhrase(index)}
                  sx={{ color: "#9ca3af" }}
                >
                  <Close />
                </IconButton>
              }
            >
              <ListItemButton
                onClick={() => setDiagnostico(phrase)}
                sx={{ color: "white" }}
              >
                <ListItemText primary={phrase} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box display="flex" alignItems="center">
          <TextField
            label="Quick Phrase"
            variant="outlined"
            size="medium"
            fullWidth
            value={newDiagnosticoPhrase}
            onChange={(e) => setNewDiagnosticoPhrase(e.target.value)}
            className="bg-gray-800" sx={{ mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={addDiagnosticoPhrase} variant="contained">
            <Add />
          </Button>
        </Box>
        <Box display="flex" gap={2} mt={2}>
          <Button
            onClick={copyDiagnostico}
            variant="contained"
            color="primary"
            size="small"
          >
            <ContentCopy />
          </Button>
          <Button
            onClick={clearDiagnostico}
            variant="contained"
            color="error"
            size="small"
          >
            Clear
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default memo(DiagnosticoCard);
