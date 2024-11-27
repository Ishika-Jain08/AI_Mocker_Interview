import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const InterviewCard = ({interview}) => {

    const router = useRouter();

    const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId)
    };
    const onFeedbackPress=()=>{
        router.push('/dashboard/interview/'+interview?.mockId+'/feedback')
    }
  return (
    <>
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-blue-800'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-600'>{interview?.jobExperience}</h2>
        <h2 className='text-xs text-gray-400'>Created At:{interview?.createdAt}</h2>


        <div className=' flex justify-between mt-2 gap-5'>
            
            <Button onClick={onFeedbackPress} size='sm' variant='outline' className='w-full font-medium hover:bg-blue-200 border-blue-200'>Feedback</Button>
            <Button onClick={onStart} size='sm' variant='outline'  className='w-full  bg-blue-200  hover:bg-blue-300'>Start</Button>
        </div>

    </div>
    </>
  )
}

export default InterviewCard