"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Feedback = () => {
  const params = useParams();
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    GetFeedback();
  }, []);
  // db se user id leker feedback dena
  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer?.mockIdRef, params.interviewID))
      .orderBy(UserAnswer.id);

    // console.log(result);
    setFeedbackList(result);
  };

  const overallRating = useMemo(() => {
    if (feedbackList && feedbackList.length > 0) {
      const totalRating = feedbackList.reduce(
        (sum, item) => sum + Number(item.rating),
        0
      );
      // console.log("total",totalRating);
      // console.log("length",feedbackList.length);
      return (totalRating / feedbackList.length).toFixed(1);
    }
    return 0;
  }, [feedbackList]);

  return (
    <>
      <div className="p-10">
        <h2 className="text-2xl font-bold text-green-500">Congratulations</h2>
        <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
        {
          feedbackList?.length==0?<h2 className="font-bold text-xl text-gray-500">No Interview Record Found</h2>
          :
          <>
          
        
        <h2 className="text-lg my-3 text-blue-800">
          Your overall interview rating : <strong className={`${
                overallRating >= 5 ? "text-green-500" : "text-red-600"
              }`}
            >
              {overallRating}
              <span className="text-black">/10</span></strong>
        </h2>
        <h2 className="text-sm text-gray-500">
          Find below interview question with correct answer,Your answer and
          feedback for improvement
        </h2>
        {feedbackList &&
          feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="p-2 my-2 rounded-lg text-left bg-gray-100 w-full flex justify-between gap-7 items-center">
                {item?.question}
                <ChevronsUpDown className=" h-4 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2">
                  <h2 className="text-red-500 p-2 border rounded-lg">
                    <strong>Rating: </strong>
                    {item?.rating}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                    <strong>Your Answer: </strong>
                    {item?.userAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                    <strong>Correct Answer: </strong>
                    {item?.correctAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-900">
                    <strong>Feedback: </strong>
                    {item?.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
            </>
        }
          <Button className='bg-blue-900 hover:bg-blue-800' onClick={()=>router.replace('/dashboard')}>Go Home</Button>
      </div>
    </>
  );
};

export default Feedback;
