import { HeadingText as renderConfig } from "./HeadingText.render";
import type { HeadingTextProps } from "./HeadingText.render";
export type { HeadingTextProps } from "./HeadingText.render";
import { msg } from "@yext/visual-editor/section-library-support";
import { ThemeOptions } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import {
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";
const headingTextFields: YextFields<HeadingTextProps> = {
  data: {
    label: msg("fields.data", "Data"),
    type: "object",
    objectFields: {
      text: {
        type: "entityField",
        label: msg("fields.text", "Text"),
        filter: {
          types: ["type.string"],
        },
      },
    },
  },
  styles: {
    label: msg("fields.styles", "Styles"),
    type: "object",
    objectFields: {
      level: {
        type: "basicSelector",
        label: msg("fields.headingLevel", "Heading Level"),
        options: "HEADING_LEVEL",
      },
      align: {
        label: msg("fields.headingAlign", "Heading Align"),
        type: "radio",
        options: ThemeOptions.ALIGNMENT,
      },
      color: {
        type: "basicSelector",
        label: msg("fields.color", "Color"),
        options: "SITE_COLOR",
      },
    },
  },
};

export const HeadingText: YextComponentConfig<HeadingTextProps> = {
  label: msg("components.headingText", "Heading Text"),
  fields: headingTextFields,
  resolveFields: (data) => resolveDataFromParent(headingTextFields, data),
  defaultProps: {
    data: {
      text: {
        field: "",
        constantValue: { defaultValue: "Text" },
        constantValueEnabled: true,
      },
    },
    styles: {
      level: 2,
      align: "left",
    },
  },
  render: renderConfig.render,
};
