import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  FileText,
  MapPin,
  Clock,
  Users,
  ShoppingBasket,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const FarmersMarketAgent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "agent",
      content:
        "Hello! I'm your AI assistant for the City of Lincoln Farmers Market Permit Application. I'll help you complete Form HF61 step by step. This permit costs $100 and is processed by the Lincoln-Lancaster County Health Department. Ready to get started?",
      timestamp: new Date(),
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const permitSchema = {
    process_name: "Farmers Market Permit Application",
    description:
      "Application for a permit to operate a farmers market in Lincoln-Lancaster County.",
    form_id: "HF61",
    contact_info: {
      department: "Lincoln-Lancaster County Health Department",
      address: "3131 O Street, Lincoln, NE 68510",
      phone: "(402) 441-6280",
      email: "foodsafety@lincoln.ne.gov",
    },
    permit_details: {
      fee: 100.0,
      payment_note:
        "When you provide a check as payment, you authorize us to use the information from your check to make a one-time electronic fund transfer from your account or to process the payment as a check transaction. Funds may be withdrawn as soon as the same day you make your payment, and you will not receive your check back.",
    },
    steps: [
      {
        step_number: 1,
        topic: "Permit Type",
        prompt: "First, is this a new application, a renewal, or an addition?",
        options: ["New", "Renewal", "Addition"],
        required: true,
        icon: FileText,
      },
      {
        step_number: 2,
        topic: "Market Information",
        prompt: "What is the name of your market and its location?",
        fields: ["Market Name", "Market Location"],
        required: true,
        icon: MapPin,
      },
      {
        step_number: 3,
        topic: "Operating Dates and Times",
        prompt:
          "Please provide the day(s) and time of operation, along with the season's opening and ending dates.",
        fields: [
          "Day(s)",
          "Time (from)",
          "Time (to)",
          "Season Opening Date",
          "Ending Date",
        ],
        required: true,
        icon: Clock,
      },
      {
        step_number: 4,
        topic: "Organization Contact",
        prompt:
          "Who is the contact person for the organization, and what is their address, phone number, and email address?",
        fields: [
          "Organization",
          "Contact Name",
          "Contact Address",
          "Contact Phone",
          "Email Address",
        ],
        required: true,
        icon: Users,
      },
      {
        step_number: 5,
        topic: "Vendor Information",
        prompt:
          "Please provide a list of vendors selling home-prepared food or drink. For each vendor, I'll need their name, the food products they sell, and if they have approved training.",
        fields: [
          "Vendor Name",
          "Food Products Sold",
          "Approved Training If Applicable",
        ],
        multiple_entries: true,
        required: true,
        icon: ShoppingBasket,
      },
    ],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content, type = "user") => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const processUserInput = async (input) => {
    setIsProcessing(true);

    // Add user message
    addMessage(input, "user");

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (currentStep === 0) {
      // Initial greeting response
      const step1 = permitSchema.steps[0];
      const Icon = step1.icon;
      addMessage(
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <Icon size={20} />
            <span className="font-semibold">Step 1: {step1.topic}</span>
          </div>
          <p>{step1.prompt}</p>
          <div className="flex flex-wrap gap-2">
            {step1.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>,
        "agent"
      );
      setCurrentStep(1);
    } else if (currentStep <= permitSchema.steps.length) {
      // Store the response
      const currentStepData = permitSchema.steps[currentStep - 1];

      if (currentStepData.options) {
        // Handle option selection
        setFormData((prev) => ({
          ...prev,
          [currentStepData.topic]: input,
        }));
      } else {
        // Handle field inputs
        setFormData((prev) => ({
          ...prev,
          [currentStepData.topic]: input,
        }));
      }

      // Move to next step or complete
      if (currentStep < permitSchema.steps.length) {
        const nextStep = permitSchema.steps[currentStep];
        const Icon = nextStep.icon;

        addMessage(
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle size={16} />
              <span className="text-sm">Step {currentStep} completed!</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <Icon size={20} />
              <span className="font-semibold">
                Step {nextStep.step_number}: {nextStep.topic}
              </span>
            </div>
            <p>{nextStep.prompt}</p>
            {nextStep.fields && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <strong>Please provide:</strong>
                <ul className="list-disc list-inside mt-1">
                  {nextStep.fields.map((field, idx) => (
                    <li key={idx}>{field}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>,
          "agent"
        );
        setCurrentStep(currentStep + 1);
      } else {
        // Application complete
        addMessage(
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle size={20} />
              <span className="font-semibold">Application Complete!</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="mb-3">
                Congratulations! Your Farmers Market Permit application has been
                completed. Here's what happens next:
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Processing Fee:</strong> $100.00
                </p>
                <p>
                  <strong>Review Time:</strong> Typically 5-10 business days
                </p>
                <p>
                  <strong>Contact for Questions:</strong>
                </p>
                <div className="ml-4 text-gray-700">
                  <p>Lincoln-Lancaster County Health Department</p>
                  <p>3131 O Street, Lincoln, NE 68510</p>
                  <p>Phone: (402) 441-6280</p>
                  <p>Email: foodsafety@lincoln.ne.gov</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You will receive confirmation via email once your application is
              reviewed and approved.
            </p>
          </div>,
          "agent"
        );
        setCurrentStep(permitSchema.steps.length + 1);
      }
    } else {
      // Post-completion responses
      addMessage(
        "Your application has already been submitted! If you need to make changes or have questions, please contact the Lincoln-Lancaster County Health Department at (402) 441-6280 or foodsafety@lincoln.ne.gov.",
        "agent"
      );
    }

    setIsProcessing(false);
  };

  const handleOptionSelect = (option) => {
    setInputValue(option);
    const value = option;
    setInputValue("");
    processUserInput(value);
  };

  const handleSubmit = async () => {
    const value = inputValue.trim();
    if (!value || isProcessing) return;

    setInputValue("");
    await processUserInput(value);
  };

  const getProgressPercentage = () => {
    if (currentStep === 0) return 0;
    if (currentStep > permitSchema.steps.length) return 100;
    return (currentStep / permitSchema.steps.length) * 100;
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">City of Lincoln</h1>
            <p className="text-blue-100 text-sm">
              Farmers Market Permit Assistant
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-blue-100 mb-2">
            <span>Application Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-blue-500 bg-opacity-50 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-3xl rounded-2xl px-4 py-3 ${
                message.type === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white text-gray-800 shadow-sm border rounded-bl-sm"
              }`}
            >
              <div className="text-sm">{message.content}</div>
              <div
                className={`text-xs mt-2 ${
                  message.type === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border rounded-bl-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">Processing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              currentStep <= permitSchema.steps.length
                ? "Type your response..."
                : "Application completed. Type any questions..."
            }
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isProcessing}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isProcessing}
            className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>

        <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
          <AlertCircle size={12} className="mr-1" />
          All information will be reviewed by the Lincoln-Lancaster County
          Health Department
        </div>
      </div>
    </div>
  );
};

export default FarmersMarketAgent;
