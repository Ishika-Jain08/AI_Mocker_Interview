"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

const Interview = () => {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const params = useParams();

  useEffect(() => {
    console.log(params.interviewID);
    GetInterviewDetails();
  }, []);

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

     

        setInterviewData(result[0]);
      
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
    
  };
  return (
    <>
      <div className="my-10 ">
        <h2 className="font-bold text-2xl"> Let's Get Started</h2>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10"> 
        <div className=" flex flex-col my-5 gap-5">
            <div className=" flex flex-col  p-5 rounded-lg border gap-5">
                {/* job Information */}
            <h2>
            <strong>Job Role/Job Position: </strong>
           <span className=" text-blue-700  font-medium"> {interviewData?.jobPosition}</span>
           
          </h2>
          <h2>
            <strong>Job Description/Tech Stack:  </strong>
            <span className=" text-blue-700  font-medium"> {interviewData?.jobDesc}</span>
            
          </h2>
          <h2>
            <strong>Years of Experiences: </strong>
            <span className=" text-blue-700  font-medium">{interviewData?.jobExperience}</span>
            
          </h2>
            </div>
            <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
                <h2 className=" flex gap-2 items-center text-yellow-600">  <Lightbulb/><strong>Information</strong></h2>
                <h2 className="mt-3 text-yellow-600">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
              
            </div>
         
        </div>

        <div>
              {/* user camera access */}
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              {" "}
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button variant="ghost" onClick={() => setWebCamEnabled(true)} className="w-full" >
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
        </div>
       <div className="flex justify-end items-end">
        <Link href={'/dashboard/interview/'+params.interviewID+'/start'}>
        <Button className='bg-blue-300 text-black hover:bg-blue-400 font-medium'>Start Interview</Button>
        </Link>
       
       </div>
       
      </div>
    </>
  );
};

export default Interview;