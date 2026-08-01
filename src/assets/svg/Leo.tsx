import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Leo({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 300 300"
      style={{ width: 300, height: 300, ...style }}
    >
      <Path
        d="M229.978 232.013C238.492 251.668 229.137 288.26 200.382 286.967C173.625 285.763 165.111 257.685 165.111 242.843C165.111 227.199 167.625 217.813 177.679 191.499C186.87 167.446 209.302 123.63 209.302 76.7785C209.302 29.9274 175.247 13 157.003 13C139.174 13 104.298 26.237 104.298 71.965C104.298 94.5843 124.624 106.041 136.596 150.513C140.326 164.367 141.426 185.336 140.72 195.154M140.72 195.154C140.72 213.044 125.786 230.81 105.109 230.81C84.433 230.81 67 215.968 67 194.708C67 173.449 82.8113 156.201 105.109 156.201C127.407 156.201 140.72 174.629 140.72 195.154Z"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
