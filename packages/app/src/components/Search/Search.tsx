import React, { useEffect, useState } from "react";

import { css } from "@emotion/react";
import { TSearchInput } from "@giggle/types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon from "@mui/icons-material/Settings";
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

import { useResults } from "../../contexts/resultsData";
import { useSearchData } from "../../contexts/searchData";
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
    engines: { data },
  } = useEngines();
  const { searchInput, setSearchInput } = useSearchData();
  const enginesOpen = !!enginesEl;
  const selectedEngine = data?.find((e) => e.identifier === searchInput.engine);
  const { refetch } = useResults();
  const router = useRouter();

  useEffect(() => {
    function initialize() {
      const updateSearchInput = () => {
        const locationQuery = new URLSearchParams(window.location.search);
        const pageQuery = locationQuery.get("page");
        const storedEngine = localStorage.getItem(ENGINE);
        const currentInput: TSearchInput = {
          engine:
            locationQuery.get("engine") ||
            searchInput.engine ||
            (data?.find((engine) => engine.identifier === storedEngine) &&
              storedEngine) ||
            initialSearchInput.engine,
          query: locationQuery.get("query") || initialSearchInput.query,
          page:
            (pageQuery && parseInt(pageQuery, 10)) || initialSearchInput.page,
        };

        setSearchInput(currentInput);
      };

      // create a route handler to update search input state on back/forward click
      router.events.on("routeChangeComplete", updateSearchInput);

      updateSearchInput();
      setInitialized(true);
    }

    initialize();
  }, []);

  useEffect(() => {
    const { engine } = searchInput;

    if (engine) {
      localStorage.setItem(ENGINE, engine);
    } else {
      localStorage.removeItem(ENGINE);
    }
  }, [searchInput]);

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
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formSchema.isValidSync(searchInput)) return;

    Router.push({
      pathname: "/results",
      query: { ...searchInput, page: 1 } as TSearchInput,
    }).then(() => {
      refetch();
    });
  };

  if (!data?.length) {
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
              {data.map(({ identifier, name }) => (
                <MenuItem
                  key={identifier}
                  value={identifier}
                  onClick={handleEngineChange(identifier)}
                  selected={selectedEngine?.identifier === identifier}
                >
                  {name}
                </MenuItem>
              ))}
              {data.length > 0 && <Divider />}
              <Link href={ROUTES.ENGINES}>
                <MenuItem>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText>Manage engines</ListItemText>
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
