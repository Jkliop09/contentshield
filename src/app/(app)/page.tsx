
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TextModerationForm } from "@/components/text-moderation-form";
import { ImageModerationForm } from "@/components/image-moderation-form";
import { ApiKeyGenerator } from "@/components/api-key-generator";
import { ScanText, ScanIcon, KeyRound } from "lucide-react"; 
import { Separator } from "@/components/ui/separator";

export default function ModerationPage() {
  return (
    <>
      <p className="text-muted-foreground mb-6 md:mb-8 text-base md:text-lg">
        Use the tools below to analyze text for hate speech and images for NSFW content.
        You can also generate an API key for programmatic access.
      </p>
      
      <div className="mb-8 md:mb-12">
        <ApiKeyGenerator />
      </div>

      <Separator className="my-8 md:my-12" />

      <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Moderation Tools</h2>
      <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <ScanText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Text Moderation</CardTitle>
                <CardDescription className="mt-1">
                  Analyze text for potential hate speech. (Uses Server Action)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TextModerationForm />
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
             <div className="flex items-center space-x-3">
              <ScanIcon className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Image Moderation</CardTitle>
                <CardDescription className="mt-1">
                  Analyze images for NSFW (Not Safe For Work) content. (Uses Server Action)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ImageModerationForm />
          </CardContent>
        </Card>
      </div>

      <footer className="mt-12 md:mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Content Guardian. All rights reserved.</p>
        <p className="mt-1">Powered by Next.js and Genkit AI.</p>
      </footer>
    </>
  );
}
