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

export default function PcaCard(props) {
  return (
    <Card sx={{ bgcolor: "#374151", flex: 1, p: 1 }}>
      <CardContent>
        <h2 className="text-xl py-2 text-white">Pca</h2>
        <TextField
          label="Pca"
          variant="outlined"
          size="medium"
          value={props.data.pca}
          onChange={(e) => props.setData("pca", e.target.value)}
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
          <For each={props.data.pcaQuickPhrases}>
            {(phrase, index) => (
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => props.deletePcaPhrase(index())}
                    sx={{ color: "#9ca3af" }}
                  >
                    <Close />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => props.setData("pca", phrase)}
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
            value={props.newPcaPhrase()}
            onChange={(e) => props.setNewPcaPhrase(e.target.value)}
            sx={{ bgcolor: "#1f2937", mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={props.addPcaPhrase} variant="contained">
            <Add />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            onClick={props.copyPca}
            variant="contained"
            color="primary"
            size="small"
          >
            <ContentCopy />
          </Button>
          <Button
            onClick={props.clearPca}
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
