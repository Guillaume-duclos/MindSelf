import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";

type Question =
  | {
      title: string;
      description?: string;
      astralSign?: false;
      storageKey: StorageKey;
      page: Page;
      nextPage?: Page;
      options: { label: string; value: string }[];
    }
  | {
      title: string;
      description?: string;
      astralSign: true;
      storageKey: StorageKey;
      page: Page;
      nextPage?: Page;
    };

export default Question;
