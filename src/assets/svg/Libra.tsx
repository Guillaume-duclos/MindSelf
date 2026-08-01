import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Libra({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 300 300"
      style={{ width: 300, height: 300, ...style }}
    >
      <Path
        d="M13 226H287M13 187.95H105.8C101.4 177.402 92.6 151.662 92.6 133.077C92.4669 113.746 103.767 75.1113 150 75.0002M150 75.0002C150.067 75.0001 150.133 75 150.2 75M150 75.0002C196.233 75.1113 207.533 113.746 207.4 133.077C207.4 151.662 198.6 177.402 194.2 187.95H287M150 75.0002C149.933 75.0001 149.867 75 149.8 75"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
