import type { SectionRenderConfig } from "@yext/visual-editor";
import { Directory as renderConfig } from "../shared/components/directory/Directory.render";
import type { DirectoryProps } from "../shared/components/directory/Directory.render";

export const Directory: SectionRenderConfig<DirectoryProps> = {
  fields: renderConfig.fields,
  render: renderConfig.render,
};
