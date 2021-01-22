import path from "path";
import { CLIError } from "@oclif/errors"
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
  sourceData: TranslationData,
  targetData: TranslationData,
  sourceLanguage: string;
  targetLanguage: string;
  file: string;
  interpolation: Interpolation;
}

/**
 * Returns a filename without extension (i.e. /locales/en.json -> en)
 * @param path without variables
 */
export function getFileName(filePath: string) {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Saves new file or returns 
 */
export async function saveFile(config: SimpleenConfig, file: File): Promise<FileResponse> {
  try {
    // Check if file already exist
    const fileList = await getData<FileResponse[]>(config, "files", {
      name: file.name,
      filepath: file.filepath,
      _sort: "id:desc"
    });

    // Return existing file from API
    if(fileList[0]) {
      return fileList[0];
    }

    // Create new file
    const createdFile = await createData<FileResponse>(config, "files", {
      ...file,
      formality: "default"
    })
    return createdFile;

  } catch(e) {
    throw e;
  }
}

/**
 * Uploads file data
 */
export function uploadData(config: SimpleenConfig, syncData: UploadSyncData) {
  return createData(config, "segments/upload", {
    ...syncData,
    sourceData: JSON.stringify(syncData.sourceData),
    targetData: JSON.stringify(syncData.targetData)
  });
}


export default {
  getFileName,
  saveFile,
  uploadData
};
