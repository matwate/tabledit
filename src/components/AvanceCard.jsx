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
import { Add, Remove, ContentCopy, Delete, Close } from "@suid/icons-material";
import { For, Show } from "solid-js";

export default function AvanceCard(props) {
  return (
    <Card sx={{ bgcolor: "#374151", flex: 1, p: 1 }}>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl py-2 text-white">
            Avance {props.data.currentAvance} / {props.data.avances.length}
          </h2>
          <div className="flex items-center">
            <Button
              onClick={props.navigateNext}
              variant="contained"
              size="small"
            >
              <Add />
            </Button>
            <Button
              onClick={props.navigatePrevious}
              variant="contained"
              size="small"
            >
              <Remove />
            </Button>
            <Show when={props.data.currentAvance >= 2}>
              <Button
                onClick={props.deleteAvance}
                variant="contained"
                color="error"
                size="small"
              >
                <Delete />
              </Button>
            </Show>
          </div>
        </div>
        <TextField
          type="date"
          label="Avance Date"
          value={props.getCurrentAvanceDate()}
          onChange={props.updateCurrentAvanceDate}
          variant="outlined"
          fullWidth
          sx={{ bgcolor: "#1f2937", mb: 2 }}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{
            style: { color: "#9ca3af", shrink: true },
          }}
        />
        <TextField
          label="Avance Text"
          variant="outlined"
          size="medium"
          fullWidth
          multiline
          rows={4}
          value={props.getCurrentAvanceText()}
          onChange={(e) => props.updateCurrentAvanceText(e.target.value)}
          sx={{ bgcolor: "#1f2937", mb: 2 }}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#9ca3af" } }}
        />
        <List
          sx={{
            bgcolor: "#1f2937",
            maxHeight: 150,
            overflow: "auto",
            mb: 2,
          }}
        >
          <For each={props.data.avanceQuickPhrases}>
            {(phrase, index) => (
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => props.deleteAvanceQuickPhrase(index())}
                    sx={{ color: "#9ca3af" }}
                  >
                    <Close />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => props.updateCurrentAvanceText(phrase)}
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
            value={props.newAvancePhrase()}
            onChange={(e) => props.setNewAvancePhrase(e.target.value)}
            sx={{ bgcolor: "#1f2937", mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={props.addAvanceQuickPhrase} variant="contained">
            <Add />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            onClick={props.copyCurrentAvance}
            variant="contained"
            color="primary"
            size="small"
          >
            <ContentCopy />
          </Button>
          <Button
            onClick={props.clearCurrentAvanceText}
            variant="contained"
            color="error"
            size="small"
          >
            Clear Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
