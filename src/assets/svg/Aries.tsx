import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Aries({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 300 300"
      style={{ width: 300, height: 300, ...style }}
    >
      <Path
        d="M26.1731 125.802C21.6566 120.031 13 106.156 13 92.305C13 74.9918 28.0549 43 61.9286 43C95.8022 43 115.53 72.7335 130.052 126.931C144.574 181.129 150 225.541 150 257.909"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
      />
      <Path
        d="M273.827 125.802C278.343 120.031 287 106.156 287 92.305C287 74.9918 271.945 43 238.071 43C204.198 43 184.47 72.7335 169.948 126.931C155.426 181.129 150 225.541 150 257.909"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
      />
    </Svg>
  );
}
