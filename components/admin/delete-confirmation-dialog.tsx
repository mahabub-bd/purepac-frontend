import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  defaultToast = true,
  toastMessage = "Successfully deleted",
}: {
  open: boolean;
  onClose: () => void;

  onConfirm?: () => Promise<void>;
  defaultToast?: boolean;
  toastMessage?: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = async () => {
    if (!onConfirm) {
      onClose();
      return;
    }
    await onConfirm();

    onClose();
    if (defaultToast) {
      toast.success(toastMessage, {
        position: "top-right",
      });
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={isPending ? "pointer-events-none" : ""}
            onClick={() => startTransition(handleConfirm)}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Deleting.." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
