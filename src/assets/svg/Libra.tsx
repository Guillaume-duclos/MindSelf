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
      viewBox="0 0 294 173"
      style={{ width: 294, height: 173, ...style }}
    >
      <Path
        d="M12 161H282M12 123.454H103.445C99.1095 113.046 90.438 87.6462 90.438 69.3077C90.3068 50.2326 101.442 12.1099 147 12.0002M147 12.0002C147.066 12.0001 147.131 12 147.197 12M147 12.0002C192.558 12.1099 203.693 50.2326 203.562 69.3077C203.562 87.6462 194.891 113.046 190.555 123.454H282M147 12.0002C146.934 12.0001 146.869 12 146.803 12"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
