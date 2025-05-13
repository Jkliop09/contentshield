

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, BookOpenCheck, KeyRound, TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
  const textApiCurl = `curl -X POST \\
  https://contentshield.vercel.app/api/moderate-text \\
  -H 'Content-Type: application/json' \\
  -H 'X-API-Key: YOUR_GENERATED_API_KEY' \\
  -d '{
    "text": "This is some example text to check for hate speech."
  }'`;

  const textApiSuccessHate = `{
  "isHateSpeech": true,
  "confidenceScore": 0.987654321
}`;
  const textApiSuccessSafe = `{
  "isHateSpeech": false,
  "confidenceScore": 0.123456789
}`;
 const textApiError400 = `{
  "error": "Text cannot be empty."
}`;
 const textApiError401 = `{
  "error": "Unauthorized: Invalid or missing API Key."
}`;
 const textApiError500 = `{
  "error": "An unknown error occurred during text moderation."
}`;

  const imageApiCurl = `curl -X POST \\
  https://contentshield.vercel.app/api/moderate-image \\
  -H 'Content-Type: application/json' \\
  -H 'X-API-Key: YOUR_GENERATED_API_KEY' \\
  -d '{
    "imageDataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
  }'`;
  
  const imageApiSuccessNsfw = `{
  "isNsfw": true,
  "confidence": 0.951234567
}`;
  const imageApiSuccessSafe = `{
  "isNsfw": false,
  "confidence": 0.0567890123
}`;
  const imageApiError400 = `{
  "error": "imageDataUri cannot be empty."
}`;
  const imageApiError401 = `{
  "error": "Unauthorized: Invalid or missing API Key."
}`;
  const imageApiError500 = `{
  "error": "An unknown error occurred during image moderation."
}`;

  const fileToDataUriCode = `async function fileToDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result); // This is the data URI
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Example usage:
// const imageFile = /* get your file object from an input element */;
// const dataUri = await fileToDataUri(imageFile);
// console.log(dataUri);`;

const sdkTextExample = `
import { ContentGuardianSDK } from '@/lib/content-guardian-sdk';

// Initialize SDK with your API key
const apiKey = "YOUR_GENERATED_API_KEY"; // Replace with your actual key
const sdk = new ContentGuardianSDK('https://contentshield.vercel.app/', apiKey); 

// Or, if calling from the same origin (e.g., if API is hosted with this app):
// const sdk = new ContentGuardianSDK('', apiKey); 

async function checkText(textToCheck) {
  try {
    const result = await sdk.moderateText(textToCheck);
    console.log('Text moderation result:', result);
    // result.isHateSpeech (boolean)
    // result.confidenceScore (number)
    if (result.isHateSpeech) {
      alert("Hate speech detected with confidence: " + (result.confidenceScore * 100).toFixed(1) + "%");
    } else {
      alert("Text appears safe. Confidence: " + (result.confidenceScore * 100).toFixed(1) + "%");
    }
  } catch (error) {
    console.error('Error moderating text:', error.message);
    alert("Error: " + error.message);
  }
}

// Example calls
// checkText("This is an example of potentially problematic text.");
// checkText("Everything seems fine here.");
`;

const sdkImageExample = `
import { ContentGuardianSDK } from '@/lib/content-guardian-sdk';

const apiKey = "YOUR_GENERATED_API_KEY"; // Replace with your actual key
const sdk = new ContentGuardianSDK('https://contentshield.vercel.app/', apiKey);

// Helper function (as shown in cURL section or your own implementation)
async function fileToDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function checkImage(imageFile) {
  if (!imageFile) {
    console.error("No image file selected.");
    alert("Please select an image file first.");
    return;
  }

  try {
    const imageDataUri = await fileToDataUri(imageFile);
    const result = await sdk.moderateImage(imageDataUri);
    console.log('Image moderation result:', result);
    // result.isNsfw (boolean)
    // result.confidence (number)
    if (result.isNsfw) {
      alert("NSFW content detected with confidence: " + (result.confidence * 100).toFixed(1) + "%");
    } else {
      alert("Image appears safe. Confidence: " + (result.confidence * 100).toFixed(1) + "%");
    }
  } catch (error) {
    console.error('Error moderating image:', error.message);
    alert("Error: " + error.message);
  }
}

// To use this:
// 1. Have an <input type="file" id="imageUpload" accept="image/*" /> in your HTML.
// 2. Attach an event listener:
//    document.getElementById('imageUpload').addEventListener('change', (event) => {
//      const file = event.target.files[0];
//      if (file) {
//        checkImage(file);
//      }
//    });
`;


  return (
    <div className="space-y-8">
      <Alert>
        <KeyRound className="h-4 w-4" />
        <AlertTitle>API Authentication Required</AlertTitle>
        <AlertDescription>
          All API requests require an <code>X-API-Key</code> header for authentication.
          You can generate an API key from the <Link href="/" className="font-medium text-primary hover:underline">Moderation Tools page</Link>.
          The API is hosted at <code>https://contentshield.vercel.app/</code>.
          API responses might take a few seconds due to AI model processing.
        </AlertDescription>
      </Alert>

      {/* SDK Section */}
      <Card className="shadow-lg border-primary border-2">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BookOpenCheck className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">Using the SDK (JavaScript/TypeScript)</CardTitle>
          </div>
          <CardDescription>
            For easier integration into your JavaScript/TypeScript applications, use the Content Guardian SDK.
            It simplifies API calls, authentication, and error handling.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div>
            <h3 className="font-semibold text-lg mb-1">1. Obtain an API Key</h3>
            <p className="mb-2">
              Navigate to the <Link href="/" className="font-medium text-primary hover:underline">Moderation Tools page</Link> and use the API Key Generator to create a new key.
              Copy this key and store it securely, as it will only be shown once.
            </p>
            <Alert variant="default" className="border-accent">
                <TriangleAlert className="h-4 w-4 text-accent"/>
                <AlertTitle>Secure Your API Key</AlertTitle>
                <AlertDescription>
                Treat your API key like a password. Do not embed it directly in client-side code that might be publicly accessible.
                For frontend applications, consider using a backend proxy or serverless function to make API calls with the key.
                </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">2. Setup</h3>
            <p className="mb-2">
              The SDK is located at <code>src/lib/content-guardian-sdk.ts</code>.
              If you are developing within this Next.js application (e.g., for client-side components), you can import it directly:
            </p>
            <CodeBlock title="Importing the SDK">{`import { ContentGuardianSDK } from '@/lib/content-guardian-sdk';`}</CodeBlock>
            <p className="mt-2 text-sm text-muted-foreground">
              If this SDK were published as an NPM package (e.g., <code>content-guardian-sdk</code>), you would install it
              (<code>npm install content-guardian-sdk</code>) and import it like so:
              <code>import {'{ ContentGuardianSDK }'} from 'content-guardian-sdk';</code>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">3. Initialization</h3>
            <p className="mb-2">Create an instance of the SDK, providing your API key. By default, it points to <code>https://contentshield.vercel.app/</code>.</p>
            <CodeBlock title="JavaScript/TypeScript">{`// Default initialization (points to the deployed API)
const apiKey = "YOUR_GENERATED_API_KEY"; // Replace with your key
const sdk = new ContentGuardianSDK('https://contentshield.vercel.app/', apiKey); 

// For same-origin API calls (if your frontend and API are on the same domain)
// const sdk = new ContentGuardianSDK('', apiKey); 

// To specify a different API server:
// const sdk = new ContentGuardianSDK('https://your-custom-api-server.example.com', apiKey);`}</CodeBlock>
          </div>

          <Card className="pt-4 bg-card/50 shadow-sm">
            <CardHeader className="pt-0">
                <CardTitle className="text-xl">SDK: Text Moderation</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-2">Use the <code>moderateText</code> method to analyze text. It accepts a string and returns a Promise with the moderation result.</p>
                <CodeBlock title="JavaScript/TypeScript Example">{sdkTextExample}</CodeBlock>
            </CardContent>
          </Card>
          
          <Card className="pt-4 bg-card/50 shadow-sm">
            <CardHeader className="pt-0">
                <CardTitle className="text-xl">SDK: Image Moderation</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-2">Use the <code>moderateImage</code> method to analyze an image. It accepts an image data URI and returns a Promise with the moderation result.</p>
                <h4 className="font-semibold text-md my-2">Helper: Converting File to Data URI</h4>
                <p className="text-sm mb-1">You&apos;ll first need to convert your image file (e.g., from an <code>&lt;input type=&quot;file&quot; /&gt;</code> element) to a Base64 data URI. Here&apos;s the helper function:</p>
                <CodeBlock title="JavaScript (fileToDataUri function)">{fileToDataUriCode}</CodeBlock>
                <h4 className="font-semibold text-md mt-4 mb-2">SDK Usage Example</h4>
                <CodeBlock title="JavaScript/TypeScript Example">{sdkImageExample}</CodeBlock>
            </CardContent>
          </Card>

          <div>
            <h3 className="font-semibold text-lg mb-1">4. Error Handling</h3>
            <p>
              All SDK methods (<code>moderateText</code>, <code>moderateImage</code>) are asynchronous and return Promises.
              If an API request fails (e.g., due to an invalid API key, network issue, or server error), input validation within the SDK fails, or any other error occurs, the Promise will be rejected with an <code>Error</code> object.
              The <code>error.message</code> property will contain a description of the error. You should wrap SDK calls in <code>try...catch</code> blocks to handle potential errors gracefully.
            </p>
            <CodeBlock title="Error Handling Example">{`async function safeModerateText(text) {
  const apiKey = "YOUR_VALID_API_KEY"; // Ensure this is set
  const sdk = new ContentGuardianSDK('https://contentshield.vercel.app/', apiKey);
  try {
    const result = await sdk.moderateText(text);
    console.log("Success:", result);
    // Process successful result
  } catch (error) {
    console.error("Moderation failed:", error.message);
    // Display user-friendly error message based on error.message
    // Example: if (error.message.includes("Unauthorized")) { /* handle auth error */ }
  }
}

safeModerateText("An example text.");
safeModerateText(""); // This will throw an error due to empty input
// To test auth error, try with an invalid or no API key in SDK initialization.`}</CodeBlock>
          </div>
           <div>
            <h3 className="font-semibold text-lg mb-1">5. Type Definitions</h3>
            <p className="mb-2">The SDK exports TypeScript interfaces for request and response types if you are using TypeScript:</p>
            <CodeBlock title="TypeScript Interfaces (from sdk.ts)">{`
export interface TextModerationResult {
  isHateSpeech: boolean;
  confidenceScore: number;
}

export interface ImageModerationResult {
  isNsfw: boolean;
  confidence: number;
}

export interface ModerationError { // This is the shape of error from API if response.ok is false
  error: string;
}
            `}</CodeBlock>
          </div>
        </CardContent>
      </Card>

      {/* cURL API Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Terminal className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">Direct API Usage (cURL)</CardTitle>
          </div>
          <CardDescription>
            Use these examples if you prefer to interact with the API directly using tools like cURL.
            The API is hosted at <code>https://contentshield.vercel.app/</code>.
            Remember to replace <code>YOUR_GENERATED_API_KEY</code> with an actual key obtained from the
            <Link href="/" className="font-medium text-primary hover:underline"> Moderation Tools page</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Card className="pt-4 mb-6 bg-card/50 shadow-sm">
                <CardHeader className="pt-0">
                <CardTitle className="text-xl">Text Moderation API</CardTitle>
                <CardDescription>Moderates text to detect potential hate speech.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg mb-1">Endpoint</h3>
                    <p><Badge variant="secondary">POST</Badge> <code>https://contentshield.vercel.app/api/moderate-text</code></p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Headers</h3>
                    <ul className="list-disc list-inside pl-4">
                    <li><code>Content-Type: application/json</code></li>
                    <li><code>X-API-Key: YOUR_GENERATED_API_KEY</code> (Required)</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Request Body (JSON)</h3>
                    <CodeBlock title="application/json">{`{
  "text": "Your text to moderate here."
}`}</CodeBlock>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Parameters</h3>
                    <ul className="list-disc list-inside pl-4">
                    <li><code>text</code> (string, required): The text content to be analyzed.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Example Request (cURL)</h3>
                    <CodeBlock title="cURL">{textApiCurl}</CodeBlock>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Example Responses</h3>
                    <CodeBlock title="Success (200 OK - Hate speech detected)">{textApiSuccessHate}</CodeBlock>
                    <CodeBlock title="Success (200 OK - Safe)">{textApiSuccessSafe}</CodeBlock>
                    <CodeBlock title="Error (400 Bad Request - Invalid Input)">{textApiError400}</CodeBlock>
                    <CodeBlock title="Error (401 Unauthorized - Invalid/Missing API Key)">{textApiError401}</CodeBlock>
                    <CodeBlock title="Error (500 Internal Server Error)">{textApiError500}</CodeBlock>
                </div>
                </CardContent>
            </Card>

            <Card className="pt-4 bg-card/50 shadow-sm">
                <CardHeader className="pt-0">
                <CardTitle className="text-xl">Image Moderation API</CardTitle>
                <CardDescription>Moderates an image to detect NSFW (Not Safe For Work) content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg mb-1">Endpoint</h3>
                    <p><Badge variant="secondary">POST</Badge> <code>https://contentshield.vercel.app/api/moderate-image</code></p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Headers</h3>
                    <ul className="list-disc list-inside pl-4">
                    <li><code>Content-Type: application/json</code></li>
                    <li><code>X-API-Key: YOUR_GENERATED_API_KEY</code> (Required)</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Request Body (JSON)</h3>
                    <CodeBlock title="application/json">{`{
  "imageDataUri": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE..."
}`}</CodeBlock>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Parameters</h3>
                    <ul className="list-disc list-inside pl-4">
                    <li><code>imageDataUri</code> (string, required): The image encoded as a Base64 data URI. Format: <code>data:&lt;mimetype&gt;;base64,&lt;encoded_data&gt;</code>.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">How to get <code>imageDataUri</code></h3>
                    <p className="mb-2">You typically generate a data URI from an image file on the client-side using JavaScript. Here&apos;s a conceptual example:</p>
                    <CodeBlock title="JavaScript Example">{fileToDataUriCode}</CodeBlock>
                    <p className="mt-2 text-sm text-muted-foreground">Supported image types by the moderation UI are PNG, JPG, GIF, WebP. The underlying model might support more.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Example Request (cURL)</h3>
                    <CodeBlock title="cURL">{imageApiCurl}</CodeBlock>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Example Responses</h3>
                    <CodeBlock title="Success (200 OK - NSFW detected)">{imageApiSuccessNsfw}</CodeBlock>
                    <CodeBlock title="Success (200 OK - Safe)">{imageApiSuccessSafe}</CodeBlock>
                    <CodeBlock title="Error (400 Bad Request - Invalid Input)">{imageApiError400}</CodeBlock>
                    <CodeBlock title="Error (401 Unauthorized - Invalid/Missing API Key)">{imageApiError401}</CodeBlock>
                    <CodeBlock title="Error (500 Internal Server Error)">{imageApiError500}</CodeBlock>
                </div>
                </CardContent>
            </Card>
        </CardContent>
      </Card>


       <footer className="mt-12 md:mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>Confidence scores range from 0 (not harmful/NSFW) to 1 (very likely harmful/NSFW).</p>
        <p className="mt-1">For image moderation, ensure the <code>imageDataUri</code> is correctly formatted and the image data is properly Base64 encoded.</p>
      </footer>
    </div>
  );
}
