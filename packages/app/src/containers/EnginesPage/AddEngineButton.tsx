import { ChangeEvent, FormEvent, useState } from "react";

import { TApiType, DBTEngine } from "@giggle/types";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Grid,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";

import ApiTypeSelect from "./ApiTypeSelect";
import { useEngines } from "../../hooks";

export default function AddEngineButton() {
  const [formData, setFormData] = useState<DBTEngine>({
    api_type: "DEFAULT",
    identifier: "",
    name: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const { insert } = useEngines();

  const handleApiTypeChange = (event: SelectChangeEvent) => {
    setFormData({
      ...formData,
      api_type: event.target.value as TApiType,
    });
  };

  const handleCancelClick = () => {
    setIsCreating(false);
  };

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    insert(formData, {
      onSuccess() {
        setIsCreating(false);
      },
    });
  };

  const handleTextFieldChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      {isCreating ? (
        <form onSubmit={handleCreateSubmit}>
          <Grid container spacing={1}>
            <Grid item>
              <TextField
                name="name"
                size="small"
                label="Name"
                required
                value={formData.name}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="identifier"
                size="small"
                label="Engine ID"
                required
                value={formData.identifier}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid item xs>
              <ApiTypeSelect
                formData={formData}
                showLabel
                onChange={handleApiTypeChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} sx={{ height: "100%" }}>
                <Button type="submit" variant="outlined">
                  Create
                </Button>
                <Button onClick={handleCancelClick}>Cancel</Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      ) : (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Add new
        </Button>
      )}
    </>
  );
}
