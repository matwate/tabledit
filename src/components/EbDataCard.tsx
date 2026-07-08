import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Clear from "@mui/icons-material/Clear";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { memo } from "react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import type { ReactNode } from "react";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

function NativeSelect({ value, onChange, children }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm"
    >
      {children}
    </select>
  );
}

function EbDataCard() {
  const {
    ebData,
    ebs,
    siteOwners,
    addEbRow,
    removeEbRow,
    clearEbRow,
    updateEbRow,
    copyEbData,
  } = useStore(
    useShallow((s) => ({
      ebData: s.ebData,
      ebs: s.ebs,
      siteOwners: s.siteOwners,
      addEbRow: s.addEbRow,
      removeEbRow: s.removeEbRow,
      clearEbRow: s.clearEbRow,
      updateEbRow: s.updateEbRow,
      copyEbData: s.copyEbData,
    })),
  );

  return (
    <Card className="bg-gray-800" sx={{ flex: 2 }}>
      <CardContent>
        <Typography variant="h6" className="text-white py-2">
          PARA MAÑANA
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="body2" color="#d1d5db">
            EB Rows
          </Typography>
          <Box display="flex" gap={2}>
            <Button onClick={addEbRow} variant="contained" size="small">
              <Add />
            </Button>
            <Button
              onClick={copyEbData}
              variant="contained"
              color="primary"
              size="small"
            >
              <ContentCopy />
            </Button>
          </Box>
        </Box>
        <Box overflow="auto" maxHeight={400}>
          {ebData.map((row, index) => (
            <Card key={row.id} className="bg-gray-700" sx={{ mb: 2 }}>
              <CardContent className="pb-2">
                <Box display="flex" gap={2} mb={2} width="100%">
                  <TextField
                    label="EB"
                    variant="outlined"
                    size="small"
                    value={row.eb}
                    onChange={(e) => updateEbRow(index, "eb", e.target.value)}
                    className="bg-gray-800"
                    InputProps={{ style: { color: "white" } }}
                    inputProps={{ list: "eb-names" }}
                    InputLabelProps={{ style: { color: "#9ca3af" } }}
                    fullWidth
                  />
                  <NativeSelect
                    value={row.so1}
                    onChange={(value) => updateEbRow(index, "so1", value)}
                  >
                    <option value="" disabled>
                      Select SO1
                    </option>
                    {siteOwners.map((owner) => (
                      <option key={`${row.id}-so1-${owner}`} value={owner}>
                        {owner}
                      </option>
                    ))}
                  </NativeSelect>
                  <NativeSelect
                    value={row.so2}
                    onChange={(value) => updateEbRow(index, "so2", value)}
                  >
                    <option value="" disabled>
                      Select SO2
                    </option>
                    {siteOwners.map((owner) => (
                      <option key={`${row.id}-so2-${owner}`} value={owner}>
                        {owner}
                      </option>
                    ))}
                  </NativeSelect>
                  <Button
                    onClick={() => removeEbRow(index)}
                    variant="contained"
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </Button>
                  <Button
                    onClick={() => clearEbRow(index)}
                    variant="contained"
                    color="secondary"
                    size="small"
                    title="Clear row"
                  >
                    <Clear />
                  </Button>
                </Box>
                <TextField
                  label="Actividad"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={row.actividad}
                  onChange={(e) =>
                    updateEbRow(index, "actividad", e.target.value)
                  }
                  className="bg-gray-800"
                  InputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "#9ca3af" } }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
      <datalist id="eb-names">
        {ebs.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </Card>
  );
}

export default memo(EbDataCard);
