import { TSearchEngine } from "@giggle/types";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { useAppData } from "../contexts/appData";
import { useToastContext } from "../contexts/toast";
import { ENDPOINTS } from "../lib/endpoints";
import { QUERIES } from "../lib/queries";

export function useEngines() {
  const { searchInput, setSearchInput } = useAppData();
  const queryClient = useQueryClient();
  const { notify } = useToastContext();
  const engines = useQuery<Array<TSearchEngine>>(QUERIES.ENGINES, () =>
    fetch(ENDPOINTS.ENGINES).then((res) => res.json()),
  );

  const { mutate: create } = useMutation(
    (body: TSearchEngine) =>
      fetch(ENDPOINTS.ENGINES, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    {
      async onSuccess(response) {
        const responseJson = await response.json();

        if (!response.ok) {
          const { error } = responseJson;
          const message = Array.isArray(error) ? error.join(", ") : error;

          return notify(`Error: ${message}`, { severity: "warning" });
        }

        queryClient
          .invalidateQueries({
            queryKey: [QUERIES.ENGINES],
          })
          .then(() => {
            if (!engines.data.length) {
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
    (body: Pick<TSearchEngine, "identifier">) =>
      fetch(ENDPOINTS.ENGINES, {
        method: "DELETE",
        body: JSON.stringify(body),
      }),
    {
      async onSuccess(response) {
        const responseJson = await response.json();

        if (!response.ok) {
          const { error } = responseJson;
          const message = Array.isArray(error) ? error.join(", ") : error;

          return notify(`Error: ${message}`, { severity: "warning" });
        }

        queryClient
          .invalidateQueries({
            queryKey: [QUERIES.ENGINES],
          })
          .then(() => {
            const { identifier } = responseJson.toString();

            if (searchInput.engine === identifier && engines.data.length > 1) {
              /**
               * User deleted the selected engine and more exist. Update
               * selected engine to the first one found.
               */
              const newEngine = engines.data.find(
                (engine) => engine !== identifier,
              ).identifier;

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
    (body: { identifier: TSearchEngine["identifier"]; data: TSearchEngine }) =>
      fetch(ENDPOINTS.ENGINES, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    {
      async onSuccess(response) {
        if (!response.ok) {
          const { error } = await response.json();
          const message = Array.isArray(error) ? error.join(", ") : error;
          return notify(`Error: ${message}`, { severity: "warning" });
        }

        queryClient.invalidateQueries({
          queryKey: [QUERIES.ENGINES],
        });
      },
    },
  );

  return { engines, create, remove, update };
}
