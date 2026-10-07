import type { SectionRenderConfig } from "@yext/visual-editor";
import { PuckComponent } from "@puckeditor/core";
import { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  AssetImageType,
  isLocalizedAssetImage,
  resolveLocalizedAssetImage,
  TranslatableAssetImage,
} from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import {
  Image,
  ImgSizesByBreakpoint,
  imgSizesHelper,
} from "@yext/visual-editor/section-library-support";
import { MaybeLink } from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { pt } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { EmptyImageState } from "./EmptyImageState";
import { ImageStylingProps } from "./styling";
export const DEFAULT_LINK = "#";
const LINK_REGEX_VALIDATION = /^(https?:\/\/[^\s]+|\/[^\s]*|#[^\s]*)$/;

export interface ImageWrapperProps {
  data: {
    /** The image to display. */
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
    link?: TranslatableString;
  };

  /** Size and aspect ratio of the image. */
  styles: ImageStylingProps;

  /** @internal Controlled data from the parent section. */
  parentData?: {
    field: string;
    image: ImageType | ComplexImageType | TranslatableAssetImage | undefined;
  };

  /** Additional CSS classes to apply to the image. */
  className?: string;

  sizes?: ImgSizesByBreakpoint;

  hideWidthProp?: boolean;

  /** @internal If true, shows the imageConstrain prop. */
  showImageConstrain?: boolean;
}

export const getImageUrl = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
  locale: string,
): string | undefined => {
  if (!image) {
    return undefined;
  }

  if (isLocalizedAssetImage(image)) {
    return resolveLocalizedAssetImage(image, locale)?.url;
  }

  if ("image" in image) {
    return image.image?.url;
  }

  return image.url;
};

const ImageWrapperComponent: PuckComponent<ImageWrapperProps> = (props) => {
  const {
    data,
    styles,
    parentData,
    className,
    puck,
    sizes = {
      base: styles.width ? `min(100vw, width)` : "100vw",
      md: styles.width
        ? `min(width, calc((maxWidth - 32px) / 2))`
        : "maxWidth / 2",
    },
    hideWidthProp,
    showImageConstrain = false,
  } = props;
  const { i18n } = useTranslation();
  const streamDocument = useDocument();
  const resolvedImage = React.useMemo(() => {
    return parentData
      ? parentData?.image
      : resolveComponentData(data.image, i18n.language, streamDocument);
  }, [parentData, data.image, i18n.language, streamDocument]);

  const imageUrl = getImageUrl(resolvedImage, i18n.language);
  const isEmpty =
    !resolvedImage ||
    !imageUrl ||
    (typeof imageUrl === "string" && imageUrl.trim() === "");

  const inputLink = resolveComponentData(
    data.link ?? { defaultValue: DEFAULT_LINK },
    i18n.language,
    streamDocument,
  );

  const resolvedLink =
    typeof inputLink === "string" &&
    LINK_REGEX_VALIDATION.test(inputLink.trim()) &&
    inputLink.trim() !== DEFAULT_LINK
      ? inputLink.trim()
      : undefined;

  if (isEmpty) {
    return (
      <EmptyImageState
        isEmpty={isEmpty}
        isEditing={puck.isEditing ?? false}
        constantValueEnabled={data.image.constantValueEnabled ?? false}
        constantValue={data.image.constantValue as AssetImageType | undefined}
        fieldId={parentData ? parentData.field : data.image.field}
        containerStyle={{
          ...(hideWidthProp
            ? {}
            : styles.width
              ? { width: `${styles.width}px` }
              : {}),
          ...(styles.aspectRatio ? { aspectRatio: styles.aspectRatio } : {}),
        }}
        containerClassName={
          className || "max-w-full rounded-image-borderRadius w-full h-full"
        }
        fullHeight
        dragRef={puck.dragRef ?? undefined}
        hasParentData={!!parentData}
      />
    );
  }

  const transformedSizes = imgSizesHelper(sizes, `${styles.width}px`);

  return (
    <EntityField
      displayName={pt("fields.image", "Image")}
      fieldId={parentData ? parentData.field : data.image.field}
      constantValueEnabled={!parentData && data.image.constantValueEnabled}
      fullHeight
      ref={puck.dragRef}
    >
      <div className="w-full">
        <MaybeLink
          className="w-auto"
          eventName="logoLink"
          href={resolvedLink}
          alwaysHideCaret={true}
        >
          <Image
            image={resolvedImage}
            aspectRatio={styles.aspectRatio}
            imageFillType={styles.imageFillType}
            width={
              hideWidthProp ||
              (showImageConstrain && styles.imageConstrain === "fill")
                ? undefined
                : styles.width
            }
            className={
              className || "max-w-full rounded-image-borderRadius w-full"
            }
            sizes={transformedSizes}
          />
        </MaybeLink>
      </div>
    </EntityField>
  );
};

export const ImageWrapper: SectionRenderConfig<ImageWrapperProps> = {
  render: (props) => <ImageWrapperComponent {...props} />,
};
