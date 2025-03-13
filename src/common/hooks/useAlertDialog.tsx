import { useState } from "react";

interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
}

export const useAlertDialog = () => {
  const [dialog, setDialog] = useState<AlertDialogState>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const openDialog = (
    title: string,
    description: string,
    onConfirm: () => void,
  ) => {
    setDialog({
      isOpen: true,
      title,
      description,
      onConfirm,
    });
  };

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    dialog,
    openDialog,
    closeDialog,
  };
};
