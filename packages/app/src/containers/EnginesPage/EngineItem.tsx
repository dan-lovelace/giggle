import { ChangeEvent, FormEvent, useState } from "react";

import { apiTypeLabelMap, DBTEngine, TApiType } from "@giggle/types";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  ClickAwayListener,
  Grid,
  IconButton,
  ListItem,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";

import ApiTypeSelect from "./ApiTypeSelect";
import { useEngines } from "../../hooks";

export default function EngineItem({ api_type, identifier, name }: DBTEngine) {
  const [editedValues, setEditedValues] = useState<DBTEngine>({
    api_type,
    identifier,
    name,
  });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { remove, update } = useEngines();

  const handleApiTypeChange = (event: SelectChangeEvent) => {
    setEditedValues({
      ...editedValues,
      api_type: event.target.value as TApiType,
    });
  };

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

  const handleEditSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    update(
      { identifier, data: editedValues },
      {
        onSuccess(response) {
          setEditedValues(response.data);
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <form
      data-testid="engine-item"
      className="engine-item"
      onSubmit={handleEditSave}
    >
      <ListItem disableGutters>
        <Grid container item spacing={1} sx={{ alignItems: "center" }}>
          <Grid item xs>
            {isEditing ? (
              <TextField
                name="name"
                required
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
                required
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
            {isEditing ? (
              <ApiTypeSelect
                formData={editedValues}
                onChange={handleApiTypeChange}
              />
            ) : (
              apiTypeLabelMap[api_type]
            )}
          </Grid>
          <Grid item xs>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "end" }}>
              {isEditing ? (
                <IconButton
                  data-testid="save-engine-button"
                  key="saveEngine"
                  aria-label="save engine"
                  title="Save"
                  type="submit"
                  sx={{
                    color: "success.main",
                  }}
                >
                  <CheckIcon />
                </IconButton>
              ) : (
                <IconButton
                  data-testid="edit-engine-button"
                  key="editEngine"
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
                    data-testid="confirm-delete-engine-button"
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
                    data-testid="delete-engine-button"
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
    </form>
  );
}
