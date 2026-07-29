import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Aquarius({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 50 33"
      style={{ width: 50, height: 33, ...style }}
    >
      <Path
        d="M16.7812 12.625L13.1562 6.375L2.34375 12.625L0 8.59375L14.9062 0L18.5 6.25L29.3438 0L32.9375 6.25L43.7812 0L49.7188 10.2812L45.6562 12.625L42.0312 6.375L31.2188 12.625L27.5938 6.375L16.7812 12.625ZM16.7812 32.625L13.1562 26.375L2.34375 32.625L0 28.5938L14.9062 20L18.5 26.25L29.3438 20L32.9375 26.25L43.7812 20L49.7188 30.2812L45.6562 32.625L42.0312 26.375L31.2188 32.625L27.5938 26.375L16.7812 32.625Z"
        fill={color}
      />
    </Svg>
  );
}
