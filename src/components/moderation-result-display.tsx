import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface ModerationResultDisplayProps {
  isHarmful: boolean;
  confidence?: number;
  message: string;
  type: "text" | "image";
}

export function ModerationResultDisplay({ isHarmful, confidence, message, type }: ModerationResultDisplayProps) {
  const Icon = isHarmful ? ShieldAlert : ShieldCheck;
  const title = isHarmful 
    ? (type === "text" ? "Potentially Harmful Text Detected" : "Potentially NSFW Image Detected") 
    : (type === "text" ? "Text Appears Safe" : "Image Appears Safe");
  
  const alertVariant = isHarmful ? "destructive" : "default";
  // For "safe" results, use accent color for border and icon
  const safeResultClassName = !isHarmful ? "border-green-500 text-green-700 [&>svg]:text-green-500 dark:border-green-400 dark:text-green-300 dark:[&>svg]:text-green-400" : "";


  return (
    <Alert variant={alertVariant} className={safeResultClassName}>
      <Icon className="h-5 w-5" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
        {confidence !== undefined && (
          <span className="mt-1 block text-sm font-medium">
            Confidence: {(confidence * 100).toFixed(1)}%
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
}
