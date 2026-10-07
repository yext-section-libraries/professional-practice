import type { SectionRenderConfig } from "@yext/visual-editor";
import { type MultiSelectorValue } from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { TranslatableAssetImage } from "@yext/visual-editor/section-library-support";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { LocatorEntityType } from "@yext/visual-editor/section-library-support";
import {
  DistanceDisplayOption,
  LocatorResultCardProps,
} from "./LocatorResultCard.render";
import { LocatorWrapper } from "./LocatorWrapper";
export interface LocatorProps {
  /**
   * The visual theme for the map tiles, chosen from a predefined list of Mapbox styles.
   * @defaultValue 'mapbox://styles/mapbox/streets-v12'
   */
  mapStyle?: string;

  /**
   * Props to customize the locator map pin styles.
   * Controls map pin appearance depending on the result's entity type.
   * The number of entries is locked to the locator entity types for the page set.
   */
  locationStyles: Array<{
    /** The entity type this style applies to. */
    entityType: LocatorEntityType;
    /** Whether to render an icon in the pin. */
    pinIcon?: {
      type: "none" | "icon" | "customImage";
      /** Defaults to the first available Maki icon when type is 'icon'. */
      iconName?: string;
      /** Image rendered within the pin when type is 'customImage'. */
      image?: TranslatableAssetImage;
      /**
       * Width of the custom image rendered within the pin.
       * @defaultValue 14
       * */
      width?: number;
      /** Aspect ratio of the custom image rendered within the pin. */
      aspectRatio?: number;
    };
    /** The color applied to the pin. */
    pinColor?: ThemeColor;
  }>;

  /**
   * Configuration for the filters available in the locator search experience.
   */
  filters: {
    /**
     * If 'true', displays a button to filter for locations that are currently open.
     * @defaultValue false
     */
    openNowButton: boolean;
    /**
     * If 'true', displays several distance options to filter searches to only locations within
     * a certain radius.
     * @defaultValue false
     */
    showDistanceOptions: boolean;
    /** Accent color for filter button and icons. */
    accentColor?: ThemeColor;
    /** Which fields are facetable in the search experience */
    facetFields?: MultiSelectorValue<string>;
  };

  /**
   * The starting location for the map.
   */
  mapStartingLocation?: {
    latitude: string;
    longitude: string;
  };
  /**
   * Configuration for the locator page heading.
   * Allows customizing the title text and its color.
   */
  pageHeading?: {
    /** The title displayed at the top of the locator page. */
    title: TranslatableString;
    /**
     * The color applied to the locator page title.
     * @defaultValue inherited from theme
     */
    color?: ThemeColor;
  };
  /**
   * Props to customize the locator result card component.
   * Controls which fields are displayed and their styling depending on the result's entity type.
   * The number of entries is locked to the locator entity types for the page set.
   */
  resultCard: Array<{
    /** Props to customize the locator result card component. */
    props: LocatorResultCardProps;
  }>;
  /** Controls which distance value to display on each locator result card. */
  distanceDisplay?: DistanceDisplayOption;
}

export const LocatorComponent: SectionRenderConfig<LocatorProps> = {
  render: (props) => <LocatorWrapper {...props} />,
};
