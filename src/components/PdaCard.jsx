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
import { Add, ContentCopy, Close } from "@suid/icons-material";
import { For } from "solid-js";

export default function PdaCard(props) {
  return (
    <Card sx={{ bgcolor: "#374151", flex: 1, p: 1 }}>
      <CardContent>
        <h2 className="text-xl py-2 text-white">Pda</h2>
        <TextField
          label="Pda"
          variant="outlined"
          size="medium"
          value={props.data.pda}
          onChange={(e) => props.setData("pda", e.target.value)}
          fullWidth
          sx={{ bgcolor: "#1f2937", mb: 2 }}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#9ca3af" } }}
        />
        <List
          sx={{
            bgcolor: "#1f2937",
            maxHeight: 200,
            overflow: "auto",
            mb: 2,
          }}
        >
          <For each={props.data.pdaQuickPhrases}>
            {(phrase, index) => (
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => props.deletePdaPhrase(index())}
                    sx={{ color: "#9ca3af" }}
                  >
                    <Close />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => props.setData("pda", phrase)}
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
            value={props.newPdaPhrase()}
            onChange={(e) => props.setNewPdaPhrase(e.target.value)}
            sx={{ bgcolor: "#1f2937", mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={props.addPdaPhrase} variant="contained">
            <Add />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            onClick={props.copyPda}
            variant="contained"
            color="primary"
            size="small"
          >
            <ContentCopy />
          </Button>
          <Button
            onClick={props.clearPda}
            variant="contained"
            color="error"
            size="small"
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
