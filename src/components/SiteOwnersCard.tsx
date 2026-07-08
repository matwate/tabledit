import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { memo } from "react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

function SiteOwnersCard() {
  const {
    siteOwners,
    newSiteOwner,
    setNewSiteOwner,
    addSiteOwner,
    removeSiteOwner,
  } = useStore(
    useShallow((s) => ({
      siteOwners: s.siteOwners,
      newSiteOwner: s.newSiteOwner,
      setNewSiteOwner: s.setNewSiteOwner,
      addSiteOwner: s.addSiteOwner,
      removeSiteOwner: s.removeSiteOwner,
    })),
  );

  return (
    <Card className="bg-gray-800" sx={{ flex: 1 }}>
      <CardContent>
        <Typography variant="h6" className="text-white py-2">
          Site Owners
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            label="New Site Owner"
            variant="outlined"
            size="small"
            value={newSiteOwner}
            onChange={(e) => setNewSiteOwner(e.target.value)}
            className="bg-gray-800" sx={{ mr: 1 }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#9ca3af" } }}
          />
          <Button onClick={addSiteOwner} variant="contained" size="small">
            <Add />
          </Button>
        </Box>
        <List className="bg-gray-700" sx={{ maxHeight: 300, overflow: "auto" }}>
          {siteOwners.map((owner, index) => (
            <ListItem
              key={owner}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => removeSiteOwner(index)}
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
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default memo(SiteOwnersCard);
