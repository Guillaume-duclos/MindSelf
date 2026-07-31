import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsPicker } from "@/components/CustomOptionsPicker";
import { OnboardingContentContainer } from "@/components/OnboardingContentContainer";
import { OnboardingTitle } from "@/components/OnboardingTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { runOnJS } from "react-native-worklets";

const questions = [
  {
    title: "Dans quelle tranche d'âge te situe tu ?",
    options: [
      {
        label: "Moins de 18 ans",
        value: "Moins de 18 ans",
      },
      {
        label: "18-24 ans",
        value: "18-24 ans",
      },
      {
        label: "25-34 ans",
        value: "25-34 ans",
      },
      {
        label: "35-44 ans",
        value: "35-44 ans",
      },
      {
        label: "45-54 ans",
        value: "45-54 ans",
      },
      {
        label: "55 ans et plus",
        value: "55 ans et plus",
      },
    ],
  },
  {
    title: "De quel côté es tu ?",
    options: [
      {
        label: "Homme",
        value: "Homme",
      },
      {
        label: "Femme",
        value: "Femme",
      },
      {
        label: "Non précisé",
        value: "Non précisé",
      },
    ],
  },
  {
    title: "Quelle est ton statut relationnel ?",
    options: [
      {
        label: "En couple",
        value: "En couple",
      },
      {
        label: "Célibataire mais ouvert",
        value: "Célibataire mais ouvert",
      },
      {
        label: "En court de séparation",
        value: "En court de séparation",
      },
      {
        label: "Dans une situation compliqué",
        value: "Dans une situation compliqué",
      },
      {
        label: "Pas intéressé pour le moment",
        value: "Pas intéressé pour le moment",
      },
    ],
  },
  {
    title: "Quelle est ta situation professionnelle ?",
    options: [
      {
        label: "Étudiant",
        value: "Étudiant",
      },
      {
        label: "En recherche d'emploi",
        value: "En recherche d'emploi",
      },
      {
        label: "Employé",
        value: "Employé",
      },
      {
        label: "Indépendant",
        value: "Indépendant",
      },
      {
        label: "Retraité",
        value: "Retraité",
      },
      {
        label: "Parent au foyer",
        value: "Parent au foyer",
      },
      {
        label: "Autre",
        value: "Autre",
      },
    ],
  },
];

export default function PersonnalInformations() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [answers, setAnswers] = useState(
    questions.map((question) => question.options[0].value),
  );

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const displayedQuestion = questions[displayedIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    if (displayedIndex === currentIndex) {
      return;
    }

    scale.value = withTiming(0.99, { duration: 100 });
    opacity.value = withTiming(0, { duration: 100 }, (finished) => {
      if (finished) {
        runOnJS(setDisplayedIndex)(currentIndex);
        scale.value = 0.99;
        scale.value = withTiming(1, { duration: 200 });
        opacity.value = withTiming(1, { duration: 200 });
      }
    });
  }, [currentIndex]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleSelectAnswer = (value: string) => {
    setAnswers((previousAnswers) =>
      previousAnswers.map((answer, index) =>
        index === displayedIndex ? value : answer,
      ),
    );
  };

  const handleContinue = () => {
    if (isLastQuestion) {
      router.push("/onboarding/userAstralSign");
    } else {
      setCurrentIndex((previousIndex) => previousIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previousIndex) => previousIndex - 1);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 px-5 items-center bg-[#FAF3EF]">
      <ScreenHeader
        showBackButton={currentIndex > 0}
        showCloseButton={false}
        className="py-0"
        onBack={handleBack}
        onSkip={handleContinue}
      />

      <OnboardingContentContainer>
        <View className="flex-1 items-center justify-center w-full gap-2">
          <Animated.View
            style={animatedContentStyle}
            className="items-center w-full gap-2"
          >
            <OnboardingTitle title={displayedQuestion.title} />

            <CustomOptionsPicker
              options={displayedQuestion.options}
              selectedValue={answers[displayedIndex]}
              onValueChange={handleSelectAnswer}
            />
          </Animated.View>
        </View>

        <View className="w-full gap-4">
          <CustomButton label="Continuer" onPress={handleContinue} />
        </View>
      </OnboardingContentContainer>
    </SafeAreaView>
  );
}
