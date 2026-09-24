import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LastUpdate } from "./LastUpdate";
import { ParagraphSection } from "./ParagraphSection";
import { ScreenHeader } from "./ScreenHeader";
import { ScrollViewContainer } from "./ScrollViewContainer";

type Props = {
  showBackButton?: boolean;
  showExitButton?: boolean;
  onExit?: () => void;
};

export default function PrivacyPolicyContent({
  showBackButton,
  showExitButton,
  onExit,
}: Props) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <ScreenHeader
        className="p-5"
        showBackButton={showBackButton}
        showCloseButton={showExitButton}
        onClose={onExit}
        title="Politique de confidentialité"
      />

      <ScrollViewContainer
        contentContainerClassName="px-5 pt-5 gap-10"
        contentContainerStyle={{ paddingBottom: bottom + 24 }}
      >
        <ParagraphSection
          title="Introduction"
          text="Chez MindSelf, votre vie privée est une priorité. Cette politique de confidentialité explique quelles informations l'application collecte, comment elles sont utilisées, et pourquoi vous pouvez avoir confiance en la façon dont elles sont traitées. En utilisant MindSelf, vous acceptez les pratiques décrites ci-dessous."
        />

        <ParagraphSection
          title="Les données que nous collectons"
          text="Lors de la configuration de votre profil, nous vous demandons certaines informations facultatives comme votre prénom, votre tranche d'âge, votre genre, votre statut relationnel, votre situation professionnelle ou votre signe astrologique, afin de personnaliser les affirmations qui vous sont proposées. Nous collectons également vos préférences (thème, objectifs quotidiens, horaires de notifications) ainsi que votre activité dans l'application, comme les affirmations que vous aimez ou consultez, pour améliorer les suggestions qui vous sont faites. Aucune de ces informations n'est requise pour utiliser l'application : vous pouvez passer chaque étape si vous le souhaitez."
        />

        <ParagraphSection
          title="Comment nous utilisons vos données"
          text="Les informations que vous nous partagez servent uniquement à personnaliser votre expérience : choisir les affirmations les plus pertinentes pour vous, adapter le rythme de vos rappels, suivre votre progression et vos objectifs, ou afficher le thème que vous avez sélectionné. Nous n'utilisons jamais ces données à des fins publicitaires."
        />

        <ParagraphSection
          title="Stockage, sécurité et confidentialité"
          text="MindSelf ne dispose d'aucun serveur et ne nécessite aucun compte. Toutes vos données sont stockées exclusivement sur votre appareil, de manière sécurisée. Nous n'utilisons aucun outil d'analyse ou de suivi tiers : aucune information vous concernant n'est transmise, partagée ou vendue à des tiers. Si vous supprimez l'application, l'ensemble de vos données locales est définitivement effacé."
        />

        <ParagraphSection
          title="Notifications et achats intégrés"
          text="Si vous activez les notifications, elles sont programmées localement sur votre appareil pour vous envoyer des affirmations à des horaires que vous choisissez ; vous pouvez les désactiver à tout moment dans les réglages. Les achats effectués dans l'application, comme l'abonnement Premium, sont traités directement par l'App Store d'Apple ou le Google Play Store, qui gèrent l'ensemble des informations de paiement : nous n'y avons jamais accès."
        />

        <ParagraphSection
          title="Vos droits et contact"
          text="Puisque vos données restent sur votre appareil, vous en gardez le contrôle total à tout moment : vous pouvez les consulter, les modifier ou les supprimer directement depuis les réglages de l'application, ou en la désinstallant. Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à l'adresse support@mindself.app."
        />

        <LastUpdate date="28/08/2026" />
      </ScrollViewContainer>
    </View>
  );
}
