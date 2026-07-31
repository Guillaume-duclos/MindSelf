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
      viewBox="0 0 294 236"
      style={{ width: 294, height: 236, ...style }}
    >
      <Path
        d="M24.9808 93.5934C20.5302 87.9066 12 74.2335 12 60.5852C12 43.5247 26.8352 12 60.2143 12C93.5934 12 113.033 41.2995 127.343 94.706C141.654 148.113 147 191.876 147 223.772"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M269.019 93.5934C273.47 87.9066 282 74.2335 282 60.5852C282 43.5247 267.165 12 233.786 12C200.407 12 180.967 41.2995 166.657 94.706C152.346 148.113 147 191.876 147 223.772"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
