import { DBTEngine } from "@giggle/types";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { useSearchData } from "../contexts/searchData";
import { useToastContext } from "../contexts/toast";
import { ENDPOINTS } from "../lib/endpoints";
import { getResponseBody } from "../lib/helpers";
import { QUERIES } from "../lib/queries";

export function useEngines() {
  const { searchInput, setSearchInput } = useSearchData();
  const queryClient = useQueryClient();
  const { notify } = useToastContext();
  const engines = useQuery<Array<DBTEngine>>(QUERIES.ENGINES, () =>
    fetch(ENDPOINTS.ENGINES).then((response) => getResponseBody(response)),
  );

  const { mutate: create } = useMutation(
    (body: DBTEngine) =>
      fetch(ENDPOINTS.ENGINES, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    {
      async onSuccess(response) {
        const responseJson = await getResponseBody(response);

        if (!response.ok) {
          return notify(responseJson.error, { severity: "warning" });
        }

        queryClient
          .invalidateQueries({
            queryKey: [QUERIES.ENGINES],
          })
          .then(() => {
            if (!engines.data?.length) {
              /**
               * The user created an engine when no others exist. Update it to
               * be the selected one.
               */
              setSearchInput({
                ...searchInput,
                engine: responseJson[0].identifier,
              });
            }
          });
      },
    },
  );

  const { mutate: remove } = useMutation(
    (body: Pick<DBTEngine, "identifier">) =>
      fetch(ENDPOINTS.ENGINES, {
        method: "DELETE",
        body: JSON.stringify(body),
      }),
    {
      async onSuccess(response) {
        const responseJson = await getResponseBody(response);

        if (!response.ok) {
          return notify(responseJson.error, { severity: "warning" });
        }

        queryClient
          .invalidateQueries({
            queryKey: [QUERIES.ENGINES],
          })
          .then(() => {
            const { identifier } = responseJson;
            const newEngine = engines.data?.find(
              (engine) => engine !== identifier,
            )?.identifier;

            if (
              searchInput.engine === identifier &&
              (engines.data?.length ?? 0) > 1 &&
              newEngine
            ) {
              /**
               * User deleted the selected engine and more exist. Update
               * selected engine to the first one found.
               */
              setSearchInput({
                ...searchInput,
                engine: newEngine,
              });
            }
          });
      },
    },
  );

  const { mutate: update } = useMutation(
    (body: { identifier: DBTEngine["identifier"]; data: DBTEngine }) =>
      fetch(ENDPOINTS.ENGINES, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    {
      async onSuccess(response) {
        const body = await getResponseBody(response);

        if (!response.ok) {
          return notify(body.error, { severity: "warning" });
        }

        queryClient.invalidateQueries({
          queryKey: [QUERIES.ENGINES],
        });
      },
    },
  );

  return { engines, create, remove, update };
}
