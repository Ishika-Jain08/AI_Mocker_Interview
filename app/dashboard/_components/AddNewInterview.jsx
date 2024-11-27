"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition,setJobPosition] = useState();
  const [jobDesc,setJobDesc] = useState();
  const [jobExperience,setJobExperience] = useState();
  const [loading,setLoading] = useState();
  const [jsonResponse,setJsonRespone] = useState([]);
  const {user}  = useUser();
  const router = useRouter();

  const onSubmit= async(e)=>{
    setLoading(true)
    e.preventDefault();
    console.log(jobPosition,jobDesc,jobExperience);

    // prompt hai jo google pe search hoga
    const InputPrompt = "Job position: "+jobPosition+",Job Description: "+jobDesc+",Years of Experience:"+jobExperience+",Depends on Job position,Job Description & Years of Experience give us "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT+" Interview question along with Answer in JSON format,Give us question and answer field on JSON";

    // result json me hai toh convert kra h object me
    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = (result.response.text()).replace("```json",'').replace('```','');
    // console.log(JSON.parse(MockJsonResp));
    // response store krva rhe h
    setJsonRespone(MockJsonResp);

    // db store data
    if(MockJsonResp){
        const res = await db.insert(MockInterview).values({
            mockId:uuidv4() ,
            jsonMockResp:MockJsonResp,
            jobPosition:jobPosition,
            jobDesc:jobDesc,
            jobExperience:jobExperience,
            createBy:user?.primaryEmailAddress?.emailAddress,
            createAt:moment().format('DD-MM-yyyy')
                }).returning({mockId:MockInterview.mockId});
                console.log('Inserted ID:',res);
                // data store ho gya toh interview vale page pe move kr do
                if(res){
                    setOpenDialog(false);
                    router.push('/dashboard/interview/'+res[0]?.mockId)
                }
    }else{
        console.log('ERROR');
        
    }
    

       
           
    //loading
    setLoading(false)
  }
  return (
    <>
      <div>
        <div
          className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
          onClick={() => setOpenDialog(true)}
        >
          <h2 className="font-bold text-lg text-center">+ Add New</h2>
        </div>
        <Dialog open={openDialog}>
          {/* <DialogTrigger>Open</DialogTrigger> */}
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Tell us more about your job interviewing
              </DialogTitle>
              <DialogDescription>
                <form onSubmit={onSubmit}>
                  <div>
                    <h2>
                      Add details about your job position/role,job description
                      and years of experience
                    </h2>

                    <div className="mt-7 my-3">
                      <label>Job Role/Job Position</label>
                      <Input
                        className="my-3"
                        placeholder="Ex. Full Stack Developer"
                        required
                        onChange={(event)=>setJobPosition(event.target.value)}
                      />
                    </div>
                    <div className="my-3">
                      <label>Job Description/Tech Stack(In Short)</label>
                      <Textarea
                        className="my-3"
                        placeholder="Ex. React,Angular,NodeJS ,MySQL etc.."
                        required
                        onChange={(event)=>setJobDesc(event.target.value)}
                      />
                    </div>
                    <div className=" my-3">
                      <label>Years of experience</label>
                      <Input
                        className="my-3"
                        placeholder="Ex. 5"
                        type="number"
                        max="50"
                        required
                        onChange={(event)=>setJobExperience(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-5 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpenDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {
                            loading ? <>
                            <LoaderCircle className=" animate-spin"/>'Generating from AI'
                            </>:'Start Interview'
                        }
                        </Button>
                  </div>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AddNewInterview;
