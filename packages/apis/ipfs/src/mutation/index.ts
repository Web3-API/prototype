import { Http_Mutation, Http_ResponseType } from "./w3/imported";
import { Input_addFile, AddResult, Input_addFolder, Http_Response, DirectoryBlob, AddFileOptions } from "./w3";
import { IpfsError } from "../error";
import { convertDirectoryBlobToFormData } from "./convert";
import {parseAddDirectoryResponse, parseAddFileResponse} from "./parse";

export function addFile(input: Input_addFile): AddResult {
  const addResponse = executeAddFileRequest(
    input.fileEntry.name, 
    input.fileEntry.data, 
    input.ipfsUrl,
    input.options
  );
  return parseAddFileResponse(addResponse.body);
}

export function addFolder(input: Input_addFolder): AddResult[] {
  const addResponse = executeAddFolderRequest(
    input.directoryEntry, 
    input.ipfsUrl,
    input.options
  );
  return parseAddDirectoryResponse(addResponse.body);
}

function executeAddFileRequest(name: string, data: ArrayBuffer, ipfsUrl: string, options: AddFileOptions | null): Http_Response {
  // form appropriate url
  let url = ipfsUrl.concat("/api/v0/add");
  if(options != null) {
    url = generateUrlWithOptions(url, options);
  }
  // invoke add method
  const addResponse = Http_Mutation.post({
    url: url,
    request: {
      headers: [],
      urlParams: [],
      responseType: Http_ResponseType.TEXT,
      body: {
        formDataBody: {
          data: [{key: name, data: String.UTF8.decode(data), opts: null}]
        },
        rawBody: null,
        stringBody: null
      },
    }
  });
  // return response
  if(addResponse == null || addResponse.status != 200) {
    throw new IpfsError("addFile", addResponse.status, addResponse.statusText);
  }
  return addResponse;
}

function executeAddFolderRequest(directoryEntry: DirectoryBlob, ipfsUrl: string, options: AddFileOptions | null): Http_Response {
  // form appropriate url
  let url = ipfsUrl.concat("/api/v0/add");
  if(options != null) {
    url = generateUrlWithOptions(url, options);
  }
  // invoke add method
  const addResponse = Http_Mutation.post({
    url: url,
    request: {
      headers: [],
      urlParams: [],
      responseType: Http_ResponseType.TEXT,
      body: {
        formDataBody: {
          data: convertDirectoryBlobToFormData(directoryEntry)
        },
        stringBody: null,
        rawBody: null
      }
    }
  });
  // return response
  if(addResponse == null || addResponse.status != 200) {
    throw new IpfsError("addFolder", addResponse.status, addResponse.statusText);
  }
  return addResponse;
}

function generateUrlWithOptions(baseUrl: string, options: AddFileOptions): string {
  let opts: string[] = [];
  if(!options.onlyHash.isNull) { opts.push("only-hash=" + options.onlyHash.value.toString()) }
  if(!options.pin.isNull) { opts.push("pin=" + options.pin.value.toString()) }
  if(!options.wrapWithDirectory.isNull) { opts.push("wrap-with-directory=" + options.wrapWithDirectory.value.toString()) }
  return baseUrl + "?" + opts.join("&");
}