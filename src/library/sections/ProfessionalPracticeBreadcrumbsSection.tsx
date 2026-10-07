import { ProfessionalPracticeBreadcrumbsSection as renderConfig } from "./ProfessionalPracticeBreadcrumbsSection.render";
import type { ProfessionalPracticeBreadcrumbsSectionProps } from "./ProfessionalPracticeBreadcrumbsSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const defaultSectionColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const ProfessionalPracticeBreadcrumbsSectionFields: YextFields<ProfessionalPracticeBreadcrumbsSectionProps> =
  {
    section: {
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    rootLabel: {
      label: msg("fields.rootLabel", "Root Label"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.options.text", "Text"),
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    includeCurrentLocation: {
      label: msg("fields.includeCurrentLocation", "Include Current Location"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
  };

export const ProfessionalPracticeBreadcrumbsSection: YextComponentConfig<ProfessionalPracticeBreadcrumbsSectionProps> =
  {
    label: "Breadcrumbs",
    fields: ProfessionalPracticeBreadcrumbsSectionFields,
    defaultProps: {
      section: {
        backgroundColor: defaultSectionColor,
        visibleOnLivePage: true,
      },
      rootLabel: {
        text: {
          field: "",
          constantValue: "All Locations",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      includeCurrentLocation: true,
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeBreadcrumbsSection",
  displayName: "Breadcrumbs",
  description: "Breadcrumbs Section",
  pageSetTypes: ["ENTITY"],
};
