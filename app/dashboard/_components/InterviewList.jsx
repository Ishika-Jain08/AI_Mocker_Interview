"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewCard from "./InterviewCard";

const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    user && GetInterviewList();
    
  }, []);
  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(MockInterview?.id));
    console.log(result);
    
    setInterviewList(result);
  };
  return (
    <>
      <div>
      
        <h2 className=" font-bold text-xl">Previous Mock Interview</h2>
        <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
          {interviewList &&
            interviewList.map((interview, index) => (
              <InterviewCard interview={interview} key={index} />
            ))}
            
        </div>
      </div>
    </>
  );
};

export default InterviewList;