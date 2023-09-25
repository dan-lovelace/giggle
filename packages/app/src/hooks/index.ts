export function request<T>(input: RequestInfo, init?: RequestInit) {
  return new Promise<T>((res, rej) => {
    fetch(input, init)
      .then(async (response) => {
        const body = await response.json();

        if (!response.ok) {
          return rej(String(body.error));
        }

        res(body);
      })
      .catch((error) => {
        rej(String(error.message));
      });
  });
}

export * from "./engines";
