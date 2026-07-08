import {
  Autocomplete,
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
import RestartAlt from "@mui/icons-material/RestartAlt";
import { memo, useMemo } from "react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import type { ReactNode } from "react";
import ebNamesRaw from "../../EBS.txt?raw";

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
    resetEbs,
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
      resetEbs: s.resetEbs,
    })),
  );

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString("es-CO", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  const ebOptions = useMemo(() => {
    const fromFile = ebNamesRaw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    return Array.from(new Set([...fromFile, ...ebs])).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [ebs]);

  return (
    <Card className="bg-gray-800" sx={{ flex: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="baseline" gap={1} className="py-2">
          <Typography variant="h6" className="text-white">
            PARA MAÑANA
          </Typography>
          <Typography variant="body2" color="#9ca3af">
            {tomorrow}
          </Typography>
        </Box>
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
            <Button
              onClick={resetEbs}
              variant="contained"
              color="warning"
              size="small"
              title="Reset saved EB names to EBS.txt"
            >
              <RestartAlt />
            </Button>
          </Box>
        </Box>
        <Box overflow="auto" maxHeight={400}>
          {ebData.map((row, index) => (
            <Card key={row.id} className="bg-gray-700" sx={{ mb: 2 }}>
              <CardContent className="pb-2">
                <Box display="flex" gap={2} mb={2} width="100%">
                  <Autocomplete
                    freeSolo
                    value={row.eb}
                    onChange={(_e, value) =>
                      updateEbRow(index, "eb", (value as string) ?? "")
                    }
                    onInputChange={(_e, value) =>
                      updateEbRow(index, "eb", value)
                    }
                    options={ebOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="EB"
                        variant="outlined"
                        size="small"
                        fullWidth
                        className="bg-gray-800"
                        InputProps={{
                          ...params.InputProps,
                          style: { color: "white" },
                        }}
                        InputLabelProps={{ style: { color: "#9ca3af" } }}
                      />
                    )}
                    sx={{ minWidth: 200 }}
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
    </Card>
  );
}

export default memo(EbDataCard);
