import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Gemini({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 300 300"
      style={{ width: 300, height: 300, ...style }}
    >
      <Path
        d="M95.7512 41.4496C115.425 47.0251 135.502 49.7009 150 49.7009C164.498 49.7009 184.575 47.0251 204.249 41.4496M95.7512 41.4496C74.5272 35.4348 53.7729 26.0452 41 13M95.7512 41.4496V258.55M204.249 41.4496C225.473 35.4348 246.227 26.0452 259 13M204.249 41.4496V258.55M95.7512 258.55C115.425 252.975 135.502 250.299 150 250.299C164.498 250.299 184.575 252.975 204.249 258.55M95.7512 258.55C74.5272 264.565 53.7729 273.955 41 287M204.249 258.55C225.473 264.565 246.227 273.955 259 287"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
