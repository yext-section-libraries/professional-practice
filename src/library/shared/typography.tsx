import * as React from "react";
import {
  MaybeRTF,
  getThemeColorCssValue,
  type MaybeRTFProps,
  type RichTextStyleOverrides,
  type StyledTextValue,
} from "@yext/visual-editor";
import "./typography.css";

export const resolveTextStyles = (
  styles?: (Partial<StyledTextValue> | RichTextStyleOverrides) & {
    letterSpacing?: string;
  },
) => ({
  fontFamily: styles?.fontFamily === "default" ? undefined : styles?.fontFamily,
  fontSize: styles?.fontSize === "default" ? undefined : styles?.fontSize,
  fontWeight: styles?.fontWeight === "default" ? undefined : styles?.fontWeight,
  fontStyle: styles?.fontStyle === "default" ? undefined : styles?.fontStyle,
  textTransform:
    styles?.textTransform === "default" ? undefined : styles?.textTransform,
  letterSpacing:
    styles?.letterSpacing === "default" ? undefined : styles?.letterSpacing,
});

// Library variables remain inherited when nested platform scopes reset tokens.
export const getBodyTextStyle = (
  styles?: Parameters<typeof resolveTextStyles>[0],
): React.CSSProperties => {
  const resolved = resolveTextStyles(styles);
  const variables: Record<string, string | number> = {};
  for (const [property, value] of Object.entries(resolved)) {
    if (value !== undefined) {
      variables[`--professional-practice-body-${property}`] = value;
    }
  }
  return { ...resolved, ...variables };
};

export const TypographyScope = ({ children }: { children: React.ReactNode }) => (
  <div className="professional-practice-typography components">{children}</div>
);

type ResolvedTextProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  richTextStyleOverrides?: MaybeRTFProps["richTextStyleOverrides"];
};

export const applyRichTextOverrides = (
  node: React.ReactNode,
  overrides: NonNullable<MaybeRTFProps["richTextStyleOverrides"]>,
): React.ReactNode => {
  if (Array.isArray(node)) {
    return node.map((child) => applyRichTextOverrides(child, overrides));
  }
  if (!React.isValidElement<ResolvedTextProps>(node)) return node;
  if (node.type === React.Fragment) {
    return React.cloneElement(node, {
      children: React.Children.map(node.props.children, (child) =>
        applyRichTextOverrides(child, overrides),
      ),
    });
  }
  const style = {
    ...getBodyTextStyle(overrides),
    color: getThemeColorCssValue(overrides.color),
  };
  if (node.type === MaybeRTF) {
    return React.cloneElement(node, {
      richTextStyleOverrides: { ...node.props.richTextStyleOverrides, ...overrides },
      style: { ...node.props.style, ...style },
    });
  }
  const semanticRole =
    typeof node.type === "string" && /^(h[1-6]|a|button)$/.test(node.type);
  return React.cloneElement(node, {
    style: {
      ...node.props.style,
      ...(semanticRole ? { color: style.color } : style),
    },
    children: React.Children.map(node.props.children, (child) =>
      applyRichTextOverrides(child, overrides),
    ),
  });
};
