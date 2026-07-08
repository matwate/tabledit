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

function PdaCard() {
  const {
    pda,
    pdaQuickPhrases,
    newPdaPhrase,
    setPda,
    setNewPdaPhrase,
    addPdaPhrase,
    deletePdaPhrase,
    copyPda,
    clearPda,
  } = useStore(
    useShallow((s) => ({
      pda: s.pda,
      pdaQuickPhrases: s.pdaQuickPhrases,
      newPdaPhrase: s.newPdaPhrase,
      setPda: s.setPda,
      setNewPdaPhrase: s.setNewPdaPhrase,
      addPdaPhrase: s.addPdaPhrase,
      deletePdaPhrase: s.deletePdaPhrase,
      copyPda: s.copyPda,
      clearPda: s.clearPda,
    })),
  );

  return (
    <Card className="bg-gray-700" sx={{ flex: 1, p: 1 }}>
      <CardContent>
        <Typography variant="h6" className="text-white py-2">
          Pda
        </Typography>
        <TextField
          label="Pda"
          variant="outlined"
          size="medium"
          fullWidth
          value={pda}
          onChange={(e) => setPda(e.target.value)}
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
          {pdaQuickPhrases.map((phrase, index) => (
            <ListItem
              key={phrase}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => deletePdaPhrase(index)}
                  sx={{ color: "#9ca3af" }}
                >
                  <Close />
                </IconButton>
              }
            >
              <ListItemButton
                onClick={() => setPda(phrase)}
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
            value={newPdaPhrase}
            onChange={(e) => setNewPdaPhrase(e.target.value)}
            className="bg-gray-800" sx={{ mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={addPdaPhrase} variant="contained">
            <Add />
          </Button>
        </Box>
        <Box display="flex" gap={2} mt={2}>
          <Button
            onClick={copyPda}
            variant="contained"
            color="primary"
            size="small"
          >
            <ContentCopy />
          </Button>
          <Button
            onClick={clearPda}
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

export default memo(PdaCard);
