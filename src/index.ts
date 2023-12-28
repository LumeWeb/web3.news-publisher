import * as core from "@actions/core";
import { S5Client } from "@lumeweb/s5-js";
import { HDKey } from "ed25519-keygen/hdkey";
import * as bip39 from "@scure/bip39";
import { BIP44_PATH } from "./constants";
import fs from "fs/promises";
import path from "path";
import { CID } from "@lumeweb/libs5";

async function run() {
  try {
    const s5Node = core.getInput("node", { required: true });
    const seed = core.getInput("seed", { required: true });
    const folder = core.getInput("folder");

    const hdkey = HDKey.fromMasterSeed(await bip39.mnemonicToSeed(seed)).derive(
      BIP44_PATH,
    );

    const directory = await readDirectoryRecursively(path.resolve(folder));

    const client = new S5Client(s5Node);
    const uploadedApp = await client.uploadWebapp(directory);

    const entry = await client.createEntry(hdkey.privateKey, uploadedApp.cid);

    const cid = uploadedApp.cid.toString();
    const rcid = CID.fromSignedRegistryEntry(entry).toString();

    core.setOutput("cid", cid);
    core.setOutput("resolver-cid", rcid);

    console.log(
      `Website published to web3.news with CID: ${cid}, Resolver CID: ${rcid}`,
    );
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();

function trailingSlashIt(str: string) {
  return unTrailingSlashIt(str) + "/";
}

function unTrailingSlashIt(str: string): string {
  if (str.endsWith("/") || str.endsWith("\\")) {
    return unTrailingSlashIt(str.slice(0, -1));
  }

  return str;
}

async function readDirectoryRecursively(
  dir: string,
  baseDir = dir,
  filelist: { [name: string]: any } = {},
) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = await fs.stat(filepath);

    if (stat.isDirectory()) {
      await readDirectoryRecursively(filepath, baseDir, filelist);
    } else {
      const relPath = filepath.replace(trailingSlashIt(baseDir), "");
      filelist[relPath] = new File([await fs.readFile(filepath)], relPath);
    }
  }
  return filelist;
}
