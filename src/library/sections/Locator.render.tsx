import type { SectionRenderConfig } from "@yext/visual-editor";
import { LocatorComponent as renderConfig } from "../shared/components/locator/Locator.render";
import type { LocatorProps } from "../shared/components/locator/Locator.render";

export const Locator: SectionRenderConfig<LocatorProps> = {
  render: renderConfig.render,
};
