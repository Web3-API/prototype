import { query } from "./resolvers";

import { Plugin, PluginModules } from "@web3api/core-js";
import { execute, makePromise } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import fetch from "cross-fetch";
import gql from "graphql-tag";

export interface GraphNodeConfig {
  provider: string;
}

export class GraphNodePlugin extends Plugin {
  constructor(private _config: GraphNodeConfig) {
    super({ });
  }

  // TODO: generated types here from the schema.graphql to ensure safety `Resolvers<TQuery, TMutation>`
  public getModules(): PluginModules {
    return {
      query: query(this)
    };
  }

  public async query(subgraphId: string, query: string): Promise<string> {
    const link = createHttpLink({
      uri: `${this._config.provider}/subgraphs/id/${subgraphId}`,
      fetch
    });

    // TODO: get the errors, query typos are getting swallowed
    const result = await makePromise(
      execute(link, { query: gql(query) })
    );

    return JSON.stringify(result);
  }
}