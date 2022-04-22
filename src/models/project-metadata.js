// Converts metadata of any version to latest version
export const consolidateMetadata = (
  metadata,
) => {
  return {
    ...metadata,
    payButton:
      (metadata).payButton ??
      (metadata).payText,
    version: 4,
  }
}
