import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  Background,
  createItemSource,
  EntityField,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  Image,
  resolveComponentData,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";

type StyledTextValueWithLetterSpacing = StyledTextValue & {
  letterSpacing?: string;
};

type StyledTextProps = {
  text: YextEntityField<string>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};

type PhotoFields = {
  image: YextEntityField<TranslatableAssetImage>;
  caption: YextEntityField<string>;
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const imageUrls = [
  "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
  "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
];

const photoSource = createItemSource<PhotoFields>({
  label: "Photos",
  mappingFields: {
    image: {
      type: "entityField",
      label: "Image",
      filter: { types: ["type.image"] },
    },
    caption: {
      type: "entityField",
      label: "Caption",
      filter: { types: ["type.string"] },
    },
  },
  defaultValues: [
    "Seasonal service days stay light, airy, and unrushed.",
    "Our mobile setup keeps every visit self-contained and tidy.",
    "Comfort-first routines help pets settle in quickly.",
  ].map((caption, index) => ({
    image: {
      field: "",
      constantValue: { url: imageUrls[index], width: 1267, height: 1900 },
      constantValueEnabled: true,
    },
    caption: {
      field: "",
      constantValue: caption,
      constantValueEnabled: true,
    },
  })),
});

type ProfessionalPracticePhotoGallerySectionProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  heading: StyledTextProps;
  displayType: "grid" | "carousel";
  photos: {
    data: typeof photoSource.value;
    styles: {
      image: StyledImageValue;
      aspectRatio: number;
      imageConstrain: "fixed" | "filled";
      caption: StyledTextValueWithLetterSpacing;
      captionFontColor?: ThemeColor;
    };
  };
};

const ProfessionalPracticePhotoGallerySectionFields: YextFields<ProfessionalPracticePhotoGallerySectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    heading: {
      label: "Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    displayType: {
      label: "Display Type",
      type: "select",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Carousel", value: "carousel" },
      ],
    },
    photos: {
      label: "Photos",
      type: "object",
      objectFields: {
        data: photoSource.field,
        styles: {
          label: "Gallery Presentation",
          type: "object",
          objectFields: {
            image: { label: "Image Styles", type: "styledImage" },
            aspectRatio: {
              label: "Aspect Ratio",
              type: "select",
              options: [
                { label: "Square", value: 1 },
                { label: "Portrait", value: 1.24 },
                { label: "Landscape", value: 1.6 },
              ],
            },
            imageConstrain: {
              label: "Image Constrain",
              type: "select",
              options: [
                { label: "Fixed", value: "fixed" },
                { label: "Filled", value: "filled" },
              ],
            },
            caption: { label: "Caption Styles", type: "styledText" },
            captionFontColor: {
              label: "Caption Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

const textStyle = (
  styles: StyledTextValueWithLetterSpacing,
  fontColor?: ThemeColor,
): React.CSSProperties => ({
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
  letterSpacing:
    styles.letterSpacing === "default" ? undefined : styles.letterSpacing,
  color: fontColor ? getThemeColorCssValue(fontColor.selectedColor) : undefined,
});

const ProfessionalPracticePhotoGallerySectionComponent: PuckComponent<
  ProfessionalPracticePhotoGallerySectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const photos = photoSource.resolveItems(props.photos.data, streamDocument);
  const authoredPhotos = props.photos.data.constantValueEnabled
    ? props.photos.data.constantValue
    : undefined;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticePhotoGallerySection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background background={props.section.backgroundColor}>
          <section
            style={getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            )}
          >
            <div className="mx-auto flex max-w-[1280px] flex-col gap-[30px] px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="m-0"
                  style={textStyle(
                    props.heading.styles,
                    props.heading.fontColor,
                  )}
                >
                  {resolveComponentData(
                    props.heading.text,
                    locale,
                    streamDocument,
                  )}
                </h2>
              </EntityField>
              <EntityField
                displayName="Photos"
                fieldId={props.photos.data.field}
                constantValueEnabled={props.photos.data.constantValueEnabled}
              >
                <div
                  className={
                    props.displayType === "carousel"
                      ? "flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
                      : "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                  }
                >
                  {photos.map((photo, index) => {
                    const authoredPhoto =
                      authoredPhotos?.[index] ?? props.photos.data.mappings;
                    const resolvedCaption = authoredPhoto?.caption
                      ? resolveComponentData(
                          authoredPhoto.caption,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const caption =
                      typeof resolvedCaption === "string"
                        ? resolvedCaption
                        : "";
                    const resolvedImage = authoredPhoto?.image
                      ? resolveComponentData(
                          authoredPhoto.image,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const image =
                      !resolvedImage ||
                      React.isValidElement(resolvedImage) ||
                      typeof resolvedImage === "string"
                        ? undefined
                        : (("image" in resolvedImage &&
                            resolvedImage.image &&
                            typeof resolvedImage.image === "object"
                            ? resolvedImage.image
                            : resolvedImage) as TranslatableAssetImage);
                    return (
                      <figure
                        key={`${caption || "photo"}-${index}`}
                        className={
                          props.displayType === "carousel"
                            ? "m-0 min-w-[280px] snap-start md:min-w-[360px]"
                            : "m-0"
                        }
                      >
                        {image ? (
                          <EntityField
                            displayName="Image"
                            fieldId={authoredPhoto?.image.field}
                            constantValueEnabled={
                              authoredPhoto?.image.constantValueEnabled
                            }
                          >
                            <div className="overflow-hidden">
                              <Image
                                image={image}
                                className="h-full w-full"
                                style={{
                                  aspectRatio: props.photos.styles.aspectRatio,
                                  borderRadius:
                                    props.photos.styles.image.borderRadius ===
                                    "default"
                                      ? undefined
                                      : props.photos.styles.image.borderRadius,
                                  objectFit:
                                    props.photos.styles.imageConstrain ===
                                    "filled"
                                      ? "cover"
                                      : "contain",
                                }}
                              />
                            </div>
                          </EntityField>
                        ) : null}
                        {caption ? (
                          <EntityField
                            displayName="Caption"
                            fieldId={authoredPhoto?.caption.field}
                            constantValueEnabled={
                              authoredPhoto?.caption.constantValueEnabled
                            }
                          >
                            <figcaption
                              className="mt-3"
                              style={textStyle(
                                props.photos.styles.caption,
                                props.photos.styles.captionFontColor,
                              )}
                            >
                              {caption}
                            </figcaption>
                          </EntityField>
                        ) : null}
                      </figure>
                    );
                  })}
                </div>
              </EntityField>
            </div>
          </section>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const ProfessionalPracticePhotoGallerySection: YextComponentConfig<ProfessionalPracticePhotoGallerySectionProps> =
  {
    label: "Photo Gallery Section",
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
    render: (props) => (
      <ProfessionalPracticePhotoGallerySectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticePhotoGallerySection",
  displayName: "Photo Gallery Section",
  description: "Photo Gallery Section",
  pageSetTypes: ["ENTITY"],
};
