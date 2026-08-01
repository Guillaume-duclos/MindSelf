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
      viewBox="0 0 300 300"
      style={{ width: 300, height: 300, ...style }}
    >
      <Path
        d="M13 73.1047C16.2447 66.0048 24.6273 51.8051 40.0395 51.8051C61.0258 51.8051 65.9659 70.1248 75.7316 140.614C84.3842 203.069 76.4526 207.401 76.4526 207.401C65.9974 207.401 75.4432 141.625 95.9211 85.0181C101.06 70.8122 106.524 50 123.712 50C140.9 50 148.918 69.1336 159.734 142.058C167.659 195.487 162.979 201.625 157.932 201.625C151.442 201.625 155.047 132.599 179.563 74.5487C182.808 66.3658 192.831 50 206.963 50C224.629 50 235.084 69.8556 230.037 113.538C224.989 157.22 224.268 213.147 266.089 224.368L274.742 226.173L287 224.368M266.089 250L287 224.368L268.801 194.67"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
