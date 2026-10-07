import { Phone as renderConfig } from "./Phone.render";
import type { PhoneProps } from "./Phone.render";
export type { PhoneProps } from "./Phone.render";
import { msg } from "@yext/visual-editor/section-library-support";
import { ThemeOptions } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import {
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";
// Phone field definitions used in Phone and CoreInfoSection
export const PhoneDataFields: YextFields<PhoneProps["data"]> = {
  number: {
    type: "entityField",
    label: msg("fields.phoneNumber", "Phone Number"),
    filter: {
      types: ["type.phone"],
    },
  },
  label: {
    type: "translatableString",
    label: msg("fields.label", "Label"),
    filter: { types: ["type.string"] },
  },
};

// Phone style definitions used in Phone and CoreInfoSection
export const PhoneStyleFields: YextFields<PhoneProps["styles"]> = {
  phoneFormat: {
    label: msg("fields.phoneFormat", "Phone Format"),
    type: "radio",
    options: ThemeOptions.PHONE_OPTIONS,
  },
  // By adding `<boolean>`, we make the type explicit.
  includePhoneHyperlink: {
    label: msg("fields.includePhoneHyperlink", "Include Phone Hyperlink"),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
  includeIcon: {
    label: msg("fields.showIcon", "Show Icon"),
    type: "radio",
    options: ThemeOptions.SHOW_HIDE,
  },
  color: {
    type: "basicSelector",
    label: msg("fields.color", "Color"),
    options: "SITE_COLOR",
  },
};

export const defaultPhoneDataProps: PhoneProps["data"] = {
  number: {
    field: "mainPhone",
    constantValue: "",
  },
  label: { defaultValue: "Phone" },
};

export const PhoneFields: YextFields<PhoneProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: PhoneDataFields,
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: PhoneStyleFields,
  },
};

export const Phone: YextComponentConfig<PhoneProps> = {
  label: msg("components.phone", "Phone"),
  fields: PhoneFields,
  defaultProps: {
    data: defaultPhoneDataProps,
    styles: {
      phoneFormat: "domestic",
      includePhoneHyperlink: true,
      includeIcon: true,
    },
  },
  resolveFields: (data) => resolveDataFromParent(PhoneFields, data),
  render: renderConfig.render,
};
