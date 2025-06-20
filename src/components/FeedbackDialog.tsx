import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star, Mic, MicOff, Send, CheckCircle } from "lucide-react";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId: string;
  complaintTitle: string;
  onSubmit: (feedback: { rating: number; comment: string }) => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
  complaintId,
  complaintTitle,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Voice input not supported in this browser");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setComment((prev) => prev + (prev ? " " : "") + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please provide a rating");
      return;
    }

    onSubmit({ rating, comment });
    setIsSubmitted(true);

    // Close dialog after 2 seconds
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setRating(0);
      setComment("");
    }, 2000);
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Very Poor";
      case 2:
        return "Poor";
      case 3:
        return "Average";
      case 4:
        return "Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return "text-red-500";
    if (rating === 3) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSubmitted ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                Feedback Submitted!
              </>
            ) : (
              <>
                <Star className="w-5 h-5 text-yellow-500" />
                Rate Your Experience
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isSubmitted
              ? "Thank you for your feedback! It helps us improve our services."
              : `How satisfied are you with the resolution of complaint ${complaintId}?`}
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Complaint Title */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Complaint:</p>
              <p className="font-medium text-gray-900">{complaintTitle}</p>
            </div>

            {/* Star Rating */}
            <div>
              <Label className="text-sm font-medium">
                Rating <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p
                  className={`text-sm mt-1 font-medium ${getRatingColor(rating)}`}
                >
                  {getRatingText(rating)}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <Label className="text-sm font-medium">
                Additional Comments (Optional)
              </Label>
              <div className="relative mt-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience or suggestions..."
                  rows={3}
                  className="pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={`absolute right-2 top-2 h-8 w-8 p-0 ${
                    isListening ? "text-red-500 animate-pulse" : "text-gray-500"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {isListening && (
                <p className="text-sm text-blue-600 mt-1 flex items-center">
                  <span className="animate-pulse">
                    🎙️ Listening... Speak now
                  </span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-green-800">
                Feedback Received!
              </p>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
              </div>
              {comment && (
                <div className="bg-gray-50 p-3 rounded-lg mt-3">
                  <p className="text-sm text-gray-700">"{comment}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
