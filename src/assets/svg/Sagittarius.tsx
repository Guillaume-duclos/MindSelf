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
      viewBox="0 0 279 292"
      style={{ width: 279, height: 292, ...style }}
    >
      <Path
        d="M12 280L117 168.495M150.387 12L263.129 15.87L267 128.101M263.129 15.87L117 168.495M117 168.495L173.129 224.61M117 168.495L63.7742 115.282"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
