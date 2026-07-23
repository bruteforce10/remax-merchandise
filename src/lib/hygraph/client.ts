import { GraphQLClient } from "graphql-request";

import { readEndpoint, readToken, writeEndpoint, writeToken } from "./env";

/**
 * Hygraph GraphQL clients. Server-only — the write client carries a privileged
 * token and must never be imported into a Client Component.
 */

let readClient: GraphQLClient | null = null;
let writeClient: GraphQLClient | null = null;

/** Read client — public CDN endpoint, returns published content. */
export function hygraphRead(): GraphQLClient {
  if (!readClient) {
    const token = readToken();
    readClient = new GraphQLClient(readEndpoint(), {
      headers: token ? { authorization: `Bearer ${token}` } : {},
    });
  }
  return readClient;
}

/** Write client — regular Content API endpoint, authenticated for mutations. */
export function hygraphWrite(): GraphQLClient {
  if (!writeClient) {
    writeClient = new GraphQLClient(writeEndpoint(), {
      headers: { authorization: `Bearer ${writeToken()}` },
    });
  }
  return writeClient;
}
