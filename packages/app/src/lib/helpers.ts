/**
 * Gets a response's body in JSON format. It needs to be cloned in order to
 * consume the data more than once so we can take action at both the hook and
 * component level.
 */
export function getResponseBody(response: Response) {
  return response.clone().json();
}
