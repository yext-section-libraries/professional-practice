export type { SearchState } from "./Results.render";
export {
  ResultsCountSummary,
  translateDistanceUnit,
  MobileLocatorResultsSection,
  RESULTS_LIMIT,
} from "./Results.render";
import { setDeep } from "@puckeditor/core";
import React from "react";
import { YextAutoField } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { useTemplateMetadata } from "@yext/visual-editor/section-library-support";
import { getLocatorEntityTypeSourceMap } from "@yext/visual-editor/section-library-support";
import { LocatorConfig } from "@yext/visual-editor/section-library-support";
import {
  DEFAULT_LOCATOR_RESULT_CARD_PROPS,
  LocatorResultCardFields,
  LocatorResultCardProps,
} from "./LocatorResultCard";
const BOOLEAN_SUPPORTED_FIELDS = [
  "primaryHeading",
  "secondaryHeading",
  "tertiaryHeading",
] as const;

const getLocatorConfigFromPageSet = (pageSet?: string): LocatorConfig => {
  if (!pageSet) {
    return {};
  }

  try {
    return JSON.parse(pageSet)?.typeConfig?.locatorConfig ?? {};
  } catch {
    console.error("Failed to parse locator config from page set");
    return {};
  }
};

export const ResultCardPropsField = ({
  value,
  onChange,
}: {
  value?: LocatorResultCardProps;
  onChange: (value: LocatorResultCardProps) => void;
}) => {
  const streamDocument = useDocument();
  const templateMetadata = useTemplateMetadata();
  const entityTypeSourceMap = getLocatorEntityTypeSourceMap();
  const entityTypeScopes = React.useMemo(() => {
    const locatorConfig = getLocatorConfigFromPageSet(streamDocument?._pageset);
    return locatorConfig.entityTypeScope ?? [];
  }, [streamDocument]);

  /**
   * Builds the field schema for the result card editor, including:
   * - Conditionally removing the primary CTA section when entity scope is not attached to a page set.
   * - Toggling constant value vs. field selector visibility per section.
   */
  const resultCardFields = React.useMemo(() => {
    if (!value?.entityType) {
      return LocatorResultCardFields;
    }
    let fields = LocatorResultCardFields;
    const entityTypeHasSourcePageSet = !!entityTypeSourceMap[value.entityType];
    const scopeExistsForEntityType =
      entityTypeScopes.find(
        (scope) => scope.entityType === value.entityType,
      ) !== undefined;

    fields = setDeep(
      fields,
      `objectFields.primaryCTA.objectFields.link.visible`,
      !entityTypeHasSourcePageSet && scopeExistsForEntityType,
    );

    // For each section, show either the field selector or the constant value editor.
    BOOLEAN_SUPPORTED_FIELDS.forEach((key) => {
      const headingConfig = value[key];
      const constantValueEnabled = headingConfig?.constantValueEnabled ?? false;
      const field = headingConfig?.field;
      const fieldTypeId = field
        ? templateMetadata?.locatorDisplayFields?.[field]?.field_type_id
        : undefined;
      const booleanFieldSelected =
        !constantValueEnabled && fieldTypeId === "type.boolean";

      fields = setDeep(
        fields,
        `objectFields.${key}.objectFields.field.visible`,
        !constantValueEnabled,
      );
      fields = setDeep(
        fields,
        `objectFields.${key}.objectFields.constantValue.visible`,
        constantValueEnabled,
      );
      fields = setDeep(
        fields,
        `objectFields.${key}.objectFields.trueDisplayText.visible`,
        !constantValueEnabled && booleanFieldSelected,
      );
      fields = setDeep(
        fields,
        `objectFields.${key}.objectFields.falseDisplayText.visible`,
        booleanFieldSelected,
      );
    });

    const imageConstantValueEnabled =
      value.image?.constantValueEnabled ?? false;
    fields = setDeep(
      fields,
      "objectFields.image.objectFields.field.visible",
      !imageConstantValueEnabled,
    );
    fields = setDeep(
      fields,
      "objectFields.image.objectFields.constantValue.visible",
      imageConstantValueEnabled,
    );

    return fields;
  }, [entityTypeSourceMap, entityTypeScopes, templateMetadata, value]);

  return (
    <YextAutoField
      field={resultCardFields}
      value={value ?? DEFAULT_LOCATOR_RESULT_CARD_PROPS}
      onChange={onChange}
    />
  );
};
