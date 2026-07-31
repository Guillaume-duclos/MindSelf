import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Cancer({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 294 257"
      style={{ width: 294, height: 257, ...style }}
    >
      <Path
        d="M12.0018 107.969C12.0018 145.02 40.097 153.805 57.2399 153.805C88.6684 153.805 101.049 128.5 101.049 107.969C101.049 91.7357 91.5256 64.5205 57.2399 64.5205C14.3827 64.5205 12.0018 101.762 12.0018 107.969ZM12.0018 107.969C12.0018 61.6557 65.8113 12 152.954 12C240.097 12 267.24 47.332 282.002 71.6824M282.002 149.031C282.002 111.98 253.907 103.195 236.764 103.195C205.335 103.195 192.954 128.5 192.954 149.031C192.954 165.264 202.478 192.48 236.764 192.48C279.621 192.48 282.002 155.238 282.002 149.031ZM282.002 149.031C282.002 195.344 228.192 245 141.049 245C53.9065 245 26.7637 209.668 12.0018 185.318"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
