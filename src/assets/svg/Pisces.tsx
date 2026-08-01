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
      viewBox="0 0 300 300"
      style={{ width: 300, height: 300, ...style }}
    >
      <Path
        d="M46 13C65.8545 30.0953 107.927 79.0069 107.927 150.712C107.927 151.026 107.926 151.343 107.924 151.662M107.924 151.662C107.734 184.139 97.6814 241.856 46 287M107.924 151.662H56.8727M107.924 151.662H192.076M254 13C234.145 30.0953 192.073 79.0069 192.073 150.712C192.073 151.026 192.074 151.343 192.076 151.662M192.076 151.662C192.266 184.139 202.319 241.856 254 287M192.076 151.662H240.291"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
