import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'

const storage = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN });
window.Web3Storage = Web3Storage;

window.storage = storage;

export function jsonFile(filename, obj) {
  return new File([JSON.stringify(obj)], filename)
}

export function ipfsCidUrl(cid, file) {
  return `https://${cid}.ipfs.dweb.link/${encodeURI(file)}`;
}

export async function pinFileToIpfs(file, metadata) {
  window.file = file;
  try {
    const metadataFile = jsonFile('metadata.json', {
      name: file.name,
      from: 'web',
      ...metadata,
    });
    const cid = await storage.put([file, metadataFile]);
    return {
      cid,
      filename: file.name,
    };
  }
  catch (err) {
    return Promise.reject(err);
  }
}

export function cidFromUrl(url = '') {
  return url.split('/').pop();
}


export async function unpinIpfsFileByCid(cid) {
  return Promise.reject('Need method');
  // try {
  //   const res = await storage.delete(cid);
  //   return res;
  // }
  // catch (err) {
  //   return Promise.reject(err);
  // }
}
