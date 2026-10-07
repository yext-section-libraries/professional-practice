import type { LocatorResultCardProps } from "./LocatorResultCard.render";
export type {
  LocatorResultCardProps,
  DistanceDisplayOption,
  Location,
} from "./LocatorResultCard.render";
export {
  DEFAULT_LOCATOR_RESULT_CARD_PROPS,
  LocatorResultCard,
} from "./LocatorResultCard.render";
import { ThemeOptions } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { type BasicSelectorField } from "@yext/visual-editor/section-library-support";
import type {
  YextCustomFieldRenderProps,
  YextObjectField,
} from "@yext/visual-editor/section-library-support";
import {
  buildLocatorDisplayOptions,
  type ImageField,
} from "@yext/visual-editor/section-library-support";
import { ConstantValueModeToggler } from "@yext/visual-editor/section-library-support";
import { type EmbeddedStringOption } from "@yext/visual-editor/section-library-support";
import { HoursTableStyleFields } from "../contentBlocks/HoursTable";
import { useTemplateMetadata } from "@yext/visual-editor/section-library-support";
import { FieldTypeData } from "@yext/visual-editor/section-library-support";
const LOCATOR_IMAGE_CONSTANT_CONFIG: ImageField = {
  type: "image",
  label: msg("fields.image", "Image"),
  getAltTextOptions: (templateMetadata) =>
    buildLocatorDisplayOptions(templateMetadata?.locatorDisplayFields),
};

const getDisplayFieldOptions = (
  fieldTypeId: string | string[],
): EmbeddedStringOption[] => {
  // TODO: This breaks the rule of hooks, refactor the custom render path
  const templateMetadata = useTemplateMetadata();
  if (!templateMetadata?.locatorDisplayFields) {
    return [];
  }
  const displayFields = templateMetadata.locatorDisplayFields;
  const fieldTypeIds = Array.isArray(fieldTypeId) ? fieldTypeId : [fieldTypeId];
  return Object.keys(templateMetadata.locatorDisplayFields)
    .filter((key) => fieldTypeIds.includes(displayFields[key].field_type_id))
    .map((key) => {
      const fieldData: FieldTypeData = displayFields[key];
      return {
        label: fieldData.field_name,
        value: key,
      };
    });
};

const DisplayFieldSelector = (
  fieldTypeId: string | string[],
): BasicSelectorField => ({
  type: "basicSelector",
  label: msg("fields.field", "Field"),
  options: () => getDisplayFieldOptions(fieldTypeId),
  translateOptions: false,
});

export const LocatorResultCardFields: YextObjectField<LocatorResultCardProps> =
  {
    label: msg("fields.resultCard", "Result Card"),
    type: "object",
    objectFields: {
      entityType: {
        label: msg("fields.entityType", "Entity Type"),
        type: "text",
        visible: false,
      },
      primaryHeading: {
        label: msg("fields.primaryHeading", "Primary Heading"),
        type: "object",
        objectFields: {
          constantValueEnabled: {
            type: "custom",
            render: ({
              value,
              onChange,
            }: YextCustomFieldRenderProps<boolean | undefined>) => (
              <ConstantValueModeToggler
                fieldTypeFilter={["type.string"]}
                constantValueEnabled={value ?? false}
                toggleConstantValueEnabled={(constantValueEnabled) =>
                  onChange(constantValueEnabled)
                }
                label={pt(msg("fields.primaryHeading", "Primary Heading"))}
                showLocale={true}
              />
            ),
          },
          constantValue: {
            type: "translatableString",
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions(["type.string"]),
          },
          field: DisplayFieldSelector(["type.string", "type.boolean"]),
          trueDisplayText: {
            type: "translatableString",
            label: msg("fields.whenTrue", "When true"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          falseDisplayText: {
            type: "translatableString",
            label: msg("fields.whenFalse", "When false"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          headingLevel: {
            type: "basicSelector",
            label: msg("fields.headingLevel", "Heading Level"),
            options: "HEADING_LEVEL",
          },
          color: {
            type: "basicSelector",
            label: msg("fields.color", "Color"),
            options: "SITE_COLOR",
          },
        },
      },
      secondaryHeading: {
        label: msg("fields.secondaryHeading", "Secondary Heading"),
        type: "object",
        objectFields: {
          constantValueEnabled: {
            type: "custom",
            render: ({
              value,
              onChange,
            }: YextCustomFieldRenderProps<boolean | undefined>) => (
              <ConstantValueModeToggler
                fieldTypeFilter={["type.string"]}
                constantValueEnabled={value ?? false}
                toggleConstantValueEnabled={(constantValueEnabled) =>
                  onChange(constantValueEnabled)
                }
                label={pt(msg("fields.secondaryHeading", "Secondary Heading"))}
                showLocale={true}
              />
            ),
          },
          constantValue: {
            type: "translatableString",
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions(["type.string"]),
          },
          field: DisplayFieldSelector(["type.string", "type.boolean"]),
          trueDisplayText: {
            type: "translatableString",
            label: msg("fields.whenTrue", "When true"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          falseDisplayText: {
            type: "translatableString",
            label: msg("fields.whenFalse", "When false"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          variant: {
            label: msg("fields.variant", "Variant"),
            type: "radio",
            options: ThemeOptions.BODY_VARIANT,
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      tertiaryHeading: {
        label: msg("fields.tertiaryHeading", "Tertiary Heading"),
        type: "object",
        objectFields: {
          constantValueEnabled: {
            type: "custom",
            render: ({
              value,
              onChange,
            }: YextCustomFieldRenderProps<boolean | undefined>) => (
              <ConstantValueModeToggler
                fieldTypeFilter={["type.string"]}
                constantValueEnabled={value ?? false}
                toggleConstantValueEnabled={(constantValueEnabled) =>
                  onChange(constantValueEnabled)
                }
                label={pt(msg("fields.tertiaryHeading", "Tertiary Heading"))}
                showLocale={true}
              />
            ),
          },
          constantValue: {
            type: "translatableString",
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions(["type.string"]),
          },
          field: DisplayFieldSelector(["type.string", "type.boolean"]),
          trueDisplayText: {
            type: "translatableString",
            label: msg("fields.whenTrue", "When true"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          falseDisplayText: {
            type: "translatableString",
            label: msg("fields.whenFalse", "When false"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          variant: {
            label: msg("fields.variant", "Variant"),
            type: "radio",
            options: ThemeOptions.BODY_VARIANT,
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      icons: {
        label: msg("fields.icons", "Icons"),
        type: "radio",
        options: [
          { label: msg("fields.options.show", "Show"), value: true },
          { label: msg("fields.options.hide", "Hide"), value: false },
        ],
      },
      accentColor: {
        type: "basicSelector",
        label: msg("fields.accentColor", "Accent Color"),
        options: "SITE_COLOR",
      },
      hours: {
        label: msg("fields.hours", "Hours"),
        type: "object",
        objectFields: {
          field: DisplayFieldSelector("type.hours"),
          table: {
            type: "object",
            label: msg("fields.hoursColumn", "Hours Column"),
            objectFields: HoursTableStyleFields,
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      address: {
        label: msg("fields.address", "Address"),
        type: "object",
        objectFields: {
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
            label: msg(
              "fields.showGetDirectionsLink",
              "Show Get Directions Link",
            ),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      phone: {
        label: msg("fields.phone", "Phone"),
        type: "object",
        objectFields: {
          field: DisplayFieldSelector("type.phone"),
          phoneFormat: {
            label: msg("fields.phoneFormat", "Phone Format"),
            type: "radio",
            options: [
              {
                label: msg("fields.options.domestic", "Domestic"),
                value: "domestic",
              },
              {
                label: msg("fields.options.international", "International"),
                value: "international",
              },
            ],
          },
          includePhoneHyperlink: {
            label: msg(
              "fields.includePhoneHyperlink",
              "Include Phone Hyperlink",
            ),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      email: {
        label: msg("fields.email", "Email"),
        type: "object",
        objectFields: {
          field: DisplayFieldSelector("type.string"),
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      services: {
        label: msg("fields.services", "Services"),
        type: "object",
        objectFields: {
          field: DisplayFieldSelector("type.string"),
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      primaryCTA: {
        label: msg("fields.primaryCTA", "Primary CTA"),
        type: "object",
        objectFields: {
          label: {
            type: "translatableString",
            label: msg("fields.label", "Label"),
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions("type.string"),
          },
          variant: {
            label: msg("fields.ctaVariant", "CTA Variant"),
            type: "radio",
            options: ThemeOptions.CTA_VARIANT,
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
          link: {
            type: "translatableString",
            label: msg("fields.link", "Link"),
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions("type.string"),
          },
          normalizeLink: {
            label: msg("fields.normalizeLink", "Normalize Link"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
        },
      },
      secondaryCTA: {
        label: msg("fields.secondaryCTA", "Secondary CTA"),
        type: "object",
        objectFields: {
          label: {
            type: "translatableString",
            label: msg("fields.label", "Label"),
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions("type.string"),
          },
          link: {
            type: "translatableString",
            label: msg("fields.link", "Link"),
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions("type.string"),
          },
          normalizeLink: {
            label: msg("fields.normalizeLink", "Normalize Link"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          variant: {
            label: msg("fields.ctaVariant", "CTA Variant"),
            type: "radio",
            options: ThemeOptions.CTA_VARIANT,
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      image: {
        label: msg("fields.image", "Image"),
        type: "object",
        objectFields: {
          constantValueEnabled: {
            type: "custom",
            render: ({
              value,
              onChange,
            }: YextCustomFieldRenderProps<boolean | undefined>) => (
              <ConstantValueModeToggler
                fieldTypeFilter={["type.image"]}
                constantValueEnabled={value ?? false}
                toggleConstantValueEnabled={(constantValueEnabled) =>
                  onChange(constantValueEnabled)
                }
                label={msg("fields.image", "Image")}
                showLocale={true}
              />
            ),
          },
          constantValue: LOCATOR_IMAGE_CONSTANT_CONFIG,
          field: DisplayFieldSelector("type.image"),
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
    },
  };
