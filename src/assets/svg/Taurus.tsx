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
      viewBox="0 0 294 294"
      style={{ width: 294, height: 294, ...style }}
    >
      <Path
        d="M146.765 282C97.7512 282 58.0174 242.47 58.0174 193.708C58.0174 144.946 97.7512 105.416 146.765 105.416C135.496 105.416 94.7338 96.7272 70.2261 54.4966C45.7183 12.266 35.4783 11.9988 12 12M147.235 282C196.249 282 235.983 242.47 235.983 193.708C235.983 144.946 195.779 105.431 146.765 105.431C158.035 105.431 199.266 96.7272 223.774 54.4966C248.282 12.266 258.522 11.9988 282 12"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
