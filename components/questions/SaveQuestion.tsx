"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";

const SaveQuestion = ({
  questionId,
  hasSavedQuestionPromise,
}: {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}) => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const router = useRouter();

  const { data, success } = use(hasSavedQuestionPromise);

  const [isLoading, setIsLoading] = useState(false);
  const [hasSaved, setHasSaved] = useState(data?.saved || false);

  // Update state when promise resolves
  useEffect(() => {
    if (success && data) {
      setHasSaved(data.saved || false);
    }
  }, [success, data]);

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId)
      return toast({
        title: "You need to be logged in to save a question",
        variant: "destructive",
      });

    setIsLoading(true);

    try {
      const wasSaved = hasSaved;
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success) throw new Error(error?.message || "An error occurred");

      // Update state optimistically
      setHasSaved(data?.saved || false);

      toast({
        title: `Question ${data?.saved ? "saved" : "unsaved"} successfully`,
      });

      // Refresh to get updated state from server
      router.refresh();
    } catch (error) {
      // Revert state on error
      setHasSaved((prev) => prev);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="Save question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
