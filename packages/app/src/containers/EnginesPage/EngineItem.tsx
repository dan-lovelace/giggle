import { ChangeEvent, useState } from "react";

import { TSearchEngine } from "@giggle/types";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  ClickAwayListener,
  Grid,
  IconButton,
  ListItem,
  Stack,
  TextField,
} from "@mui/material";

import { useEngines } from "../../hooks";

export default function Engine({ identifier, name }: TSearchEngine) {
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
    <ListItem disableGutters>
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
          <Stack direction="row" spacing={1} sx={{ justifyContent: "end" }}>
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
                <IconButton
                  aria-label="delete engine"
                  title="Delete"
                  onClick={handleDeleteClick}
                  sx={{ visibility: isEditing ? "hidden" : "visible" }}
                >
                  <ClearIcon />
                </IconButton>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </ListItem>
  );
}
