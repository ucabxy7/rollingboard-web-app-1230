import { UpdateProfileDialogRef } from "@/components/updateProfileDialog";
import { RefObject } from "react";

export class UpdateProfileDialogController {
  static ref: RefObject<UpdateProfileDialogRef | null> | null = null;

  static init(ref: RefObject<UpdateProfileDialogRef | null>) {
    this.ref = ref;
  }

  static async open(): Promise<boolean> {
    return (await this.ref?.current?.open()) ?? false;
  }
}
