import { getData } from "./api";
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
  return getData(config, "usages/info");
}
