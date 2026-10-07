import { CardProps } from "@yext/search-ui-react";
import { Result } from "@yext/search-headless-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { getPreferredDistanceUnit } from "@yext/visual-editor/section-library-support";
import { Body } from "@yext/visual-editor/section-library-support";
import { Button } from "@yext/visual-editor/section-library-support";
import { Location } from "./LocatorResultCard.render";
export const RESULTS_LIMIT = 20;
export type SearchState = "not started" | "loading" | "complete";

export const translateDistanceUnit = (
  t: (key: string, options?: Record<string, unknown>) => string,
  unit: "mile" | "kilometer",
  count: number,
) => {
  if (unit === "mile") {
    return t("mile", { count, defaultValue: "mile" });
  }

  return t("kilometer", { count, defaultValue: "kilometer" });
};

interface MobileLocatorResultsSectionProps {
  CardComponent: React.ComponentType<CardProps<Location>>;
  results: Result<Location>[];
  hasMoreResults: boolean;
  handleShowMoreResults: () => void;
}

export const MobileLocatorResultsSection = ({
  CardComponent,
  results,
  hasMoreResults,
  handleShowMoreResults,
}: MobileLocatorResultsSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      {results.length > 0 && (
        <div>
          {results.map((result, position) => (
            <div
              key={
                result.rawData?.id ??
                result.id ??
                `${result.index ?? "result"}-${position}`
              }
            >
              <CardComponent result={result} />
            </div>
          ))}
        </div>
      )}
      {hasMoreResults && (
        // Mobile replaces numbered pagination with incremental loading.
        <div className="px-8 py-4">
          <Button
            className="w-full justify-center"
            onClick={handleShowMoreResults}
          >
            {t("showMoreLocations", "Show more locations")}
          </Button>
        </div>
      )}
    </>
  );
};

interface ResultsCountSummaryProps {
  searchState: SearchState;
  resultCount: number;
  selectedDistanceOption: number | null;
  filterDisplayName?: string;
}

export const ResultsCountSummary = ({
  searchState,
  resultCount,
  selectedDistanceOption,
  filterDisplayName,
}: ResultsCountSummaryProps) => {
  const { t, i18n } = useTranslation();

  if (resultCount === 0) {
    if (searchState === "not started") {
      return (
        <Body>
          {t(
            "useOurLocatorToFindALocationNearYou",
            "Use our locator to find a location near you",
          )}
        </Body>
      );
    }

    if (searchState === "complete") {
      return (
        <Body>
          {t("noResultsFoundForThisArea", "No results found for this area")}
        </Body>
      );
    }

    return <div />;
  }

  if (filterDisplayName) {
    if (selectedDistanceOption) {
      const unit = getPreferredDistanceUnit(i18n.language);
      return (
        <Body>
          {t("locationsWithinDistanceOf", {
            count: resultCount,
            distance: selectedDistanceOption,
            unit: translateDistanceUnit(t, unit, selectedDistanceOption),
            name: filterDisplayName,
            defaultValue_one:
              '{{count}} location within {{distance}} {{unit}} of "{{name}}"',
            defaultValue_other:
              '{{count}} locations within {{distance}} {{unit}} of "{{name}}"',
          })}
        </Body>
      );
    }

    return (
      <Body>
        {t("locationsNear", {
          count: resultCount,
          name: filterDisplayName,
          defaultValue_one: '{{count}} location near "{{name}}"',
          defaultValue_other: '{{count}} locations near "{{name}}"',
        })}
      </Body>
    );
  }

  return (
    <Body>
      {t("locationWithCount", {
        count: resultCount,
        defaultValue_one: "{{count}} location",
        defaultValue_other: "{{count}} locations",
      })}
    </Body>
  );
};
