import TermsOfUseContent from "@/components/TermsOfUseContent";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";

export default function TermsOfUse() {
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  return (
    <TermsOfUseContent
      showBackButton
      showExitButton
      onExit={closeSettingsModal}
    />
  );
}
