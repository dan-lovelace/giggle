import { DBTEngine } from "@giggle/types";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { request } from ".";
import { useSearchData, useToast } from "../contexts";
import { ENDPOINTS } from "../lib/endpoints";
import { QUERIES } from "../lib/queries";

export function useEngines() {
  const { searchInput, setSearchInput } = useSearchData();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const engines = useQuery<Array<DBTEngine>>(
    QUERIES.ENGINES,
    () => request<Array<DBTEngine>>(ENDPOINTS.ENGINES),
    {
      onError(error: string) {
        notify(error, { severity: "warning" });
      },
    },
  );

  const { mutate: insert } = useMutation(
    (body: DBTEngine) =>
      request<DBTEngine>(ENDPOINTS.ENGINES, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    {
      onSuccess(response) {
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
                engine: response.identifier,
              });
            }
          });
      },
      onError(error: string) {
        notify(error, { severity: "warning" });
      },
    },
  );

  const { mutate: remove } = useMutation(
    (body: Pick<DBTEngine, "identifier">) =>
      request<Pick<DBTEngine, "identifier">>(ENDPOINTS.ENGINES, {
        method: "DELETE",
        body: JSON.stringify(body),
      }),
    {
      onSuccess(response) {
        queryClient
          .invalidateQueries({
            queryKey: [QUERIES.ENGINES],
          })
          .then(() => {
            const { identifier } = response;
            const newEngine = engines.data?.find(
              (engine) => engine.identifier !== identifier,
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
      onError(error: string) {
        notify(error, { severity: "warning" });
      },
    },
  );

  const { mutate: update } = useMutation(
    (body: { identifier: DBTEngine["identifier"]; data: DBTEngine }) =>
      request<DBTEngine>(ENDPOINTS.ENGINES, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [QUERIES.ENGINES],
        });
      },
      onError(error: string) {
        notify(error, { severity: "warning" });
      },
    },
  );

  return { engines, insert, remove, update };
}
