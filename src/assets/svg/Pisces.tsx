import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Pisces({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 232 297"
      style={{ width: 232, height: 297, ...style }}
    >
      <Path
        d="M12.0002 12C31.8548 29.0329 73.9275 77.766 73.9275 149.21C73.9275 149.523 73.9266 149.838 73.9247 150.156M73.9247 150.156C73.734 182.514 63.6817 240.021 12.0002 285M73.9247 150.156H22.873M73.9247 150.156H158.076M220 12C200.146 29.0329 158.073 77.766 158.073 149.21C158.073 149.523 158.074 149.838 158.076 150.156M158.076 150.156C158.266 182.514 168.319 240.021 220 285M158.076 150.156H206.291"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
