import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Capricorn({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 294 258"
      style={{ width: 294, height: 258, ...style }}
    >
      <Path
        d="M12.0011 45.8895C18.9966 35.8033 37.3464 15.631 54.7814 15.631C76.5751 15.631 89.2946 32.763 99.9832 130.613C107.651 200.813 101.194 197.585 95.5437 197.585C89.8935 197.585 98.3688 102.372 123.391 39.8378C126.889 30.5585 138.889 12 158.907 12C183.929 12 193.615 33.7861 193.615 96.3203C193.615 164.099 211.373 200.006 245.275 200.006C279.176 200.006 282.001 165.31 282.001 156.837C282.001 148.365 280.387 119.72 245.275 119.72C208.145 119.72 196.037 150.786 177.472 189.516C158.907 228.247 137.113 249.226 78.593 245.595"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
