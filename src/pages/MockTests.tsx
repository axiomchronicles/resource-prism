import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Award,
  BarChart3,
  BookOpen,
  Timer,
  Target,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
  topic: string;
}

interface MockTest {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
  difficulty: "easy" | "medium" | "hard";
  topics: string[];
  description: string;
  attempts: number;
  averageScore: number;
  questions: Question[];
}

const mockTests: MockTest[] = [
  {
    id: "1",
    title: "Data Structures & Algorithms Fundamentals",
    subject: "Computer Science",
    duration: 60,
    totalQuestions: 25,
    difficulty: "medium",
    topics: ["Arrays", "Linked Lists", "Trees", "Sorting", "Searching"],
    description: "Test your understanding of basic data structures and algorithms",
    attempts: 1247,
    averageScore: 72,
    questions: [
      {
        id: "q1",
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
        explanation: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
        difficulty: "easy",
        subject: "Computer Science",
        topic: "Searching"
      },
      {
        id: "q2",
        question: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
        explanation: "Stack follows LIFO principle where the last element added is the first one to be removed.",
        difficulty: "easy",
        subject: "Computer Science",
        topic: "Data Structures"
      }
    ]
  },
  {
    id: "2",
    title: "Object-Oriented Programming Concepts",
    subject: "Computer Science",
    duration: 45,
    totalQuestions: 20,
    difficulty: "easy",
    topics: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
    description: "Master the core concepts of object-oriented programming",
    attempts: 892,
    averageScore: 78,
    questions: []
  },
  {
    id: "3",
    title: "Advanced Database Systems",
    subject: "Computer Science",
    duration: 90,
    totalQuestions: 35,
    difficulty: "hard",
    topics: ["SQL", "Normalization", "Indexing", "Transactions", "Optimization"],
    description: "Comprehensive test on database design and optimization",
    attempts: 567,
    averageScore: 65,
    questions: []
  }
];

export default function MockTests() {
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = (test: MockTest) => {
    setSelectedTest(test);
    setIsTestActive(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(test.duration * 60);
    setIsTimerRunning(true);
    setShowResults(false);
    toast({
      title: "Test Started!",
      description: `Good luck with ${test.title}`,
    });
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (selectedTest && currentQuestionIndex < selectedTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    if (!selectedTest) return;

    setIsTimerRunning(false);
    
    const correctAnswers = selectedTest.questions.filter(
      question => answers[question.id] === question.correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / selectedTest.questions.length) * 100);
    
    setTestResults({
      score,
      correctAnswers,
      totalQuestions: selectedTest.questions.length,
      timeTaken: selectedTest.duration * 60 - timeRemaining,
      breakdown: selectedTest.questions.map(question => ({
        question: question.question,
        userAnswer: answers[question.id],
        correctAnswer: question.correctAnswer,
        isCorrect: answers[question.id] === question.correctAnswer,
        explanation: question.explanation
      }))
    });
    
    setShowResults(true);
    setIsTestActive(false);
    
    toast({
      title: "Test Completed!",
      description: `You scored ${score}% (${correctAnswers}/${selectedTest.questions.length})`,
    });
  };

  const resetTest = () => {
    setSelectedTest(null);
    setIsTestActive(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(0);
    setIsTimerRunning(false);
    setShowResults(false);
    setTestResults(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "hard": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (showResults && testResults) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Test Completed!</h1>
            <p className="text-xl text-muted-foreground">
              Here are your results for {selectedTest?.title}
            </p>
          </motion.div>

          {/* Score Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-white/20 p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {testResults.score}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {testResults.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-muted-foreground mb-2">
                    {testResults.totalQuestions}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {formatTime(testResults.timeTaken)}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Detailed Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-white/20 p-6">
              <h3 className="text-xl font-bold mb-6">Detailed Breakdown</h3>
              <div className="space-y-6">
                {testResults.breakdown.map((item: any, index: number) => (
                  <div key={index} className="border-l-4 border-l-primary/20 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{item.question}</h4>
                      {item.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 ml-2" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 ml-2" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className={item.isCorrect ? "text-green-500" : "text-red-500"}>
                        Your answer: {selectedTest?.questions[index]?.options[item.userAnswer] || "Not answered"}
                      </span>
                      {!item.isCorrect && (
                        <div className="text-green-500 mt-1">
                          Correct answer: {selectedTest?.questions[index]?.options[item.correctAnswer]}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 justify-center mt-8"
          >
            <Button onClick={() => startTest(selectedTest!)} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Test
            </Button>
            <Button variant="outline" onClick={resetTest} size="lg">
              <ArrowRight className="w-4 h-4 mr-2" />
              Browse Tests
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isTestActive && selectedTest) {
    const currentQuestion = selectedTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedTest.questions.length) * 100;

    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Test Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="glass border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{selectedTest.title}</h1>
                  <p className="text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {selectedTest.questions.length}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-lg font-mono">
                    <Timer className="w-5 h-5 text-primary" />
                    <span className={timeRemaining < 300 ? "text-red-500" : ""}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSubmitTest}>
                    Submit Test
                  </Button>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </Card>
          </motion.div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass border-white/20 p-8 mb-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getDifficultyBadge(currentQuestion.difficulty)}>
                      {currentQuestion.difficulty}
                    </Badge>
                    <Badge variant="outline">{currentQuestion.topic}</Badge>
                  </div>
                  <h2 className="text-xl font-bold leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                        answers[currentQuestion.id] === index
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/20 hover:border-white/40 bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          answers[currentQuestion.id] === index
                            ? "border-primary bg-primary text-white"
                            : "border-muted-foreground"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {selectedTest.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                    index === currentQuestionIndex
                      ? "bg-primary text-white"
                      : answers[selectedTest.questions[index].id] !== undefined
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === selectedTest.questions.length - 1 ? (
              <Button onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700">
                Submit Test
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
            <Target className="w-10 h-10 text-primary" />
            Mock Tests
          </h1>
          <p className="text-xl text-muted-foreground">
            Practice with comprehensive mock tests to ace your exams
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: "Tests Available", value: "25+", icon: BookOpen, color: "text-blue-500" },
            { label: "Total Attempts", value: "2.8K", icon: TrendingUp, color: "text-green-500" },
            { label: "Average Score", value: "74%", icon: BarChart3, color: "text-purple-500" },
            { label: "Success Rate", value: "89%", icon: Award, color: "text-yellow-500" }
          ].map((stat, index) => (
            <Card key={stat.label} className="glass border-white/20 p-6 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Mock Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="glass border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-medium h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg leading-tight">{test.title}</h3>
                      <Badge className={getDifficultyBadge(test.difficulty)}>
                        {test.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {test.description}
                    </p>
                    <Badge variant="secondary">{test.subject}</Badge>
                  </div>

                  {/* Test Info */}
                  <div className="space-y-3 mb-4 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Duration
                      </span>
                      <span className="font-medium">{test.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        Questions
                      </span>
                      <span className="font-medium">{test.totalQuestions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        Avg. Score
                      </span>
                      <span className="font-medium">{test.averageScore}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        Attempts
                      </span>
                      <span className="font-medium">{test.attempts.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Topics Covered</h4>
                    <div className="flex flex-wrap gap-1">
                      {test.topics.slice(0, 3).map(topic => (
                        <span key={topic} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                          {topic}
                        </span>
                      ))}
                      {test.topics.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-xs rounded-md">
                          +{test.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Button 
                    className="w-full"
                    onClick={() => startTest(test)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Test
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}