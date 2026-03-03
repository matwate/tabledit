import { Button, Card, CardContent, TextField } from "@suid/material";
import { Add, ContentCopy, Delete, Clear } from "@suid/icons-material";
import { For, createSignal, createEffect } from "solid-js";

function LocalTextField(props) {
  const [localValue, setLocalValue] = createSignal(props.value || "");

  createEffect(() => {
    setLocalValue(props.value || "");
  });

  let timeout;
  const debouncedUpdate = (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => props.onUpdate(value), 300);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedUpdate(newValue);
  };

  const { onUpdate, value, ...rest } = props;

  return (
    <TextField
      {...rest}
      value={localValue()}
      onChange={handleChange}
    />
  );
}

function LocalSelect(props) {
  const handleChange = (e) => {
    props.onUpdate(e.target.value);
  };

  return (
    <select
      value={props.value}
      onChange={handleChange}
      style={{
        background: "#1f2937",
        color: "white",
        border: "1px solid #4b5563",
        "border-radius": "4px",
        padding: "8px 12px",
        "font-size": "0.875rem",
      }}
    >
      {props.children}
    </select>
  );
}

export default function EbDataCard(props) {
  return (
    <Card sx={{ bgcolor: "#1f2937", flex: 2 }}>
      <CardContent>
        <h2 className="text-xl py-2 text-white"> PARA MAÑANA </h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">EB Rows</span>
          <div className="flex gap-2">
            <Button onClick={props.addEbRow} variant="contained" size="small">

              <Add />
            </Button>
            <Button
              onClick={props.copyEbData}
              variant="contained"
              color="primary"
              size="small"
            >
              <ContentCopy />
            </Button>
          </div>
        </div>
        <div className="overflow-auto" style={{ maxHeight: 400 }}>
          <For each={props.data.ebData} by={(row) => row.id} fallback={<></>}>
            {(row, index) => (
              <Card sx={{ bgcolor: "#374151", mb: 2 }}>
                <CardContent className="pb-2">
                  <div className="flex gap-2 items-center mb-2">
                    <LocalTextField
                      label="EB"
                      variant="outlined"
                      size="small"
                      value={row.eb}
                      onUpdate={(value) =>
                        props.updateEbRow(index(), "eb", value)
                      }
                      sx={{ bgcolor: "#1f2937" }}
                      InputProps={{ style: { color: "white" } }}
                      InputLabelProps={{ style: { color: "#9ca3af" } }}
                    />
                    <LocalSelect
                      value={row.so1}
                      onUpdate={(value) =>
                        props.updateEbRow(index(), "so1", value)
                      }
                    >
                      <option value="" disabled>Select SO1</option>
                      <For each={props.data.siteOwners}>
                        {(owner) => (
                          <option value={owner}>
                            {owner}
                          </option>
                        )}
                      </For>
                    </LocalSelect>
                    <LocalSelect
                      value={row.so2}
                      onUpdate={(value) =>
                        props.updateEbRow(index(), "so2", value)
                      }
                    >
                      <option value="" disabled>Select SO2</option>
                      <For each={props.data.siteOwners}>
                        {(owner) => (
                          <option value={owner}>
                            {owner}
                          </option>
                        )}
                      </For>
                    </LocalSelect>
                    <Button
                      onClick={() => props.removeEbRow(index())}
                      variant="contained"
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </Button>
                    <Button
                      onClick={() => props.clearEbRow(index())}
                      variant="contained"
                      color="secondary"
                      size="small"
                      title="Clear row"
                    >
                      Clear
                    </Button>
                  </div>
                  <LocalTextField
                    label="Actividad"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.actividad}
                    onUpdate={(value) =>
                      props.updateEbRow(index(), "actividad", value)
                    }
                    sx={{ bgcolor: "#1f2937" }}
                    InputProps={{ style: { color: "white" } }}
                    InputLabelProps={{ style: { color: "#9ca3af" } }}
                  />
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </CardContent>
    </Card>
  );
}
