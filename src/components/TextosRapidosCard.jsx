import {
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  IconButton,
} from "@suid/material";
import { Add, Close } from "@suid/icons-material";
import { For } from "solid-js";

export default function TextosRapidosCard(props) {
  return (
    <Card sx={{ bgcolor: "#374151", p: 1 }}>
      <CardContent>
        <h2 className="text-xl py-2 text-white">Textos Rapidos</h2>
        <List
          sx={{
            bgcolor: "#1f2937",
            maxHeight: 200,
            overflow: "auto",
            mb: 2,
          }}
        >
          <For each={props.data.otherQuickPhrases}>
            {(phrase, index) => (
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => props.deleteOtherPhrase(index())}
                    sx={{ color: "#9ca3af" }}
                  >
                    <Close />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => props.copyOtherPhrase(phrase)}
                  sx={{ color: "white" }}
                >
                  <ListItemText primary={phrase} />
                </ListItemButton>
              </ListItem>
            )}
          </For>
        </List>
        <div className="flex items-center">
          <TextField
            label="Quick Phrase"
            variant="outlined"
            size="medium"
            fullWidth
            value={props.newOtherPhrase()}
            onChange={(e) => props.setNewOtherPhrase(e.target.value)}
            sx={{ bgcolor: "#1f2937", mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={props.addOtherPhrase} variant="contained">
            <Add />
          </Button>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Click a phrase to copy it
        </div>
      </CardContent>
    </Card>
  );
}