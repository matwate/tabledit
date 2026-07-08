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
import { memo } from "react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

function TextosRapidosCard() {
  const {
    otherQuickPhrases,
    newOtherPhrase,
    setNewOtherPhrase,
    addOtherPhrase,
    deleteOtherPhrase,
    copyOtherPhrase,
  } = useStore(
    useShallow((s) => ({
      otherQuickPhrases: s.otherQuickPhrases,
      newOtherPhrase: s.newOtherPhrase,
      setNewOtherPhrase: s.setNewOtherPhrase,
      addOtherPhrase: s.addOtherPhrase,
      deleteOtherPhrase: s.deleteOtherPhrase,
      copyOtherPhrase: s.copyOtherPhrase,
    })),
  );

  return (
    <Card className="bg-gray-700" sx={{ p: 1 }}>
      <CardContent>
        <Typography variant="h6" className="text-white py-2">
          Textos Rapidos
        </Typography>
        <List
          className="bg-gray-800"
          sx={{
            maxHeight: 200,
            overflow: "auto",
            mb: 2,
          }}
        >
          {otherQuickPhrases.map((phrase, index) => (
            <ListItem
              key={phrase}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => deleteOtherPhrase(index)}
                  sx={{ color: "#9ca3af" }}
                >
                  <Close />
                </IconButton>
              }
            >
              <ListItemButton
                onClick={() => copyOtherPhrase(phrase)}
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
            value={newOtherPhrase}
            onChange={(e) => setNewOtherPhrase(e.target.value)}
            className="bg-gray-800"
            sx={{ mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={addOtherPhrase} variant="contained">
            <Add />
          </Button>
        </Box>
        <Typography variant="caption" className="text-gray-400 mt-2">
          Click a phrase to copy it
        </Typography>
      </CardContent>
    </Card>
  );
}

export default memo(TextosRapidosCard);
