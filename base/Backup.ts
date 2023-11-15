import DirActions from "../lib/filesystem/dirActions";
import path from "node:path";

export default class Backup {
  private static backupProfile = path.resolve(__dirname, "./../backup/Default");
  static userdataProfile = async (userdataDir: string) => {
    const profileDirToRemove = path.resolve(userdataDir, "Default");
    await DirActions.replace(Backup.backupProfile, profileDirToRemove);
  };
}
