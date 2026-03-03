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

export default function DiagnosticoCard(props) {
  return (
    <Card sx={{ bgcolor: "#374151", flex: 1, p: 1 }}>
      <CardContent>
        <h2 className="text-xl py-2 text-white">Diagnostico</h2>
        <TextField
          label="Diagnostico"
          variant="outlined"
          size="medium"
          fullWidth
          value={props.data.diagnostico}
          onChange={(e) => props.setData("diagnostico", e.target.value)}
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
          <For each={props.data.diagnosticoQuickPhrases}>
            {(phrase, index) => (
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => props.deleteDiagnosticoPhrase(index())}
                    sx={{ color: "#9ca3af" }}
                  >
                    <Close />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => props.setData("diagnostico", phrase)}
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
            value={props.newDiagnosticoPhrase()}
            onChange={(e) => props.setNewDiagnosticoPhrase(e.target.value)}
            sx={{ bgcolor: "#1f2937", mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={props.addDiagnosticoPhrase} variant="contained">
            <Add />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            onClick={props.copyDiagnostico}
            variant="contained"
            color="primary"
            size="small"
          >
            <ContentCopy />
          </Button>
          <Button
            onClick={props.clearDiagnostico}
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
