import type { Config } from "@puckeditor/core";
import { resolveDirectoryRootProps } from "@yext/visual-editor/section-library-support";
import {
  directoryRootConfig as directoryRenderRoot,
  locatorRootConfig as locatorRenderRoot,
} from "./roots.render";

export const directoryRootConfig: NonNullable<Config["root"]> = {
  resolveData: (data: any, params: any) => ({
    ...data,
    props: resolveDirectoryRootProps(
      data.props ?? {},
      params.metadata?.streamDocument ?? {},
    ),
  }),
  render: directoryRenderRoot.render,
};

export const locatorRootConfig: NonNullable<Config["root"]> = {
  render: locatorRenderRoot.render,
};
