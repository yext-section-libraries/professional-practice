import type { SectionRenderConfig } from "@yext/visual-editor";
import { PuckComponent } from "@puckeditor/core";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import {
  Heading,
  HeadingProps,
} from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { pt } from "@yext/visual-editor/section-library-support";
import {
  HeadingLevel,
  ThemeColor,
} from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
export type HeadingTextProps = {
  /** The heading text value */
  data: {
    text: YextEntityField<TranslatableString>;
  };

  /** Styling for the heading. */
  styles: {
    /** The h tag level of the section heading */
    level: HeadingProps["level"];
    /** Alignment of the event section heading */
    align: "left" | "center" | "right";
    /** Optional override to render a different HTML tag instead of the one based on the level */
    semanticLevelOverride?: HeadingLevel | "span";
    color?: ThemeColor;
  };

  /** @internal Controlled data from the parent section */
  parentData?: {
    field: string;
    text?: string;
  };
};

const HeadingTextWrapper: PuckComponent<HeadingTextProps> = (props) => {
  const { data, styles, puck, parentData } = props;
  const streamDocument = useDocument();
  const { i18n } = useTranslation();

  const justifyClass = styles?.align
    ? {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
      }[styles.align]
    : "justify-start";

  const alignClass = styles?.align
    ? {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      }[styles.align]
    : "text-left";

  const resolvedHeadingText =
    parentData?.text ??
    resolveComponentData(data.text, i18n.language, streamDocument);

  return resolvedHeadingText ? (
    <div className={`flex w-full ${justifyClass}`}>
      <EntityField
        displayName={pt("heading", "Heading") + " " + styles.level}
        fieldId={parentData ? parentData.field : data.text.field}
        constantValueEnabled={!parentData && data.text.constantValueEnabled}
      >
        <Heading
          level={styles.level}
          className={alignClass}
          semanticLevelOverride={styles.semanticLevelOverride}
          color={styles.color}
        >
          {resolvedHeadingText}
        </Heading>
      </EntityField>
    </div>
  ) : puck.isEditing ? (
    <div className="h-[30px]" />
  ) : (
    <></>
  );
};

export const HeadingText: SectionRenderConfig<HeadingTextProps> = {
  render: (props) => <HeadingTextWrapper {...props} />,
};
