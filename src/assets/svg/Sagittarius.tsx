import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Sagittarius({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 300 300"
      style={{ width: 300, height: 300, ...style }}
    >
      <Path
        d="M20 287L127.059 172.998M161.101 13L276.053 16.9567L280 131.7M276.053 16.9567L127.059 172.998M127.059 172.998L184.288 230.37M127.059 172.998L72.7894 118.594"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
