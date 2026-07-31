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
      viewBox="0 0 241 296"
      style={{ width: 241, height: 296, ...style }}
    >
      <Path
        d="M66.5 40.2419C86.0834 45.7767 106.069 48.433 120.5 48.433C134.931 48.433 154.917 45.7767 174.5 40.2419M66.5 40.2419C45.3734 34.271 24.7143 24.95 12 12M66.5 40.2419V255.758M174.5 40.2419C195.627 34.271 216.286 24.95 229 12M174.5 40.2419V255.758M66.5 255.758C86.0834 250.223 106.069 247.567 120.5 247.567C134.931 247.567 154.917 250.223 174.5 255.758M66.5 255.758C45.3734 261.729 24.7143 271.05 12 284M174.5 255.758C195.627 261.729 216.286 271.05 229 284"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
