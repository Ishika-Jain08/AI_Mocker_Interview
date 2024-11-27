import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
    // text to speech
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry ,Your browser does not support text to speech");
    }
  };
  return (
    <>
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-5   lg:grid-cols-4 gap-5">
          {mockInterviewQuestion &&
            mockInterviewQuestion.map((question, index) => (
              // question number display
              <h2
                key={index}
                className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
                  activeQuestionIndex === index ? " bg-blue-800 text-blue-100" : 'bg-secondary'
                }`}
              >
                Questions #{index + 1}
              </h2>
            ))}
        </div>
        {/* question display */}
        {Array.isArray(mockInterviewQuestion) &&
        mockInterviewQuestion[activeQuestionIndex] &&
        activeQuestionIndex >= 0 &&
        activeQuestionIndex < mockInterviewQuestion.length ? (
          <>
            <h2 className=" my-7 text-md md:text-lg">
              {mockInterviewQuestion[activeQuestionIndex]?.question}
            </h2>
            {/* speak to our question */}
            <Volume2
              className=" cursor-pointer"
              onClick={() =>
                textToSpeech(
                  mockInterviewQuestion[activeQuestionIndex]?.question
                )
              }
            />
          </>
        ) : (
          <p>No question selected.</p>
        )}

        <div className="border rounded-lg p-5 bg-blue-100 my-7">
          <h2 className=" flex gap-2 items-center text-blue-600">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-blue-600 my-2">
            {process.env.NEXT_PUBLIC_NOTE}
          </h2>
        </div>
      </div>
    </>
  );
};

export default QuestionSection;
