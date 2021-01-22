import axios from "axios";
import { SimpleenConfig } from "./config";

const API_URL = "https://api.simpleen.io/";

export function getData<T>(config: SimpleenConfig, resource: string, params: any = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    axios
      .get(
        API_URL + resource,
        {
          params: {
            auth_key: config.auth_key,
            ...params
          },
        }
      )
      .then((value: { data: T }) => {
        resolve(value.data);
      })
      .catch((e) => {
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          reject(
            "Authentication error - check your authentication key in your config file"
          );
        }
        reject(
          `${e.response ? e.response.status : ""} - ${e.message}`
        );
      });
  });
}

export function createData<T>(config: SimpleenConfig, resource: string, entry: Partial<T> = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    return axios
      .post(
        API_URL + resource,
        {
          ...entry
        },
        {
          params: {
            auth_key: config.auth_key,
          },
        }
      )
      .then((value: { data: T }) => {
        resolve(value.data);
      })
      .catch((e) => {
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          reject(
            "Authentication error - check your authentication key in your config file"
          );
        }
        reject(
          `${e.response ? e.response.status : ""} - ${e.message}}`
        );
      });
  });
}

export function updataData<T>(config: SimpleenConfig, resource: string, entry: Partial<T> = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    axios
      .post(
        API_URL + resource,
        {
          ...entry
        },
        {
          params: {
            auth_key: config.auth_key,
          },
        }
      )
      .then((value: { data: T }) => {
        // merge with translatedData
        resolve(value.data);
      })
      .catch((e) => {
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          reject(
            "Authentication error - check your authentication key in your config file"
          );
        }
        reject(
          `${e.response ? e.response.status : ""} - ${e.message}}`
        );
      });
  });
}