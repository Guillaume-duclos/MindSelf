import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Scorpio({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 294 220"
      style={{ width: 294, height: 220, ...style }}
    >
      <Path
        d="M12.0029 34.6426C15.2003 27.6847 23.4605 13.769 38.6476 13.769C59.3276 13.769 64.1956 31.7223 73.8187 100.801C82.345 162.007 74.5292 166.253 74.5292 166.253C64.2266 166.253 73.5345 101.792 93.7134 46.3177C98.7775 32.3959 104.162 12 121.099 12C138.036 12 145.937 30.7509 156.595 102.217C164.404 154.578 159.792 160.592 154.819 160.592C148.424 160.592 151.977 92.9473 176.134 36.0578C179.332 28.0385 189.208 12 203.134 12C220.542 12 230.845 31.4585 225.871 74.2671C220.898 117.076 220.187 171.884 261.398 182.881L269.924 184.65L282.003 182.881M261.398 208L282.003 182.881L264.069 153.777"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
