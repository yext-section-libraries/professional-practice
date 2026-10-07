import { makiIconEntries } from "./Map.render";
export type { LocationStyleConfig } from "./Map.render";
export {
  areValidCoordinates,
  parseMapStartingLocation,
  getMapboxMapPadding,
  LocatorMap,
  LoadingMapPlaceholder,
  DEFAULT_PIN_ICON_WIDTH,
  makiIconMap,
  getConfiguredMapCenterOrDefault,
  DEFAULT_MAP_CENTER,
  MAX_PIN_ICON_WIDTH,
  DEFAULT_LOCATION_STYLE,
  DEFAULT_RADIUS,
} from "./Map.render";
import { ImageField } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
const PIN_ICON_MAX_FILE_SIZE_BYTES = 128 * 1024;

export const LOCATOR_PIN_ICON_FIELD: ImageField = {
  type: "image",
  label: msg("fields.icon", "Icon"),
  hideAltTextField: true,
  maxFileSizeBytes: PIN_ICON_MAX_FILE_SIZE_BYTES,
};

const formatMakiIconLabel = (name: string) =>
  name.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const makiIconOptions = makiIconEntries.map(([name, icon]) => ({
  label: formatMakiIconLabel(name),
  value: name,
  icon,
}));

export const DEFAULT_MAKI_ICON_NAME = makiIconOptions[0]?.value;
