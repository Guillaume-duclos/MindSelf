import { LastUpdate } from "./LastUpdate";
import { ParagraphSection } from "./ParagraphSection";
import { SafeAreaViewContainer } from "./SafeAreaViewContainer";
import { ScreenHeader } from "./ScreenHeader";
import { ScrollViewContainer } from "./ScrollViewContainer";

type Props = {
  showBackButton?: boolean;
  showExitButton?: boolean;
  onExit?: () => void;
};

export default function TermsOfUseContent({
  showBackButton,
  showExitButton,
  onExit,
}: Props) {
  return (
    <SafeAreaViewContainer className="flex-1">
      <ScreenHeader
        className="p-5"
        showBackButton={showBackButton}
        showCloseButton={showExitButton}
        onClose={onExit}
        title="Conditions d'utilisation"
      />

      <ScrollViewContainer
        contentContainerClassName="px-5 pt-5 gap-10"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <ParagraphSection
          title="Acceptation des conditions"
          text="En téléchargeant ou en utilisant l'application MindSelf, vous acceptez d'être lié(e) par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, merci de ne pas utiliser l'application."
        />

        <ParagraphSection
          title="Utilisation de l'application"
          text="MindSelf vous propose des affirmations positives destinées à soutenir votre bien-être personnel. Vous vous engagez à utiliser l'application uniquement à des fins personnelles et légales, et à ne pas tenter de perturber son fonctionnement, d'en extraire le contenu à des fins commerciales, ou de contourner les mécanismes de sécurité mis en place."
        />

        <ParagraphSection
          title="Contenu et personnalisation"
          text="Les affirmations proposées dans l'application appartiennent à MindSelf et sont mises à votre disposition pour un usage personnel. Lorsque vous partagez une affirmation, par exemple sous forme d'image, vous restez seul(e) responsable de l'usage qui en est fait une fois partagée en dehors de l'application. Les informations que vous renseignez pour personnaliser votre expérience, comme votre prénom, vos préférences ou votre thème, restent votre propriété et sont stockées uniquement sur votre appareil."
        />

        <ParagraphSection
          title="Achats intégrés"
          text="L'application peut proposer un abonnement ou des fonctionnalités Premium via des achats intégrés. Ces achats sont traités par l'App Store d'Apple ou le Google Play Store, dont les conditions générales de vente s'appliquent. Nous ne gérons ni ne stockons aucune information de paiement."
        />

        <ParagraphSection
          title="Limitation de responsabilité"
          text="MindSelf est fournie « telle quelle », sans garantie d'aucune sorte. Les affirmations proposées ne remplacent en aucun cas un accompagnement médical, psychologique ou thérapeutique professionnel. Nous ne pouvons être tenus responsables des conséquences résultant de l'utilisation de l'application."
        />

        <ParagraphSection
          title="Modification des conditions"
          text="Nous pouvons être amenés à modifier ces conditions d'utilisation à tout moment. Les modifications prendront effet dès leur publication dans l'application. Votre utilisation continue de MindSelf après une mise à jour vaut acceptation des nouvelles conditions."
        />

        <LastUpdate date="28/08/2026" />
      </ScrollViewContainer>
    </SafeAreaViewContainer>
  );
}
