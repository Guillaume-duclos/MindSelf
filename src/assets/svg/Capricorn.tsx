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
      viewBox="0 0 300 300"
      style={{ width: 300, height: 300, ...style }}
    >
      <Path
        d="M13 65.4688C20.0992 55.2102 38.7208 34.6931 56.4141 34.6931C78.5306 34.6931 91.4386 52.118 102.286 151.641C110.067 223.04 103.514 219.758 97.7803 219.758C92.0463 219.758 100.647 122.917 126.04 59.3137C129.59 49.8758 141.768 31 162.082 31C187.475 31 197.305 53.1585 197.305 116.762C197.305 185.699 215.326 222.22 249.729 222.22C284.133 222.22 287 186.93 287 178.313C287 169.696 285.362 140.562 249.729 140.562C212.049 140.562 199.762 172.158 180.922 211.551C162.082 250.944 139.966 272.282 80.5785 268.589"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
