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
      viewBox="0 0 40 40"
      style={{ width: 40, height: 40, ...style }}
    >
      <Path
        d="M34.5625 8.03125L17.6875 24.9062L26.1562 33.375L22.8438 36.6875L14.375 28.2188L3.3125 39.2812L0 35.9688L11.0625 24.9062L2.59375 16.4375L5.90625 13.125L14.375 21.5938L31.2812 4.6875H18.4375V0H39.25V20.8125H34.5625V8.03125Z"
        fill={color}
      />
    </Svg>
  );
}
