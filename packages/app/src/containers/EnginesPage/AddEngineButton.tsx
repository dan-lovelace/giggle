import { FormEvent, useState } from "react";

import { TSearchEngine } from "@giggle/types";
import AddIcon from "@mui/icons-material/Add";
import { Button, Grid, Stack, TextField } from "@mui/material";

import { useEngines } from "../../hooks";

export default function AddEngineButton() {
  const [isCreating, setIsCreating] = useState(false);
  const { create } = useEngines();

  const handleCancelClick = () => {
    setIsCreating(false);
  };

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData) as TSearchEngine;

    create(body, {
      onSuccess(response) {
        if (response.ok) {
          setIsCreating(false);
        }
      },
    });
  };

  return (
    <>
      {isCreating ? (
        <form onSubmit={handleCreateSubmit}>
          <Grid container spacing={1}>
            <Grid item>
              <TextField name="name" size="small" label="Name" required />
            </Grid>
            <Grid item>
              <TextField
                name="identifier"
                size="small"
                label="Engine ID"
                required
              />
            </Grid>
            <Grid item>
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
