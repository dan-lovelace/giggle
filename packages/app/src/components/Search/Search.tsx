import React, { useEffect, useState } from "react";

import { css } from "@emotion/react";
import { TSearchInput } from "@giggle/types";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ListIcon from "@mui/icons-material/List";
import {
  Box,
  Button,
  Divider,
  FormGroup,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import * as yup from "yup";

import { useResultsData, useSearchData } from "../../contexts";
import { useEngines } from "../../hooks";
import { ROUTES } from "../../lib/routes";
import { STORAGE_KEYS } from "../../lib/storage";

const { ENGINE } = STORAGE_KEYS;

const formSchema = yup.object().shape({
  query: yup.string().required(),
  engine: yup.string().required(),
});

export const initialSearchInput: TSearchInput = {
  engine: "",
  page: 1,
  query: "",
};

export default function Search() {
  const [enginesEl, setEnginesEl] = useState<null | HTMLElement>(null);
  const [initialized, setInitialized] = useState(false);
  const {
    engines: { data: engines },
  } = useEngines();
  const { searchInput, setSearchInput } = useSearchData();
  const enginesOpen = !!enginesEl;
  const selectedEngine = engines?.find(
    (e) => e.identifier === searchInput.engine,
  );
  const { refetch } = useResultsData();
  const router = useRouter();

  useEffect(() => {
    const updateSearchInput = () => {
      const locationQuery = new URLSearchParams(window.location.search);
      const pageQuery = locationQuery.get("page");
      const storedEngine = localStorage.getItem(ENGINE);
      const currentInput: TSearchInput = {
        engine:
          locationQuery.get("engine") ||
          searchInput.engine ||
          (engines?.find((engine) => engine.identifier === storedEngine) &&
            storedEngine) ||
          (engines && engines.length > 0 && engines[0].identifier) ||
          initialSearchInput.engine,
        query: locationQuery.get("query") || initialSearchInput.query,
        page: (pageQuery && parseInt(pageQuery, 10)) || initialSearchInput.page,
        shouldRefetch: true,
      };

      setSearchInput(currentInput);
    };

    function initialize() {
      // create a route handler to update search input state on back/forward click
      router.events.on("routeChangeComplete", updateSearchInput);

      updateSearchInput();
      setInitialized(true);
    }

    initialize();

    return () => {
      router.events.off("routeChangeComplete", updateSearchInput);
    };
  }, []);

  const handleEnginesClick = (event: React.MouseEvent<HTMLElement>) => {
    setEnginesEl(event.currentTarget);
  };

  const handleEnginesClose = () => {
    setEnginesEl(null);
  };

  const handleEngineChange = (value: string) => () => {
    handleChange({
      target: { name: "engine", value },
    } as React.ChangeEvent<HTMLInputElement>);
    handleEnginesClose();
  };

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput({
      ...searchInput,
      shouldRefetch: false,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formSchema.isValidSync(searchInput)) return;

    const query: TSearchInput = {
      engine: searchInput.engine,
      query: searchInput.query,
      page: 1,
    };

    Router.push({
      pathname: "/results",
      query,
    }).then(() => {
      refetch();
    });
  };

  if (!engines?.length) {
    return false;
  }

  return (
    <>
      {initialized && (
        <Box sx={{ width: "100%", maxWidth: "35rem" }}>
          <form
            onSubmit={handleSubmit}
            css={css`
              display: flex;
              align-items: center;
              width: 100%;
            `}
          >
            <FormGroup row sx={{ width: "100%" }}>
              <TextField
                data-testid="query-input"
                name="query"
                value={searchInput.query}
                onChange={handleChange}
                sx={{ flex: "1 1 auto" }}
                InputProps={{
                  sx: {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
                size="small"
              />
              <Button
                data-testid="engines-button"
                id="engines-button"
                aria-controls={enginesOpen ? "engines-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={enginesOpen ? "true" : undefined}
                variant="contained"
                disableElevation
                onClick={handleEnginesClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                <span
                  css={{
                    display: "inline-block",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedEngine?.name}
                </span>
              </Button>
            </FormGroup>
            <Menu
              data-testid="engines-menu"
              id="engines-menu"
              MenuListProps={{
                "aria-labelledby": "engines-button",
              }}
              anchorEl={enginesEl}
              open={enginesOpen}
              onClose={handleEnginesClose}
            >
              {engines.map(({ identifier, name }) => {
                const selected = selectedEngine?.identifier === identifier;

                return (
                  <MenuItem
                    key={identifier}
                    selected={selected}
                    value={identifier}
                    onClick={handleEngineChange(identifier)}
                  >
                    <ListItemIcon>{selected && <CheckIcon />}</ListItemIcon>
                    <ListItemText>{name}</ListItemText>
                  </MenuItem>
                );
              })}
              {engines.length > 0 && <Divider />}
              <Link href={ROUTES.ENGINES} onClick={handleEnginesClose}>
                <MenuItem>
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText>Edit engines</ListItemText>
                </MenuItem>
              </Link>
            </Menu>
            <Button
              data-testid="submit-button"
              sx={visuallyHidden}
              type="submit"
            >
              Search
            </Button>
          </form>
        </Box>
      )}
    </>
  );
}
