"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/GeminiAIModel";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { Mic, StopCircle } from "lucide-react";
import moment from "moment/moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";

const RecordAnswerSection = ({ mockInterviewQuestion, activeQuestionIndex ,interviewData}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const {user} = useUser();
  const [loading,setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  //user ans store in results
  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  //user update ans
  useEffect(()=>{
if (!isRecording&&userAnswer.length>10) {
  UpdateUserAnswerInDB();
}
  },[userAnswer])

  //   user save Answer
  const StartStopRecording = async () => {
    if (isRecording) {
      
      stopSpeechToText();
          
    }
    else {
      startSpeechToText();
  }
}

  const UpdateUserAnswerInDB=async()=>{
 // feedback 
 const feedbackPrompt = "Questions: " +mockInterviewQuestion[activeQuestionIndex]?.question+", User Answer: " +userAnswer+", Depends on question and user answer for give interview question"+"please give us rating for answer and feedback as area of improvement if any"+"in just 3 to 5 lines to improve it in JSON format with rating field and feedback field  "

 const result = await chatSession.sendMessage(feedbackPrompt);
 const mockJsonResp =  (result.response.text()).replace("```json",'').replace('```','');
 console.log(mockJsonResp);
 const JsonFeedback = JSON.parse(mockJsonResp);
 //user response store in DB
 const resp = await db.insert(UserAnswer).values({
   mockIdRef:interviewData?.mockId,
   question:mockInterviewQuestion[activeQuestionIndex]?.question,
   correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
   userAns:userAnswer,
   feedback:JsonFeedback?.feedback,
   rating:JsonFeedback?.rating,
   userEmail:user?.primaryEmailAddress?.emailAddress,
   createAt:moment().format('DD-MM-yyyy')
 })
 if(resp){
   toast('User Answer recorded successfully!' );
   setUserAnswer('');
   setResults([]);
 }
 setResults([]);
 setLoading(false)
} 

  return (
    <>
      {/* camera access */}
      <div className="flex items-center justify-center flex-col">
        <div className=" flex flex-col justify-center items-center  rounded-lg p-5 mt-10 bg-black">
          <Image
            src={"/webcam.png"}
            width={200}
            height={200}
            className=" absolute"
            alt="img"
          />
          <Webcam
            mirrored={true}
            style={{
              height: 300,
              width: "100%",
              zIndex: 10,
            }}
          />
        </div>
        {/* record Answer */}
        <Button variant="outline" className="my-10" onClick={StartStopRecording}>
          {isRecording ? (
            <h2 className="text-red-600 flex gap-2 items-center animate-pulse">
              <StopCircle />' Stop Recording'
            </h2>
          ) : (
          <h2 className="text-blue-600 flex gap-2 items-center"> <Mic/> Record Answer</h2>
          )}
        </Button>



        {/* user Answer Show */}
        {/* <Button
          className="bg-blue-900 hover:bg-blue-800"
          onClick={() => console.log(userAnswer)}
        >
          Show User Answer
        </Button> */}
      </div>
    </>
  );
};

export default RecordAnswerSection;
