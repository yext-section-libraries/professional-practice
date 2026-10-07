import { ProfessionalPracticeDetailsSection as renderConfig } from "./ProfessionalPracticeDetailsSection.render";
import type {
  PhoneItemProps,
  ProfessionalPracticeDetailsSectionProps,
} from "./ProfessionalPracticeDetailsSection.render";
import { iconBackgroundColor } from "./ProfessionalPracticeDetailsSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { type HoursType } from "@yext/pages-components";
import { defaultTextStyles } from "../shared/sectionHelpers";
const sectionColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const whiteColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const detailsIconOptions = [
  { label: msg("fields.options.location", "Location"), value: "location" },
  { label: msg("fields.options.clock", "Clock"), value: "clock" },
  { label: msg("fields.options.thumbsUp", "Thumbs Up"), value: "thumbsUp" },
] as const;

const ProfessionalPracticeDetailsSectionFields: YextFields<ProfessionalPracticeDetailsSectionProps> =
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
    iconBackgroundColor: {
      label: msg("fields.iconBackgroundColor", "Icon Background Color"),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    summary: {
      label: msg("fields.summary", "Summary"),
      type: "object",
      objectFields: {
        title: {
          label: msg("fields.title", "Title"),
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
        icon: {
          label: msg("fields.options.icon", "Icon"),
          type: "select",
          options: [...detailsIconOptions],
        },
        address: {
          type: "entityField",
          label: msg("fields.address", "Address"),
          filter: {
            types: ["type.address"],
          },
        },
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
        baseHubLabel: {
          label: msg("fields.baseHubLabel", "Base Hub Label"),
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
        serviceRadiusText: {
          label: msg("fields.serviceRadiusText", "Service Radius Text"),
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
        bookingLabel: {
          label: msg("fields.bookingLabel", "Booking Label"),
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
        phones: {
          label: msg("fields.phones", "Phones"),
          type: "object",
          objectFields: {
            items: {
              label: msg("fields.items", "Items"),
              type: "array",
              arrayFields: {
                number: {
                  type: "entityField",
                  label: msg("fields.number", "Number"),
                  filter: {
                    types: ["type.phone"],
                  },
                },
                label: {
                  label: msg("fields.label", "Label"),
                  type: "text",
                },
              },
              defaultItemProps: {
                number: {
                  field: "",
                  constantValue: "",
                  constantValueEnabled: true,
                },
                label: "",
              },
              getItemSummary: (item: PhoneItemProps, index?: number) =>
                item.label || item.number.field || `Phone ${index ?? 0}`,
            },
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
            includeHyperlink: {
              label: msg("fields.includeHyperlink", "Include Hyperlink"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
          },
        },
        cta: {
          label: msg("fields.callToAction", "Call to Action"),
          type: "comprehensiveCTA",
        },
      },
    },
    dispatchHours: {
      label: msg("fields.dispatchHours", "Dispatch Hours"),
      type: "object",
      objectFields: {
        title: {
          label: msg("fields.title", "Title"),
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
        icon: {
          label: msg("fields.options.icon", "Icon"),
          type: "select",
          options: [...detailsIconOptions],
        },
        hours: {
          type: "entityField",
          label: msg("fields.hours", "Hours"),
          filter: {
            types: ["type.hours"],
          },
          disableConstantValueToggle: true,
        },
        hoursStyles: {
          label: msg("fields.hoursStyles", "Hours Styles"),
          type: "object",
          objectFields: {
            startOfWeek: {
              label: msg("fields.startOfWeek", "Start Of Week"),
              type: "select",
              options: [
                {
                  label: msg("fields.options.monday", "Monday"),
                  value: "monday",
                },
                {
                  label: msg("fields.options.tuesday", "Tuesday"),
                  value: "tuesday",
                },
                {
                  label: msg("fields.options.wednesday", "Wednesday"),
                  value: "wednesday",
                },
                {
                  label: msg("fields.options.thursday", "Thursday"),
                  value: "thursday",
                },
                {
                  label: msg("fields.options.friday", "Friday"),
                  value: "friday",
                },
                {
                  label: msg("fields.options.saturday", "Saturday"),
                  value: "saturday",
                },
                {
                  label: msg("fields.options.sunday", "Sunday"),
                  value: "sunday",
                },
                { label: msg("fields.options.today", "Today"), value: "today" },
              ],
            },
            collapseDays: {
              label: msg("fields.collapseDays", "Collapse Days"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
            showAdditionalHoursText: {
              label: msg(
                "fields.options.showAdditionalHoursText",
                "Show Additional Hours Text",
              ),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
            alignment: {
              label: msg("fields.alignment", "Alignment"),
              type: "select",
              options: [
                {
                  label: msg("fields.options.start", "Start"),
                  value: "items-start",
                },
                {
                  label: msg("fields.options.center", "Center"),
                  value: "items-center",
                },
                { label: msg("fields.options.end", "End"), value: "items-end" },
              ],
            },
          },
        },
      },
    },
    perks: {
      label: msg("fields.perks", "Perks"),
      type: "object",
      objectFields: {
        title: {
          label: msg("fields.title", "Title"),
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
        icon: {
          label: msg("fields.options.icon", "Icon"),
          type: "select",
          options: [...detailsIconOptions],
        },
        listText: {
          label: msg("fields.textList", "Text List"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.textList", "Text List"),
              filter: {
                types: ["type.string"],
                includeListsOnly: true,
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
      },
    },
  };

export const ProfessionalPracticeDetailsSection: YextComponentConfig<ProfessionalPracticeDetailsSectionProps> =
  {
    label: "Details",
    fields: ProfessionalPracticeDetailsSectionFields,
    defaultProps: {
      section: {
        backgroundColor: sectionColor,
        visibleOnLivePage: true,
      },
      iconBackgroundColor,
      summary: {
        icon: "location",
        title: {
          text: {
            field: "",
            constantValue: "Service Summary",
            constantValueEnabled: true,
          },
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        address: {
          field: "address",
          constantValue: {
            line1: "",
            city: "",
            postalCode: "",
            countryCode: "",
            region: "",
          },
          constantValueEnabled: false,
        },
        showRegion: true,
        showCountry: false,
        baseHubLabel: {
          text: {
            field: "",
            constantValue: "Base Hub",
            constantValueEnabled: true,
          },
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        serviceRadiusText: {
          text: {
            field: "",
            constantValue: "(Serving a 20-mile radius)",
            constantValueEnabled: true,
          },
          styles: defaultTextStyles,
          fontColor: undefined,
        },
        bookingLabel: {
          text: {
            field: "",
            constantValue: "Booking Desk",
            constantValueEnabled: true,
          },
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        phones: {
          items: [
            {
              number: {
                field: "mainPhone",
                constantValue: "",
                constantValueEnabled: false,
              },
              label: "",
            },
          ],
          phoneFormat: "domestic",
          includeHyperlink: true,
        },
        cta: {
          data: {
            actionType: "link",
            cta: {
              field: "",
              constantValueEnabled: true,
              constantValue: {
                ctaType: "textAndLink",
                label: { defaultValue: "Check Your Zip Code" },
                link: { defaultValue: "#" },
                linkType: "URL",
              },
              selectedType: "textAndLink",
            },
            openInNewTab: false,
            buttonText: { defaultValue: "Check Your Zip Code" },
            customId: "",
            customClass: "",
            dataAttributes: [],
            ariaLabel: { defaultValue: "Check Your Zip Code" },
          },
          styles: {
            variant: "secondary",
            color: whiteColor,
            button: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
              letterSpacing: "default",
              borderRadius: "12px",
            },
            link: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
              letterSpacing: "default",
              includeCaret: "default",
            },
          },
        },
      },
      dispatchHours: {
        icon: "clock",
        title: {
          text: {
            field: "",
            constantValue: "Dispatch & Service Hours",
            constantValueEnabled: true,
          },
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        hours: {
          field: "hours",
          constantValue: {} as HoursType,
          constantValueEnabled: false,
        },
        hoursStyles: {
          startOfWeek: "today",
          collapseDays: false,
          showAdditionalHoursText: true,
          alignment: "items-start",
        },
      },
      perks: {
        icon: "thumbsUp",
        title: {
          text: {
            field: "",
            constantValue: "Complimentary Services",
            constantValueEnabled: true,
          },
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        listText: {
          text: {
            field: "",
            constantValue: [
              "Hydro-Massage Bath",
              "Premium Tearless Blueberry Facial",
              "Blow Dry (No Cage Drying, Ever)",
              "Custom Bandana or Bow",
              "De-Shedding Consultation & Coat Health Check",
              "Free cancellation up to 24 hours prior to scheduled arrival",
              "Fully self-powered and climate-controlled mobile grooming vans (No hookups required), accommodating dogs up to 75 lbs.",
            ],
            constantValueEnabled: true,
          },
          styles: defaultTextStyles,
          fontColor: undefined,
        },
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeDetailsSection",
  displayName: "Details",
  description: "Details Section",
  pageSetTypes: ["ENTITY"],
};
