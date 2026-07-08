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
import Remove from "@mui/icons-material/Remove";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { memo } from "react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

function AvanceCard() {
  const {
    currentAvance,
    avances,
    avanceQuickPhrases,
    newAvancePhrase,
    navigateNext,
    navigatePrevious,
    deleteAvance,
    updateCurrentAvanceText,
    updateCurrentAvanceDate,
    addAvanceQuickPhrase,
    deleteAvanceQuickPhrase,
    setNewAvancePhrase,
    copyCurrentAvance,
    clearCurrentAvanceText,
    getCurrentAvanceText,
    getCurrentAvanceDate,
  } = useStore(
    useShallow((s) => ({
      currentAvance: s.currentAvance,
      avances: s.avances,
      avanceQuickPhrases: s.avanceQuickPhrases,
      newAvancePhrase: s.newAvancePhrase,
      navigateNext: s.navigateNext,
      navigatePrevious: s.navigatePrevious,
      deleteAvance: s.deleteAvance,
      updateCurrentAvanceText: s.updateCurrentAvanceText,
      updateCurrentAvanceDate: s.updateCurrentAvanceDate,
      addAvanceQuickPhrase: s.addAvanceQuickPhrase,
      deleteAvanceQuickPhrase: s.deleteAvanceQuickPhrase,
      setNewAvancePhrase: s.setNewAvancePhrase,
      copyCurrentAvance: s.copyCurrentAvance,
      clearCurrentAvanceText: s.clearCurrentAvanceText,
      getCurrentAvanceText: s.getCurrentAvanceText,
      getCurrentAvanceDate: s.getCurrentAvanceDate,
    })),
  );

  return (
    <Card className="bg-gray-700" sx={{ flex: 1, p: 1 }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h6" className="text-white py-2">
            Avance {currentAvance} / {avances.length}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            {currentAvance >= 2 && (
              <Button
                onClick={deleteAvance}
                variant="contained"
                color="error"
                size="small"
              >
                <Delete />
              </Button>
            )}
            <Button
              onClick={navigateNext}
              variant="contained"
              size="small"
            >
              <Add />
            </Button>
            <Button
              onClick={navigatePrevious}
              variant="contained"
              size="small"
            >
              <Remove />
            </Button>
          </Box>
        </Box>
        <TextField
          type="date"
          label="Avance Date"
          value={getCurrentAvanceDate()}
          onChange={(e) => updateCurrentAvanceDate(e.target.value)}
          variant="outlined"
          fullWidth
          className="bg-gray-800"
          sx={{ mb: 2 }}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{
            shrink: true,
            style: { color: "#9ca3af" },
          }}
        />
        <TextField
          label="Avance Text"
          variant="outlined"
          size="medium"
          fullWidth
          multiline
          rows={4}
          value={getCurrentAvanceText()}
          onChange={(e) => updateCurrentAvanceText(e.target.value)}
          className="bg-gray-800"
          sx={{ mb: 2 }}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#9ca3af" } }}
        />
        <List
          className="bg-gray-800"
          sx={{
            maxHeight: 150,
            overflow: "auto",
            mb: 2,
          }}
        >
          {avanceQuickPhrases.map((phrase, index) => (
            <ListItem
              key={phrase}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => deleteAvanceQuickPhrase(index)}
                  sx={{ color: "#9ca3af" }}
                >
                  <Close />
                </IconButton>
              }
            >
              <ListItemButton
                onClick={() => updateCurrentAvanceText(phrase)}
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
            value={newAvancePhrase}
            onChange={(e) => setNewAvancePhrase(e.target.value)}
            className="bg-gray-800" sx={{ mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={addAvanceQuickPhrase} variant="contained">
            <Add />
          </Button>
        </Box>
        <Box display="flex" gap={2} mt={2}>
          <Button
            onClick={copyCurrentAvance}
            variant="contained"
            color="primary"
            size="small"
          >
            <ContentCopy />
          </Button>
          <Button
            onClick={clearCurrentAvanceText}
            variant="contained"
            color="error"
            size="small"
          >
            Clear Text
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default memo(AvanceCard);
