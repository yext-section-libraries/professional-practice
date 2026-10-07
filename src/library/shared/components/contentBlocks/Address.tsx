import { Address as renderConfig } from "./Address.render";
import type { AddressProps } from "./Address.render";
export type { AddressProps } from "./Address.render";
import {
  ComponentData,
  DefaultComponentProps,
  setDeep,
} from "@puckeditor/core";
import { isCtaVariantWithColor } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import {
  ThemeOptions,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import {
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";
// Address field definition used in Address and CoreInfoSection
export const AddressDataField: YextFields<AddressProps["data"]> = {
  address: {
    type: "entityField",
    label: msg("fields.address", "Address"),
    filter: { types: ["type.address"] },
  },
};

// Address style fields used in Address and CoreInfoSection
export const AddressStyleFields: YextFields<AddressProps["styles"]> = {
  showRegion: {
    label: msg("fields.showRegion", "Show Region"),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
  showCountry: {
    label: msg("fields.showCountry", "Show Country"),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
  showGetDirectionsLink: {
    label: msg("fields.showGetDirectionsLink", "Show Get Directions Link"),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
  ctaVariant: {
    label: msg("fields.ctaVariant", "CTA Variant"),
    type: "radio",
    options: ThemeOptions.CTA_VARIANT,
  },
  color: {
    type: "basicSelector",
    label: msg("fields.linkColor", "Link Color"),
    options: "SITE_COLOR",
  },
};

export const addressFields: YextFields<AddressProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: AddressDataField,
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: AddressStyleFields,
  },
};

export const resolveAddressFields = (
  data: Omit<
    ComponentData<AddressProps, string, Record<string, DefaultComponentProps>>,
    "type"
  >,
) => {
  let updatedFields = resolveDataFromParent(addressFields, data);
  const showGetDirectionsLink = data.props.styles.showGetDirectionsLink;
  updatedFields = setDeep(
    updatedFields,
    "styles.objectFields.ctaVariant.visible",
    showGetDirectionsLink,
  );
  const ctaVariant = data.props.styles.ctaVariant;
  const showColor = isCtaVariantWithColor(ctaVariant);
  updatedFields = setDeep(
    updatedFields,
    "styles.objectFields.color.visible",
    showGetDirectionsLink && showColor,
  );

  return updatedFields;
};

export const Address: YextComponentConfig<AddressProps> = {
  label: msg("components.address", "Address"),
  fields: addressFields,
  defaultProps: {
    data: {
      address: {
        field: "address",
        constantValue: {
          line1: "",
          city: "",
          region: "",
          postalCode: "",
          countryCode: "",
        },
      },
    },
    styles: {
      showRegion: true,
      showCountry: false,
      showGetDirectionsLink: true,
      ctaVariant: "link",
      color: backgroundColors.color1.value,
    },
  },
  resolveFields: resolveAddressFields,
  render: renderConfig.render,
};
