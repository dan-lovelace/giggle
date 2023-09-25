import { forwardRef } from "react";

import { apiTypeLabelMap, DBTEngine, TApiType } from "@giggle/types";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Box,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  MenuItemProps,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
} from "@mui/material";

type ApiTypeSelectProps = {
  formData: DBTEngine;
  showLabel?: boolean;
  onChange: (event: SelectChangeEvent) => void;
};

const ApiTypeOption = forwardRef<
  HTMLLIElement,
  MenuItemProps & {
    value: TApiType;
  }
>((props, ref) => <MenuItem ref={ref} {...props} value={props.value} />);

const label = "API Type";

export default function ApiTypeSelect({
  formData,
  showLabel = false,
  onChange,
}: ApiTypeSelectProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <FormControl fullWidth>
        {showLabel && <InputLabel id="api-type-label">{label}</InputLabel>}
        <Select
          label={showLabel ? label : undefined}
          labelId="api-type-label"
          name="api_type"
          size="small"
          value={formData.api_type}
          onChange={onChange}
        >
          <ApiTypeOption value="DEFAULT">
            {apiTypeLabelMap.DEFAULT}
          </ApiTypeOption>
          <ApiTypeOption value="SITE_RESTRICTED">
            {apiTypeLabelMap.SITE_RESTRICTED}
          </ApiTypeOption>
        </Select>
      </FormControl>
      <Tooltip
        title={
          <Stack spacing={1}>
            <Box>
              Engines with 10 or fewer specific sites can take advantage of
              Google's "Site Restricted" API that has no daily limit. If your
              engine has more than 10, you'll need to use the "Default" type
              which has a free limit of 100 daily searches.
            </Box>
            <Box>
              Visit the{" "}
              <Link
                href="https://developers.google.com/custom-search/v1/overview"
                target="_blank"
                sx={{ color: "warning.light" }}
              >
                Programmable Search Engine guide
              </Link>{" "}
              for more information.
            </Box>
          </Stack>
        }
      >
        <HelpOutlineIcon />
      </Tooltip>
    </Stack>
  );
}
