import axios from "axios";
import { SimpleenConfig } from "./config";

export type UsageData = {
  plan: {
    name: string;
    maxSegment: number;
  };
  usage: {
    segment: number;
  };
};

/**
 * Translates into language and merge with already translated data
 * @param config loaded simpleen config file
 */
export function getUsage(config: SimpleenConfig): Promise<UsageData> {
  return new Promise((resolve, reject) => {
    // Translate
    axios
      .get("https://api.simpleen.io/usages/info", {
        params: {
          auth_key: config.auth_key,
        },
      })
      .then((value: { data: UsageData }) => {
        // merge with translatedData
        resolve(value.data);
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          reject(
            "Authentication error - check your authentication key in your config file"
          );
        }
        reject(
          `${e.response ? e.response.status : ""} - Request failed ${e.message}`
        );
      });
  });
}
