import { ProfessionalPracticePhotoGallerySection as renderConfig } from "./ProfessionalPracticePhotoGallerySection.render";
import type { ProfessionalPracticePhotoGallerySectionProps } from "./ProfessionalPracticePhotoGallerySection.render";
import { photoSource } from "./ProfessionalPracticePhotoGallerySection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const ProfessionalPracticePhotoGallerySectionFields: YextFields<ProfessionalPracticePhotoGallerySectionProps> =
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
    displayType: {
      label: msg("fields.displayType", "Display Type"),
      type: "select",
      options: [
        { label: msg("fields.options.grid", "Grid"), value: "grid" },
        {
          label: msg("fields.options.carousel", "Carousel"),
          value: "carousel",
        },
      ],
    },
    photos: {
      label: msg("fields.photos", "Photos"),
      type: "object",
      objectFields: {
        data: photoSource.field,
        styles: {
          label: msg("fields.galleryPresentation", "Gallery Presentation"),
          type: "object",
          objectFields: {
            image: {
              label: msg("fields.imageStyles", "Image Styles"),
              type: "styledImage",
            },
            aspectRatio: {
              label: msg("fields.options.aspectRatio", "Aspect Ratio"),
              type: "select",
              options: [
                { label: msg("fields.options.square", "Square"), value: 1 },
                {
                  label: msg("fields.options.portrait", "Portrait"),
                  value: 1.24,
                },
                {
                  label: msg("fields.options.landscape", "Landscape"),
                  value: 1.6,
                },
              ],
            },
            imageConstrain: {
              label: msg("fields.imageConstrain", "Image Constrain"),
              type: "select",
              options: [
                { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
                {
                  label: msg("fields.options.filled", "Filled"),
                  value: "filled",
                },
              ],
            },
            caption: {
              label: msg("fields.captionStyles", "Caption Styles"),
              type: "styledText",
            },
            captionFontColor: {
              label: msg("fields.captionFontColor", "Caption Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

export const ProfessionalPracticePhotoGallerySection: YextComponentConfig<ProfessionalPracticePhotoGallerySectionProps> =
  {
    label: "Photo Gallery",
    fields: ProfessionalPracticePhotoGallerySectionFields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "palette-secondary",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: "A Closer Look At The Calm, Mobile Experience",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      displayType: "grid",
      photos: {
        data: photoSource.defaultValue,
        styles: {
          image: { borderRadius: "default" },
          aspectRatio: 1.24,
          imageConstrain: "filled",
          caption: defaultTextStyles,
          captionFontColor: undefined,
        },
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticePhotoGallerySection",
  displayName: "Photo Gallery",
  description: "Photo Gallery Section",
  pageSetTypes: ["ENTITY"],
};
