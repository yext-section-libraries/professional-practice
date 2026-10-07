import { ProfessionalPracticeTeamSection as renderConfig } from "./ProfessionalPracticeTeamSection.render";
import type { ProfessionalPracticeTeamSectionProps } from "./ProfessionalPracticeTeamSection.render";
import { teamMembersSource } from "./ProfessionalPracticeTeamSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  getDefaultRTF,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const ProfessionalPracticeTeamSectionFields: YextFields<ProfessionalPracticeTeamSectionProps> =
  {
    section: {
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        cardBackgroundColor: {
          label: msg("fields.cardBackgroundColor", "Card Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    heading: {
      label: msg("fields.heading", "Heading"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.options.text", "Text"),
          filter: { types: ["type.string"] },
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
          filter: { types: ["type.rich_text_v2"] },
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
    members: {
      label: msg("fields.teamMembers", "Team Members"),
      type: "object",
      objectFields: {
        data: teamMembersSource.field,
        styles: {
          label: msg("fields.teamCardPresentation", "Team Card Presentation"),
          type: "object",
          objectFields: {
            image: {
              label: msg("fields.imageStyles", "Image Styles"),
              type: "styledImage",
            },
            imageAspectRatio: {
              label: msg("fields.imageAspectRatio", "Image Aspect Ratio"),
              type: "number",
            },
            fallbackAvatarBackgroundColor: {
              label: msg(
                "fields.fallbackAvatarBackgroundColor",
                "Fallback Avatar Background Color",
              ),
              type: "basicSelector",
              options: "BACKGROUND_COLOR",
            },
            name: {
              label: msg("fields.nameStyles", "Name Styles"),
              type: "styledText",
            },
            nameFontColor: {
              label: msg("fields.nameFontColor", "Name Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            jobTitle: {
              label: msg("fields.jobTitleStyles", "Job Title Styles"),
              type: "styledText",
            },
            jobTitleFontColor: {
              label: msg("fields.jobTitleFontColor", "Job Title Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

export const ProfessionalPracticeTeamSection: YextComponentConfig<ProfessionalPracticeTeamSectionProps> =
  {
    label: "Team",
    fields: ProfessionalPracticeTeamSectionFields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "palette-secondary",
        },
        cardBackgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: "Meet The Grooming Team",
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
              "Our experienced team brings calm, detail-oriented care to every appointment.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      members: {
        data: teamMembersSource.defaultValue,
        styles: {
          image: { borderRadius: "default" },
          imageAspectRatio: 1,
          fallbackAvatarBackgroundColor: {
            selectedColor: "palette-primary",
            contrastingColor: "palette-primary-contrast",
          },
          name: defaultTextStyles,
          nameFontColor: undefined,
          jobTitle: defaultTextStyles,
          jobTitleFontColor: undefined,
        },
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeTeamSection",
  displayName: "Team",
  description: "Team Section",
  pageSetTypes: ["ENTITY"],
};
