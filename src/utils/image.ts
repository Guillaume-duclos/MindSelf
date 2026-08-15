import { Image as RNImage } from "react-native";

// Local `require()`'d assets already have their pixel dimensions available
// synchronously, so the image's real aspect ratio can drive its layout
// instead of a fixed height.
export const getImageAspectRatio = (source: number): number => {
  const { width, height } = RNImage.resolveAssetSource(source);
  return width / height;
};
