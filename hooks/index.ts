import { useMutation, useQuery, useQueryClient } from "react-query";

import { useToastContext } from "../contexts/toast";
import { ENDPOINTS } from "../lib/endpoints";
import { QUERIES } from "../lib/queries";
import { TSearchEngine } from "../types/common";

export function useEngines() {
  const { notify } = useToastContext();
  const queryClient = useQueryClient();
  const { data } = useQuery<Array<TSearchEngine>>(QUERIES.ENGINES, () =>
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

  const { mutate: remove } = useMutation(
    (body: Pick<TSearchEngine, "identifier">) =>
      fetch(ENDPOINTS.ENGINES, {
        method: "DELETE",
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

  return { engines: data, create, remove, update };
}
