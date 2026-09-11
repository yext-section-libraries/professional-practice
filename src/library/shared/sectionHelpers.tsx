import * as React from "react";
import {
  MaybeRTF,
  getThemeColorCssValue,
  isDarkColor,
  type MaybeRTFProps,
  type RichText,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type YextEntityField,
} from "@yext/visual-editor";

export type StyledTextValueWithLetterSpacing = StyledTextValue & {
  letterSpacing?: string;
};

export type StyledTextProps = {
  text: YextEntityField<string>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};

export type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  fontColor?: ThemeColor;
};

export type StyledRtfWithStylesProps = StyledRtfProps & {
  styles: StyledTextValueWithLetterSpacing;
};

export const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

/** Options formerly exposed by the Visual Editor as ThemeOptions.ASPECT_RATIO. */
export const aspectRatioOptions = [
  { label: "1:1", value: 1 },
  { label: "5:4", value: 1.25 },
  { label: "4:3", value: 1.33 },
  { label: "3:2", value: 1.5 },
  { label: "5:3", value: 1.67 },
  { label: "16:9", value: 1.78 },
  { label: "2:1", value: 2 },
  { label: "3:1", value: 3 },
  { label: "4:1", value: 4 },
  { label: "4:5", value: 0.8 },
  { label: "3:4", value: 0.75 },
  { label: "2:3", value: 0.67 },
];

export const getReadableForegroundColor = (
  fontColor: ThemeColor | undefined,
  backgroundColor: ThemeColor,
  streamDocument?: StreamDocument,
): string | undefined => {
  const selectedFontColor =
    fontColor?.selectedColor === "default" ? undefined : fontColor;

  return selectedFontColor
    ? getThemeColorCssValue(selectedFontColor)
    : isDarkColor(backgroundColor, streamDocument)
      ? "#ffffff"
      : "#000000";
};

/**
 * Applies rich-text styles after resolving entity data. The current resolver can
 * return an already-rendered element, while MaybeRTF handles raw rich-text data.
 */
export const renderResolvedRichText = (
  value: unknown,
  richTextStyleOverrides?: MaybeRTFProps["richTextStyleOverrides"],
): React.ReactNode => {
  if (React.isValidElement(value)) {
    if (!richTextStyleOverrides) {
      return value;
    }

    const resolvedColor = getThemeColorCssValue(richTextStyleOverrides.color);
    const { color: _color, ...styleOverrides } = richTextStyleOverrides;
    const element = value as React.ReactElement<{
      style?: React.CSSProperties;
    }>;

    return React.cloneElement(element, {
      style: {
        ...element.props.style,
        ...styleOverrides,
        ...(resolvedColor ? { color: resolvedColor } : {}),
      },
    });
  }

  const data =
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "html" in value)
      ? (value as RichText | string)
      : undefined;

  return (
    <MaybeRTF
      data={data}
      richTextStyleOverrides={richTextStyleOverrides}
    />
  );
};

export const isRichTextEmpty = (value: unknown): boolean => {
  if (!value) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (typeof value === "object" && "html" in value) {
    const html = (value as { html?: unknown }).html;
    return typeof html !== "string" || html.trim() === "";
  }

  return false;
};
