import { AstralSignPicker, ZODIAC_SIGNS } from "@/components/AstralSignPicker";
import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsSelectPicker } from "@/components/CustomOptionsSelectPicker";
import { OnboardingContentContainer } from "@/components/OnboardingContentContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenTitle } from "@/components/ScreenTitle";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import Question from "@/types/question";
import { getRouteForPage } from "@/utils/onboarding";
import { getStorageString, setStorageItem } from "@/utils/storage";
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

const questions: Question[] = [
  {
    title: "Dans quelle tranche d'âge te situe tu ?",
    storageKey: StorageKey.USER_AGE_RANGE,
    page: Page.ONBOARDING_USER_AGE_RANGE,
    nextPage: Page.ONBOARDING_USER_SEX,
    options: [
      {
        label: "Moins de 18 ans",
        value: "under_18",
      },
      {
        label: "18-24 ans",
        value: "18_24",
      },
      {
        label: "25-34 ans",
        value: "25_34",
      },
      {
        label: "35-44 ans",
        value: "35_44",
      },
      {
        label: "45-54 ans",
        value: "45_54",
      },
      {
        label: "55 ans et plus",
        value: "55_plus",
      },
    ],
  },
  {
    title: "De quel côté es tu ?",
    storageKey: StorageKey.USER_SEX,
    page: Page.ONBOARDING_USER_SEX,
    nextPage: Page.ONBOARDING_USER_RELATIONSHIP_STATUS,
    options: [
      {
        label: "Homme",
        value: "male",
      },
      {
        label: "Femme",
        value: "female",
      },
      {
        label: "Non précisé",
        value: "unspecified",
      },
    ],
  },
  {
    title: "Quel est ton statut relationnel ?",
    storageKey: StorageKey.USER_RELATIONSHIP_STATUS,
    page: Page.ONBOARDING_USER_RELATIONSHIP_STATUS,
    nextPage: Page.ONBOARDING_USER_PROFESSIONAL_STATUS,
    options: [
      {
        label: "En couple",
        value: "in_relationship",
      },
      {
        label: "Célibataire mais ouvert",
        value: "single_open",
      },
      {
        label: "En court de séparation",
        value: "breaking_up",
      },
      {
        label: "Dans une situation compliqué",
        value: "complicated",
      },
      {
        label: "Pas intéressé pour le moment",
        value: "not_interested",
      },
    ],
  },
  {
    title: "Quelle est ta situation professionnelle ?",
    storageKey: StorageKey.USER_PROFESSIONAL_STATUS,
    page: Page.ONBOARDING_USER_PROFESSIONAL_STATUS,
    nextPage: Page.ONBOARDING_USER_ASTRAL_SIGN,
    options: [
      {
        label: "Étudiant",
        value: "student",
      },
      {
        label: "En recherche d'emploi",
        value: "job_seeking",
      },
      {
        label: "Employé",
        value: "employed",
      },
      {
        label: "Indépendant",
        value: "self_employed",
      },
      {
        label: "Retraité",
        value: "retired",
      },
      {
        label: "Parent au foyer",
        value: "stay_at_home_parent",
      },
      {
        label: "Autre",
        value: "other",
      },
    ],
  },
  {
    title: "Quel est ton signe astrologique ?",
    description:
      "Fais pivoter la flèche ou clic sur un signe pour effectuer ta sélection.",
    astralSign: true,
    storageKey: StorageKey.USER_ASTRAL_SIGN,
    page: Page.ONBOARDING_USER_ASTRAL_SIGN,
    nextPage: Page.LOADING_PROFILE,
  },
];

const getInitialIndex = (): number => {
  const currentPage = getStorageString(StorageKey.CURRENT_ONBOARDING_PAGE);
  const index = questions.findIndex(
    (question) => question.page === currentPage,
  );

  return index === -1 ? 0 : index;
};

export default function PersonnalInformations() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);
  const [displayedIndex, setDisplayedIndex] = useState(getInitialIndex);
  const [answers, setAnswers] = useState(() =>
    questions.map((question) => {
      const savedValue = getStorageString(question.storageKey);

      if (savedValue) {
        return savedValue;
      }

      return question.astralSign
        ? ZODIAC_SIGNS[0].value
        : question.options[0].value;
    }),
  );
  const [isIntroAnimating, setIsIntroAnimating] = useState(false);

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
    const nextPage = questions[displayedIndex].nextPage;

    if (nextPage) {
      setStorageItem(StorageKey.CURRENT_ONBOARDING_PAGE, nextPage);
    }

    if (isLastQuestion) {
      if (nextPage) {
        router.push(getRouteForPage(nextPage));
      }
    } else {
      setCurrentIndex((previousIndex) => previousIndex + 1);
    }
  };

  const handleContinuePress = () => {
    setStorageItem(
      questions[displayedIndex].storageKey,
      answers[displayedIndex],
    );
    handleContinue();
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setStorageItem(
        StorageKey.CURRENT_ONBOARDING_PAGE,
        questions[currentIndex - 1].page,
      );
      setCurrentIndex((previousIndex) => previousIndex - 1);
    } else {
      setStorageItem(
        StorageKey.CURRENT_ONBOARDING_PAGE,
        Page.ONBOARDING_USER_NOTIFICATION_TIME_RANGE,
      );
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 px-5 items-center bg-cream-50">
      <ScreenHeader
        showBackButton={currentIndex > 0}
        showCloseButton={false}
        showSkipButton
        className="py-0"
        onBack={handleBack}
        onSkip={handleContinue}
      />

      <OnboardingContentContainer>
        <Animated.View
          style={animatedContentStyle}
          className="my-6 flex-1 items-center justify-center w-full gap-8"
        >
          <ScreenTitle
            title={displayedQuestion.title}
            description={displayedQuestion.description}
          />

          {displayedQuestion.astralSign ? (
            <AstralSignPicker
              value={answers[displayedIndex]}
              onChange={handleSelectAnswer}
              onIntroAnimatingChange={setIsIntroAnimating}
            />
          ) : (
            <CustomOptionsSelectPicker
              options={displayedQuestion.options}
              selectedValue={answers[displayedIndex]}
              onValueChange={handleSelectAnswer}
            />
          )}
        </Animated.View>

        <View className="w-full gap-4">
          <CustomButton
            label="Continuer"
            disabled={isIntroAnimating}
            onPress={handleContinuePress}
          />
        </View>
      </OnboardingContentContainer>
    </SafeAreaView>
  );
}
