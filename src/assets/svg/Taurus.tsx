import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Taurus({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 300 300"
      style={{ width: 300, height: 300, ...style }}
    >
      <Path
        d="M149.762 287C100.022 287 59.6991 246.885 59.6991 197.4C59.6991 147.915 100.022 107.8 149.762 107.8C138.325 107.8 96.9595 98.9825 72.0887 56.1262C47.2178 13.2699 36.8261 12.9988 13 13M150.238 287C199.978 287 240.301 246.885 240.301 197.4C240.301 147.915 199.502 107.815 149.762 107.815C161.198 107.815 203.04 98.9825 227.911 56.1262C252.782 13.2699 263.174 12.9988 287 13"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
