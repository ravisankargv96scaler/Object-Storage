import React, { useState } from 'react';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "In object storage, are folders real nested directories?",
    options: [
      "Yes, exactly like Windows/Linux file systems.",
      "No, it's a flat namespace where '/' is just part of the file name.",
      "Yes, but only if you use the API to create them.",
      "It depends on the cloud provider."
    ],
    correctAnswer: 1,
    explanation: "Object storage uses a flat structure. We use prefixes like 'photos/2023/' to simulate folders for humans, but technicaly 'photos/2023/image.jpg' is just one long key string."
  },
  {
    id: 2,
    question: "How do applications primarily interact with object storage?",
    options: [
      "By mounting it as a network drive (NFS/SMB).",
      "Using SQL queries.",
      "Via RESTful HTTP API calls (PUT, GET, DELETE).",
      "Through a USB connection."
    ],
    correctAnswer: 2,
    explanation: "Object storage is designed for the web. Applications use standard HTTP methods to interact with objects over the internet."
  },
  {
    id: 3,
    question: "What feature allows attaching custom labels like 'project-id' directly to a file?",
    options: [
      "File Extensions",
      "Metadata / Tags",
      "Renaming the file",
      "Block ID"
    ],
    correctAnswer: 1,
    explanation: "Metadata allows you to attach custom key-value pairs to any object, making it easy to categorize and search data without using folders."
  }
];

const SummaryQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === QUESTIONS[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-4">
          <Award size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Quiz Completed!</h2>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          You scored <span className="font-bold text-cloud-600">{score}</span> out of <span className="font-bold">{QUESTIONS.length}</span>
        </p>
        <button 
          onClick={resetQuiz}
          className="flex items-center gap-2 px-6 py-3 bg-cloud-600 hover:bg-cloud-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          <RotateCcw size={20} />
          Try Again
        </button>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];

  return (
    <div className="h-full flex flex-col space-y-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Knowledge Check</h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-cloud-500 h-full transition-all duration-300"
            style={{ width: `${((currentQuestion) / QUESTIONS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 leading-relaxed">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === question.correctAnswer;
              
              let baseClasses = "w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ";
              
              if (isAnswered) {
                if (isCorrect) baseClasses += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 ";
                else if (isSelected) baseClasses += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 ";
                else baseClasses += "border-slate-200 dark:border-slate-700 opacity-50 ";
              } else {
                baseClasses += "border-slate-200 dark:border-slate-700 hover:border-cloud-400 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-200 ";
              }

              return (
                <button 
                  key={index} 
                  onClick={() => handleOptionClick(index)}
                  disabled={isAnswered}
                  className={baseClasses}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle size={20} className="text-green-500" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-sm text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-top-2">
              <span className="font-bold">Explanation:</span> {question.explanation}
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 flex justify-end">
          <button 
            onClick={nextQuestion}
            disabled={!isAnswered}
            className="px-6 py-2 bg-cloud-600 hover:bg-cloud-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-semibold transition-colors"
          >
            {currentQuestion === QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryQuiz;