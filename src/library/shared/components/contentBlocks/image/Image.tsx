import { ImageWrapper as renderConfig } from "./Image.render";
import type { ImageWrapperProps } from "./Image.render";
import { DEFAULT_LINK } from "./Image.render";
export type { ImageWrapperProps } from "./Image.render";
export { getImageUrl } from "./Image.render";
import { setDeep } from "@puckeditor/core";
import { msg } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { ImageStylingFields } from "./styling";
import {
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";
const PLACEHOLDER_IMAGE_URL = "https://placehold.co/640x360";

export const ImageWrapperFields: YextFields<ImageWrapperProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      image: {
        type: "entityField",
        label: msg("fields.options.image", "Image"),
        filter: {
          types: ["type.image"],
        },
      },
      link: {
        type: "translatableString",
        label: msg("fields.link", "Link"),
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      ...ImageStylingFields,
    },
  },
  showImageConstrain: {
    label: msg("fields.showImageConstrain", "Show Image Constrain"),
    type: "radio",
    options: [
      { label: msg("fields.options.show", "Show"), value: true },
      { label: msg("fields.options.hide", "Hide"), value: false },
    ],
    visible: false,
  },
};

export const imageDefaultProps = {
  data: {
    image: {
      field: "",
      constantValue: {
        url: PLACEHOLDER_IMAGE_URL,
        height: 360,
        width: 640,
      },
      constantValueEnabled: true,
    },
    link: { defaultValue: DEFAULT_LINK },
  },
  styles: {
    aspectRatio: 1.78,
    imageFillType: "fill" as const,
    width: 640,
  },
  allowWidthProp: true,
};

export const ImageWrapper: YextComponentConfig<ImageWrapperProps> = {
  label: msg("components.image", "Image"),
  inline: true,
  fields: ImageWrapperFields,
  defaultProps: imageDefaultProps,
  resolveFields: (data, params) => {
    let fields = resolveDataFromParent(ImageWrapperFields, data);
    const parentType = params.parent?.type;

    if (
      data.props.hideWidthProp ||
      data.props.styles.imageConstrain === "fill"
    ) {
      fields = setDeep(fields, "styles.objectFields.width.visible", false);
    } else {
      fields = setDeep(fields, "styles.objectFields.width.visible", true);
    }

    fields = setDeep(
      fields,
      "styles.objectFields.imageConstrain.visible",
      !!data.props.showImageConstrain,
    );

    if (parentType !== "PrimaryHeaderSlot") {
      return setDeep(fields, "data.objectFields.link.visible", false);
    }

    return fields;
  },
  render: renderConfig.render,
};
