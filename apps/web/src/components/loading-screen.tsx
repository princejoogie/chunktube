import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import ExpandingLoader from "./icons/loading/expand";

const texts = [
  "Please wait while we conclude your video, this may take a while.",
  "This usually takes a few seconds, but can take up to 2 minutes.",
  "We're working hard to conclude your video, please wait.",
  "You will automatically be redirected to your video when it's done.",
  "We're almost done, just a few more seconds.",
];

export const LoadingScreen = ({ isOpen }: { isOpen: boolean }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx(idx + 1 >= texts.length ? 0 : idx + 1);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [idx]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Concluding video...</AlertDialogTitle>

          <AlertDialogDescription>
            <p>{texts[idx]}</p>
            <div className="mt-4">
              <ExpandingLoader />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
