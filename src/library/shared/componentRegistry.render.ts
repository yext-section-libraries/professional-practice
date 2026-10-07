import type { Config } from "@puckeditor/core";
import { HeadingText as SharedComponent0 } from "./components/contentBlocks/HeadingText.render";
import { BreadcrumbsSection as SharedComponent1 } from "./components/pageSections/Breadcrumbs.render";
import { DirectoryGrid as SharedComponent2 } from "./components/directory/DirectoryWrapper.render";
import { DirectoryCard as SharedComponent3 } from "./components/directory/DirectoryCard.render";
import { Address as SharedComponent4 } from "./components/contentBlocks/Address.render";
import { HoursStatus as SharedComponent5 } from "./components/contentBlocks/HoursStatus.render";
import { Phone as SharedComponent6 } from "./components/contentBlocks/Phone.render";
import { directoryRootConfig, locatorRootConfig } from "./roots.render";

/** Puck configs for the hidden internal components. */
export const sharedComponentConfigs: Record<
  string,
  Config["components"][string]
> = {
  HeadingTextSlot: SharedComponent0,
  BreadcrumbsSlot: SharedComponent1,
  DirectoryGrid: SharedComponent2,
  DirectoryCard: SharedComponent3,
  AddressSlot: SharedComponent4,
  HoursStatusSlot: SharedComponent5,
  PhoneSlot: SharedComponent6,
};

export const sharedRootConfigs: Partial<
  Record<string, NonNullable<Config["root"]>>
> = {
  DIRECTORY: directoryRootConfig,
  LOCATOR: locatorRootConfig,
};
