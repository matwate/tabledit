import {
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
} from "@suid/material";
import { Add, Delete } from "@suid/icons-material";
import { For } from "solid-js";

export default function SiteOwnersCard(props) {
  return (
    <Card sx={{ bgcolor: "#1f2937", flex: 1 }}>
      <CardContent>
        <h2 className="text-xl py-2 text-white">Site Owners</h2>
        <div className="flex items-center mb-2">
          <TextField
            label="New Site Owner"
            variant="outlined"
            size="small"
            value={props.newSiteOwner()}
            onChange={(e) => props.setNewSiteOwner(e.target.value)}
            sx={{ bgcolor: "#1f2937", mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={props.addSiteOwner} variant="contained" size="small">
            <Add />
          </Button>
        </div>
        <List sx={{ bgcolor: "#374151", maxHeight: 300, overflow: "auto" }}>
          <For each={props.data.siteOwners}>
            {(owner, index) => (
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => props.removeSiteOwner(index())}
                    sx={{ color: "#9ca3af", p: 1 }}
                  >
                    <Delete />
                  </IconButton>
                }
                sx={{ pr: 7 }}
              >
                <ListItemText
                  primary={owner}
                  sx={{ color: "white", margin: 2 }}
                />
              </ListItem>
            )}
          </For>
        </List>
      </CardContent>
    </Card>
  );
}
