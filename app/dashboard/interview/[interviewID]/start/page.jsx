"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const StartInterview = () => {
    const [interviewData,setInterviewData] = useState();
    const [mockInterviewQuestion,setMockInterviewQuestion] = useState();
    const [activeQuestionIndex,setActiveQuestionIndex] = useState(0);
    const params = useParams();

    useEffect(()=>{
GetInterviewDetails();
    },[])



   
  // used to get interview details by mockID /interviewID in DB
  const GetInterviewDetails = async () => {
    const interviewID = params?.interviewID;

    if (!interviewID) {
      console.error("No interviewID found in params.");
      return;
    }

    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview?.mockId, interviewID));
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        console.log(jsonMockResp);
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
      
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };
  return (
   <>
   <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
    {/* Questions */}
    <QuestionSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}/>

    {/* Video/Audio Recording */}
    <RecordAnswerSection  mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData}/>

   </div>
   <div className='flex justify-end gap-6 '>
    {
      activeQuestionIndex>0&&
    <Button className='bg-blue-900 hover:bg-blue-800' onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Questions</Button>
    }
    {
      activeQuestionIndex!=mockInterviewQuestion?.length-1&&
    <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)} className='bg-blue-900 hover:bg-blue-800'>Next Questions</Button>
    }
    {
      activeQuestionIndex==mockInterviewQuestion?.length-1&&
      <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
    <Button className='bg-blue-900 hover:bg-blue-800'>End Interview</Button>
      </Link>
    }
   </div>
   </>
  )
}

export default StartInterview