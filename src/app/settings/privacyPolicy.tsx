import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";

export default function PrivacyPolicy() {
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  return (
    <PrivacyPolicyContent
      showBackButton
      showExitButton
      onExit={closeSettingsModal}
    />
  );
}
