import type { SectionRenderConfig } from "@yext/visual-editor";
import { TypographyScope } from "../shared/typography";
import { PuckComponent } from "@puckeditor/core";
import { CircleSlash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  pt,
  Body,
  EntityField,
  PageSection,
  type ThemeColor,
  VisibilityWrapper,
  resolveComponentData,
  resolveYextEntityField,
  useDocument,
} from "@yext/visual-editor";
import {
  isRichTextEmpty,
  renderResolvedRichText,
  type StyledRtfWithStylesProps,
} from "../shared/sectionHelpers";
export type ProfessionalPracticeBannerProps = {
  data: StyledRtfWithStylesProps;
  styles: {
    textAlignment: "left" | "center" | "right";
  };
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const ProfessionalPracticeBannerComponent: PuckComponent<
  ProfessionalPracticeBannerProps
> = ({ data, styles, section, puck }) => {
  const { i18n } = useTranslation();
  const streamDocument = useDocument();
  const isMappedField =
    !data.text.constantValueEnabled && Boolean(data.text.field);

  if (
    isMappedField &&
    isRichTextEmpty(
      resolveYextEntityField(streamDocument, data.text, i18n.language),
    )
  ) {
    if (!puck.isEditing) {
      return <></>;
    }

    return (
      <PageSection
        background={section.backgroundColor}
        className="flex items-center justify-center"
        verticalPadding="sm"
      >
        <div className="relative flex h-20 w-full flex-row items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4">
          <CircleSlash2 className="h-10 w-10 flex-shrink-0 text-gray-400" />
          <div className="flex flex-col items-start">
            <Body className="text-gray-500" variant="sm">
              {pt("sectionHiddenForPage", "Section hidden for this page")}
            </Body>
            <Body className="text-gray-500" variant="sm">
              {pt("mappedBannerFieldEmpty", "The mapped banner field is empty")}
            </Body>
          </div>
        </div>
      </PageSection>
    );
  }

  const richTextStyleOverrides = {
    ...data.styles,
    color: data.fontColor ?? section.backgroundColor.contrastingColor,
  };
  const resolvedText = resolveComponentData(
    data.text,
    i18n.language,
    streamDocument,
  );

  if (!resolvedText) {
    return <></>;
  }

  return (
    <PageSection
      background={section.backgroundColor}
      className={`flex items-center ${
        {
          left: "justify-start text-left",
          center: "justify-center text-center",
          right: "justify-end text-right",
        }[styles.textAlignment]
      }`}
      verticalPadding="sm"
    >
      <EntityField
        constantValueEnabled={data.text.constantValueEnabled}
        displayName="Banner Text"
        fieldId={data.text.field}
      >
        {renderResolvedRichText(resolvedText, richTextStyleOverrides)}
      </EntityField>
    </PageSection>
  );
};

export const ProfessionalPracticeBanner: SectionRenderConfig<ProfessionalPracticeBannerProps> =
  {
    render: (props) => (
      <TypographyScope>
        <VisibilityWrapper
          isEditing={props.puck.isEditing}
          liveVisibility={props.section.visibleOnLivePage}
        >
          <ProfessionalPracticeBannerComponent {...props} />
        </VisibilityWrapper>
      </TypographyScope>
    ),
  };
