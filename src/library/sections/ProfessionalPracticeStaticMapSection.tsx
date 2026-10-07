import { ProfessionalPracticeStaticMapSection as renderConfig } from "./ProfessionalPracticeStaticMapSection.render";
import type { ProfessionalPracticeStaticMapSectionProps } from "./ProfessionalPracticeStaticMapSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  getDefaultRTF,
  mapboxStaticMapStyleOptions,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const defaultSectionColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const ProfessionalPracticeStaticMapSectionFields: YextFields<ProfessionalPracticeStaticMapSectionProps> =
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
    body: {
      label: msg("fields.body", "Body"),
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
    map: {
      label: msg("fields.map", "Map"),
      type: "object",
      objectFields: {
        coordinate: {
          type: "entityField",
          label: msg("fields.coordinates", "Coordinates"),
          filter: {
            types: ["type.coordinate"],
          },
        },
        mapStyle: {
          label: msg("fields.mapboxMapStyle", "Mapbox Map Style"),
          type: "select",
          options: mapboxStaticMapStyleOptions,
        },
        zoom: {
          label: msg("fields.zoom", "Zoom"),
          type: "number",
          min: 0,
          max: 22,
        },
      },
    },
  };

export const ProfessionalPracticeStaticMapSection: YextComponentConfig<ProfessionalPracticeStaticMapSectionProps> =
  {
    label: "Static Map",
    fields: ProfessionalPracticeStaticMapSectionFields,
    defaultProps: {
      section: {
        backgroundColor: defaultSectionColor,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: "Plan The Easiest Stop On The Route",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Use this section when a location page should show a simple arrival preview alongside reassuring copy, booking notes, or neighborhood guidance.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      map: {
        coordinate: {
          field: "yextDisplayCoordinate",
          constantValue: {
            latitude: 0,
            longitude: 0,
          },
          constantValueEnabled: false,
        },
        mapStyle: "streets-v12",
        zoom: 13,
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeStaticMapSection",
  displayName: "Static Map",
  description: "Static Map Section",
  pageSetTypes: ["ENTITY"],
};
