import { ProfessionalPracticeCoverageSection as renderConfig } from "./ProfessionalPracticeCoverageSection.render";
import type { ProfessionalPracticeCoverageSectionProps } from "./ProfessionalPracticeCoverageSection.render";
import { cardBackgroundColor } from "./ProfessionalPracticeCoverageSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  getDefaultRTF,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const sectionColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const defaultIconBackgroundColor: ThemeColor = {
  selectedColor: "palette-quaternary-light",
  contrastingColor: "palette-secondary",
};

const ProfessionalPracticeCoverageSectionFields: YextFields<ProfessionalPracticeCoverageSectionProps> =
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
    cardBackgroundColor: {
      label: msg("fields.cardBackgroundColor", "Card Background Color"),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    iconBackgroundColor: {
      label: msg("fields.iconBackgroundColor", "Icon Background Color"),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    heading: {
      label: msg("fields.heading", "Heading"),
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
    intro: {
      label: msg("fields.intro", "Intro"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.options.text", "Text"),
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    radius: {
      label: msg("fields.radius", "Radius"),
      type: "number",
    },
    limit: {
      label: msg("fields.limit", "Limit"),
      type: "number",
    },
    showAddress: {
      label: msg("fields.showAddress", "Show Address"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
    showPhone: {
      label: msg("fields.showPhone", "Show Phone"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
    showHours: {
      label: msg("fields.showHours", "Show Hours"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
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
      },
    },
    phone: {
      label: msg("fields.options.phone", "Phone"),
      type: "object",
      objectFields: {
        phoneFormat: {
          label: msg("fields.phoneNumberFormat", "Phone Number Format"),
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
        includeHyperlink: {
          label: msg("fields.includePhoneHyperlink", "Include Phone Hyperlink"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    hoursStyles: {
      label: msg("fields.hoursStyles", "Hours Styles"),
      type: "object",
      objectFields: {
        showCurrentStatus: {
          label: msg("fields.showCurrentStatus", "Show Current Status"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        timeFormat: {
          label: msg("fields.timeFormat", "Time Format"),
          type: "select",
          options: [
            {
              label: msg("fields.options.hour12Label", "12 Hour"),
              value: "12h",
            },
            {
              label: msg("fields.options.hour24Label", "24 Hour"),
              value: "24h",
            },
          ],
        },
        dayOfWeekFormat: {
          label: msg("fields.dayOfWeekFormatLabel", "Day Of Week Format"),
          type: "select",
          options: [
            { label: msg("fields.options.short", "Short"), value: "short" },
            { label: msg("fields.options.long", "Long"), value: "long" },
          ],
        },
        showDayNames: {
          label: msg("fields.showDayNames", "Show Day Names"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
  };

export const ProfessionalPracticeCoverageSection: YextComponentConfig<ProfessionalPracticeCoverageSectionProps> =
  {
    label: "Coverage",
    fields: ProfessionalPracticeCoverageSectionFields,
    defaultProps: {
      section: {
        backgroundColor: sectionColor,
        visibleOnLivePage: true,
      },
      cardBackgroundColor,
      iconBackgroundColor: defaultIconBackgroundColor,
      heading: {
        text: {
          field: "",
          constantValue: "Our Service Fleet Hubs & Coverage",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      intro: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Our service vans routinely visit West Falls Church, Merrifield, Fairview Park, and Holmes Run Acres. Don't see your neighborhood listed? Give us a call—we are continuously expanding our service routes to meet demand.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      radius: 10,
      limit: 3,
      showAddress: true,
      showPhone: true,
      showHours: true,
      address: {
        showRegion: true,
        showCountry: false,
      },
      phone: {
        phoneFormat: "domestic",
        includeHyperlink: true,
      },
      hoursStyles: {
        showCurrentStatus: true,
        timeFormat: "12h",
        dayOfWeekFormat: "long",
        showDayNames: true,
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeCoverageSection",
  displayName: "Coverage",
  description: "Coverage Section",
  pageSetTypes: ["ENTITY"],
};
