
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Zap, ShieldCheck, DollarSign } from "lucide-react";

export default function OverviewPage() {
  // Mock data - in a real application, this would come from a backend
  const textUsage = { current: 125, limit: 1000, name: "Text Moderation API" };
  const imageUsage = { current: 50, limit: 500, name: "Image Moderation API" };
  
  const planDetails = {
    name: "Free Tier",
    description: "Ideal for personal projects and evaluation.",
    features: [
      `${textUsage.limit.toLocaleString()} text moderation requests/month`,
      `${imageUsage.limit.toLocaleString()} image moderation requests/month`,
      "Standard API access",
      "Community support",
    ],
    price: "$0/month",
    upgradeLink: "#", // Placeholder for actual upgrade link
  };

  const textUsagePercentage = (textUsage.current / textUsage.limit) * 100;
  const imageUsagePercentage = (imageUsage.current / imageUsage.limit) * 100;

  return (
    <div className="space-y-8">
      {/* API Usage Section */}
      <Card className="shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">API Usage Overview</CardTitle>
          </div>
          <CardDescription>
            Track your consumption of text and image moderation API calls for the current billing cycle.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Text Moderation Usage Card */}
          <Card className="bg-card/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">{textUsage.name}</CardTitle>
              <CardDescription>Requests made this cycle.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between items-baseline">
                <span className="text-3xl font-bold text-primary">{textUsage.current.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">/ {textUsage.limit.toLocaleString()}</span>
              </div>
              <Progress value={textUsagePercentage} className="h-3" aria-label={`${textUsage.name} usage: ${textUsagePercentage.toFixed(1)}%`} />
              <p className="mt-2 text-xs text-muted-foreground">
                {(textUsage.limit - textUsage.current).toLocaleString()} requests remaining.
              </p>
            </CardContent>
          </Card>

          {/* Image Moderation Usage Card */}
          <Card className="bg-card/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">{imageUsage.name}</CardTitle>
              <CardDescription>Requests made this cycle.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between items-baseline">
                <span className="text-3xl font-bold text-primary">{imageUsage.current.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">/ {imageUsage.limit.toLocaleString()}</span>
              </div>
              <Progress value={imageUsagePercentage} className="h-3" aria-label={`${imageUsage.name} usage: ${imageUsagePercentage.toFixed(1)}%`} />
               <p className="mt-2 text-xs text-muted-foreground">
                {(imageUsage.limit - imageUsage.current).toLocaleString()} requests remaining.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Current Plan Section */}
      <Card className="shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Zap className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">Current Subscription Plan</CardTitle>
          </div>
          <CardDescription>
            Details about your active plan and its benefits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-primary/5">
            <div>
              <h3 className="text-xl font-semibold text-primary">{planDetails.name}</h3>
              <p className="text-sm text-muted-foreground">{planDetails.description}</p>
            </div>
            <Badge variant="outline" className="mt-2 sm:mt-0 text-primary border-primary text-base py-1 px-3">{planDetails.price}</Badge>
          </div>
          
          <div className="p-4 border rounded-md bg-card/50">
            <h4 className="font-semibold mb-3 text-lg">What&apos;s Included:</h4>
            <ul className="space-y-2 text-muted-foreground">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <ShieldCheck className="h-5 w-5 mr-2.5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
             <p className="text-sm text-muted-foreground text-center sm:text-left">
                Need more capacity or access to premium features?
              </p>
            <Button variant="default" size="lg" className="w-full sm:w-auto">
              <DollarSign className="mr-2 h-5 w-5" />
              Upgrade Your Plan
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <footer className="mt-12 md:mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>Usage data shown is for illustrative purposes. Billing cycle resets on the 1st of each month (mock data).</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Content Guardian. All rights reserved.</p>
      </footer>
    </div>
  );
}
