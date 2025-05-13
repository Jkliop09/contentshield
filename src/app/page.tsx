import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TextModerationForm } from "@/components/text-moderation-form";
import { ImageModerationForm } from "@/components/image-moderation-form";
import { ScanText, ScanIcon } from "lucide-react"; 

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen p-4 py-8 sm:p-8 selection:bg-primary/20 selection:text-primary">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Content Guardian
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          AI-powered content moderation. Analyze text and images with ease.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <ScanText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Text Moderation</CardTitle>
                <CardDescription className="mt-1">
                  Analyze text for potential hate speech.
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
                  Analyze images for NSFW (Not Safe For Work) content.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ImageModerationForm />
          </CardContent>
        </Card>
      </div>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Content Guardian. All rights reserved.</p>
        <p className="mt-1">Powered by Next.js and Genkit AI.</p>
      </footer>
    </main>
  );
}

