import path from "node:path";
import fs from "node:fs/promises";

export default class DirActions {
  static delete = async (deletePath: string) => {
    try {
      return await fs.rm(deletePath, { recursive: true, force: true });
    } catch (error) {
      console.error(
        `Error deleting directory or file: ${(error as Error).message}`
      );
    }
  };

  static copy = async (sourcePath: string, destinationPath: string) => {
    try {
      await fs.mkdir(destinationPath, { recursive: true });
      const items = await fs.readdir(sourcePath);
      for (const item of items) {
        const sourceItemPath = path.join(sourcePath, item);
        const destinationItemPath = path.join(destinationPath, item);
        const stats = await fs.stat(sourceItemPath);

        // console.log(`Copy file: ${item}`);

        if (stats.isFile()) {
          await fs.copyFile(sourceItemPath, destinationItemPath);
        } else {
          await DirActions.copy(sourceItemPath, destinationItemPath);
        }
      }
    } catch (error) {
      console.error(`Error copying directory: ${(error as Error).message}`);
    }
  };

  static move = async (sourcePath: string, destinationPath: string) => {
    await DirActions.copy(sourcePath, destinationPath);
    await DirActions.delete(sourcePath);
  };

  static replace = async (sourcePath: string, destinationPath: string) => {
    // console.log("Start deleting...");
    await DirActions.delete(destinationPath);
    // console.log("Start copying...");
    await DirActions.copy(sourcePath, destinationPath);
  };
}
