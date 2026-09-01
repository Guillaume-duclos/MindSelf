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
          text="Chez MindSelf, ta vie privée est une priorité. Cette politique de confidentialité explique quelles informations l'application collecte, comment elles sont utilisées, et pourquoi tu peux avoir confiance en la façon dont elles sont traitées. En utilisant MindSelf, tu acceptes les pratiques décrites ci-dessous."
        />

        <ParagraphSection
          title="Les données que nous collectons"
          text="Lors de la configuration de ton profil, nous te demandons certaines informations facultatives comme ton prénom, ta tranche d'âge, ton genre, ton statut relationnel, ta situation professionnelle ou ton signe astrologique, afin de personnaliser les affirmations qui te sont proposées. Nous collectons également tes préférences (thème, objectifs quotidiens, horaires de notifications) ainsi que ton activité dans l'application, comme les affirmations que tu aimes ou consultes, pour améliorer les suggestions qui te sont faites. Aucune de ces informations n'est requise pour utiliser l'application : tu peux passer chaque étape si tu le souhaites."
        />

        <ParagraphSection
          title="Comment nous utilisons tes données"
          text="Les informations que tu nous partages servent uniquement à personnaliser ton expérience : choisir les affirmations les plus pertinentes pour toi, adapter le rythme de tes rappels, suivre ta progression et tes objectifs, ou afficher le thème que tu as sélectionné. Nous n'utilisons jamais ces données à des fins publicitaires."
        />

        <ParagraphSection
          title="Stockage, sécurité et confidentialité"
          text="MindSelf ne dispose d'aucun serveur et ne nécessite aucun compte. Toutes tes données sont stockées exclusivement sur ton appareil, de manière sécurisée. Nous n'utilisons aucun outil d'analyse ou de suivi tiers : aucune information te concernant n'est transmise, partagée ou vendue à des tiers. Si tu supprimes l'application, l'ensemble de tes données locales est définitivement effacé."
        />

        <ParagraphSection
          title="Notifications et achats intégrés"
          text="Si tu actives les notifications, elles sont programmées localement sur ton appareil pour t'envoyer des affirmations à des horaires que tu choisis ; tu peux les désactiver à tout moment dans les réglages. Les achats effectués dans l'application, comme l'abonnement Premium, sont traités directement par l'App Store d'Apple ou le Google Play Store, qui gèrent l'ensemble des informations de paiement : nous n'y avons jamais accès."
        />

        <ParagraphSection
          title="Tes droits et contact"
          text="Puisque tes données restent sur ton appareil, tu en gardes le contrôle total à tout moment : tu peux les consulter, les modifier ou les supprimer directement depuis les réglages de l'application, ou en la désinstallant. Pour toute question concernant cette politique de confidentialité, tu peux nous contacter à l'adresse support@mindself.app."
        />

        <LastUpdate date="28/08/2026" />
      </ScrollViewContainer>
    </View>
  );
}
