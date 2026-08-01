import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Cancer({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 300 300"
      style={{ width: 300, height: 300, ...style }}
    >
      <Path
        d="M13 129.793C13 167.162 41.5115 176.023 58.9083 176.023C90.8025 176.023 103.367 150.5 103.367 129.793C103.367 113.42 93.7019 85.9713 58.9083 85.9713C15.4162 85.9713 13 123.533 13 129.793ZM13 129.793C13 83.082 67.6067 33 156.041 33C244.474 33 272.019 68.6352 287 93.1947M287 171.207C287 133.838 258.489 124.977 241.092 124.977C209.198 124.977 196.633 150.5 196.633 171.207C196.633 187.58 206.298 215.029 241.092 215.029C284.584 215.029 287 177.467 287 171.207ZM287 171.207C287 217.918 232.393 268 143.959 268C55.5256 268 27.9806 232.365 13 207.805"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
