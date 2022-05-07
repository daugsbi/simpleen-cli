import path from "path";
import { CLIError } from "@oclif/errors";
import { createData, getData } from "./api";
import { Formality, DataFormat, Interpolation, SimpleenConfig } from "./config";
import { TranslationData } from "./translation";

export type Segment = {
  path: string;
  entry: string;
  source_language: string;
  source_entry: string;
  target_language: string;
};

export type File = {
  name: string;
  filepath: string;
  dataformat: DataFormat;
  interpolation: Interpolation;
  sourceLanguage: string;
  targetLanguages: string[];
};

export type FileResponse = {
  id: string;
  formality: Formality;
} & File;

export type UploadSyncData = {
  dataformat: DataFormat;
  sourceData: TranslationData;
  targetData: TranslationData;
  sourceLanguage: string;
  targetLanguage: string;
  file: string;
  interpolation: Interpolation;
};

/**
 * Returns a filename without extension (i.e. /locales/en.json -> en)
 * @param path without variables
 */
export function getFileName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Get DataFormat from File
 * @param filePath to the target files
 */
export function getDataFormatfromFile(filePath: string): DataFormat {
  const extension = path.extname(filePath).toUpperCase();

  switch (extension) {
    case ".JSON": {
      return "JSON";
    }
    case ".PO": {
      return "PO";
    }
    case ".YML":
    case ".YAML": {
      return "YAML";
    }
    case ".PROPERTIES": {
      return "Properties";
    }
    case ".MD":
    case ".MDX": {
      return "Markdown";
    }
    case ".JS":
    case ".TS":
    case ".JSX":
    case ".TSX": {
      throw new CLIError(
        "Dataformat not supported: Use an extractor for your i18n library, see https://simpleen.io/documentation/translate-cli"
      );
    }
    default: {
      throw new CLIError("Dataformat not supported for extension " + extension);
    }
  }
}

/**
 * Saves new file or returns
 */
export async function saveFile(
  config: SimpleenConfig,
  file: File
): Promise<FileResponse> {
  // Check if file already exist
  const fileList = await getData<FileResponse[]>(config, "files", {
    name: file.name,
    filepath: file.filepath,
    _sort: "id:desc",
  });

  // Return existing file from API
  if (fileList[0]) {
    return fileList[0];
  }

  // Create new file
  const createdFile = await createData<FileResponse>(config, "files", {
    ...file,
    formality: "default",
  });
  return createdFile;
}

/**
 * Uploads file data
 */
export function uploadData(
  config: SimpleenConfig,
  syncData: UploadSyncData
): unknown {
  if (syncData.dataformat == "Markdown") {
    throw new Error("Upload of Markdown is currently not supported");
  }

  return createData(config, "segments/upload", {
    ...syncData,
    sourceData: syncData.sourceData,
    targetData: syncData.targetData,
  });
}

export default {
  getFileName,
  saveFile,
  uploadData,
};
