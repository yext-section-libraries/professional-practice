import { HoursStatus as renderConfig } from "./HoursStatus.render";
import type { HoursStatusProps } from "./HoursStatus.render";
export type { HoursStatusProps } from "./HoursStatus.render";
import { msg } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import {
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";
export const hoursStatusWrapperFields: YextFields<HoursStatusProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      hours: {
        type: "entityField",
        label: msg("fields.hours", "Hours"),
        filter: {
          types: ["type.hours"],
        },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      showCurrentStatus: {
        label: msg("fields.showCurrentStatus", "Show Current Status"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
      },
      timeFormat: {
        label: msg("fields.timeFormat", "Time Format"),
        type: "radio",
        options: [
          { label: msg("fields.options.hour12", "12-hour"), value: "12h" },
          { label: msg("fields.options.hour24", "24-hour"), value: "24h" },
        ],
      },
      showDayNames: {
        label: msg("fields.showDayNames", "Show Day Names"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
      },
      dayOfWeekFormat: {
        label: msg("fields.dayOfWeekFormat", "Day of Week Format"),
        type: "radio",
        options: [
          { label: msg("fields.options.short", "Short"), value: "short" },
          { label: msg("fields.options.long", "Long"), value: "long" },
        ],
      },
    },
  },
};

export const HoursStatus: YextComponentConfig<HoursStatusProps> = {
  label: msg("components.hoursStatus", "Hours Status"),
  fields: hoursStatusWrapperFields,
  defaultProps: {
    data: {
      hours: {
        field: "hours",
        constantValue: {},
      },
    },
    styles: {
      showCurrentStatus: true,
      timeFormat: "12h",
      showDayNames: true,
      dayOfWeekFormat: "long",
      className: "",
    },
  },
  resolveFields: (data) =>
    resolveDataFromParent(hoursStatusWrapperFields, data),
  render: renderConfig.render,
};
