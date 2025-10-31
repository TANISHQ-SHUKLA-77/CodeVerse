import { Metadata } from "next";
import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import HomeFilter from "@/components/filters/HomeFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "CodeVerse | Home",
  description:
    "Discover different programming questions and answers with recommendations from the community.",
};

async function Home({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { questions, isNext } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION} className="max-sm:w-full">
            Ask a Question
          </Link>
        </Button>
      </section>

      <Suspense
        fallback={
          <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <div className="h-14 flex-1 bg-black/5 dark:bg-white/5 rounded-md" />
            <div className="h-14 w-28 bg-black/5 dark:bg-white/5 rounded-md" />
          </section>
        }
      >
        <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearch
            route={ROUTES.HOME}
            imgSrc="/icons/search.svg"
            placeholder="Search questions..."
            iconPosition="left"
            otherClasses="flex-1"
          />

          <CommonFilter
            filters={HomePageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
          />
        </section>
      </Suspense>

      <Suspense fallback={<div className="mt-10 h-10 bg-black/5 dark:bg-white/5 rounded-md" />}>
        <HomeFilter />
      </Suspense>

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />

      <Suspense fallback={<div className="mt-6 h-10 bg-black/5 dark:bg-white/5 rounded-md" />}>
        <Pagination page={page} isNext={isNext || false} />
      </Suspense>
    </>
  );
}

export default Home;
