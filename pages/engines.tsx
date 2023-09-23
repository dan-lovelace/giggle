import { ChangeEvent, FormEvent, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  ClickAwayListener,
  FormLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useEngines } from "../hooks";
import { TSearchEngine } from "../types/common";

function Engine({ identifier, name }: TSearchEngine) {
  const [editedValues, setEditedValues] = useState<TSearchEngine>({
    identifier,
    name,
  });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { remove, update } = useEngines();

  const handleCancelConfirmDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleConfirmDeleteClick = () => {
    remove({ identifier });
  };

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleEditChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setEditedValues({
      ...editedValues,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditSaveClick = () => {
    update(
      { identifier, data: editedValues },
      {
        async onSuccess(response) {
          if (response.ok) {
            const json = await response.json();

            setEditedValues(json[0]);
            setIsEditing(false);
          }
        },
      },
    );
  };

  return (
    <Grid container item spacing={1} sx={{ alignItems: "center" }}>
      <Grid item xs>
        {isEditing ? (
          <TextField
            name="name"
            size="small"
            value={editedValues.name}
            variant="standard"
            onChange={handleEditChange}
            sx={{ mt: "4px" }}
          />
        ) : (
          name
        )}
      </Grid>
      <Grid item xs>
        {isEditing ? (
          <TextField
            name="identifier"
            size="small"
            value={editedValues.identifier}
            variant="standard"
            onChange={handleEditChange}
            sx={{ mt: "4px" }}
          />
        ) : (
          identifier
        )}
      </Grid>
      <Grid item xs>
        <Stack direction="row" spacing={1}>
          {isEditing ? (
            <IconButton
              aria-label="edit engine"
              title="Edit"
              onClick={handleEditSaveClick}
              sx={{
                color: "success.main",
              }}
            >
              <CheckIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="edit engine"
              title="Edit"
              onClick={handleEditClick}
            >
              <EditIcon />
            </IconButton>
          )}
          {isConfirmingDelete ? (
            <ClickAwayListener onClickAway={handleCancelConfirmDelete}>
              <IconButton
                aria-label="confirm delete engine"
                color="error"
                title="Confirm delete"
                onClick={handleConfirmDeleteClick}
              >
                <DeleteIcon />
              </IconButton>
            </ClickAwayListener>
          ) : (
            <>
              {!isEditing && (
                <IconButton
                  aria-label="delete engine"
                  title="Delete"
                  onClick={handleDeleteClick}
                >
                  <ClearIcon />
                </IconButton>
              )}
            </>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}

export default function Engines() {
  const [isCreating, setIsCreating] = useState(false);
  const { engines, create } = useEngines();

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
    <Box>
      <div>{JSON.stringify(engines)}</div>
      <Typography>Engines</Typography>
      <Grid container spacing={2}>
        <Grid container item>
          <Grid item xs>
            <FormLabel>Name</FormLabel>
          </Grid>
          <Grid item xs>
            <FormLabel>Engine ID</FormLabel>
          </Grid>
          <Grid item xs>
            <FormLabel hidden>Actions</FormLabel>
          </Grid>
        </Grid>
        {engines.map((engine) => (
          <Engine key={engine.identifier} {...engine} />
        ))}
      </Grid>
      <Box sx={{ mt: 2 }}>
        {isCreating ? (
          <form onSubmit={handleCreateSubmit}>
            <Grid container spacing={1}>
              <Grid item xs>
                <TextField name="name" size="small" label="Name" />
              </Grid>
              <Grid item xs>
                <TextField name="identifier" size="small" label="Engine ID" />
              </Grid>
              <Grid item xs>
                <Stack direction="row" spacing={1}>
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
      </Box>
    </Box>
  );
}
