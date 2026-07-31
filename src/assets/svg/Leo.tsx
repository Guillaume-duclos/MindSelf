import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Leo({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 186 293"
      style={{ width: 186, height: 293, ...style }}
    >
      <Path
        d="M171.051 227.016C179.359 246.313 170.23 282.237 142.168 280.967C116.056 279.786 107.747 252.22 107.747 237.649C107.747 222.291 110.2 213.076 120.012 187.242C128.981 163.627 150.873 120.611 150.873 74.6146C150.873 28.6185 117.638 12 99.8341 12C82.4348 12 48.3997 24.9955 48.3997 69.889C48.3997 92.0955 68.2354 103.344 79.9193 147.004C83.559 160.605 84.6323 181.192 83.9441 190.83M83.9441 190.83C83.9441 208.394 69.3691 225.835 49.191 225.835C29.0129 225.835 12 211.264 12 190.393C12 169.521 27.4303 152.588 49.191 152.588C70.9517 152.588 83.9441 170.68 83.9441 190.83Z"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
