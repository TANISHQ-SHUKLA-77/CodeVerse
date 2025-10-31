"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { createVote, hasVoted } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";

interface Params {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}

const Votes = ({
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  hasVotedPromise,
  targetId,
  targetType,
}: Params) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const router = useRouter();

  const { success, data } = use(hasVotedPromise);

  const [isLoading, setIsLoading] = useState(false);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [hasUpvoted, setHasUpvoted] = useState(data?.hasUpvoted || false);
  const [hasDownvoted, setHasDownvoted] = useState(data?.hasDownvoted || false);

  // Update state when promise resolves
  useEffect(() => {
    if (success && data) {
      setHasUpvoted(data.hasUpvoted || false);
      setHasDownvoted(data.hasDownvoted || false);
    }
  }, [success, data]);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId)
      return toast({
        title: "Please login to vote",
        description: "Only logged-in users can vote.",
      });

    setIsLoading(true);

    try {
      const wasUpvoted = hasUpvoted;
      const wasDownvoted = hasDownvoted;

      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        return toast({
          title: "Failed to vote",
          description: result.error?.message,
          variant: "destructive",
        });
      }

      // Update vote counts optimistically
      if (voteType === "upvote") {
        if (wasUpvoted) {
          // Remove upvote
          setUpvotes((prev) => Math.max(0, prev - 1));
          setHasUpvoted(false);
        } else {
          // Add upvote
          setUpvotes((prev) => prev + 1);
          setHasUpvoted(true);
          // If was downvoted, remove downvote
          if (wasDownvoted) {
            setDownvotes((prev) => Math.max(0, prev - 1));
            setHasDownvoted(false);
          }
        }
      } else {
        if (wasDownvoted) {
          // Remove downvote
          setDownvotes((prev) => Math.max(0, prev - 1));
          setHasDownvoted(false);
        } else {
          // Add downvote
          setDownvotes((prev) => prev + 1);
          setHasDownvoted(true);
          // If was upvoted, remove upvote
          if (wasUpvoted) {
            setUpvotes((prev) => Math.max(0, prev - 1));
            setHasUpvoted(false);
          }
        }
      }

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!wasUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${!wasDownvoted ? "added" : "removed"} successfully`;

      toast({
        title: successMessage,
        description: "Your vote has been recorded.",
      });

      // Refresh the page to get accurate counts from server
      router.refresh();
    } catch (error) {
      toast({
        title: "Failed to vote",
        description: "An error occurred while voting. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
