import { DropZone, type Config } from "@puckeditor/core";

const renderRoot: NonNullable<Config["root"]>["render"] = () => (
  <DropZone
    zone="default-zone"
    style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    disallow={[]}
  />
);

export const directoryRootConfig: NonNullable<Config["root"]> = {
  render: renderRoot,
};

export const locatorRootConfig: NonNullable<Config["root"]> = {
  render: renderRoot,
};
