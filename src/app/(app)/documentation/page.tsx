

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, BookOpenCheck } from "lucide-react";

export default function DocumentationPage() {
  const textApiCurl = `curl -X POST \\
  http://localhost:9002/api/moderate-text \\
  -H 'Content-Type: application/json' \\
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
 const textApiError500 = `{
  "error": "An unknown error occurred during text moderation."
}`;

  const imageApiCurl = `curl -X POST \\
  http://localhost:9002/api/moderate-image \\
  -H 'Content-Type: application/json' \\
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

// For API calls from the same origin (e.g., within this Next.js app)
const sdk = new ContentGuardianSDK(); 

// Or, if calling from a different domain:
// const sdk = new ContentGuardianSDK('https://your-deployed-api-server.com');

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

const sdk = new ContentGuardianSDK(); // Assumes same-origin API

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
        <Terminal className="h-4 w-4" />
        <AlertTitle>Using the API</AlertTitle>
        <AlertDescription>
          You can use the Content Guardian API to programmatically moderate text and images using cURL or our SDK.
          Ensure your API requests are made to the correct port (default is <code>9002</code> for this project in development).
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
            For easier integration into your JavaScript/TypeScript frontend applications, use the Content Guardian SDK.
            It simplifies API calls and error handling.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-1">1. Setup</h3>
            <p className="mb-2">
              The SDK is located at <code>src/lib/content-guardian-sdk.ts</code>.
              If you are developing within this Next.js application, you can import it directly:
            </p>
            <CodeBlock title="Importing the SDK">{`import { ContentGuardianSDK } from '@/lib/content-guardian-sdk';`}</CodeBlock>
            <p className="mt-2 text-sm text-muted-foreground">
              If this SDK were published as an NPM package (e.g., <code>content-guardian-sdk</code>), you would install it
              (<code>npm install content-guardian-sdk</code>) and import it like so:
              <code>import {'{ ContentGuardianSDK }'} from 'content-guardian-sdk';</code>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">2. Initialization</h3>
            <p className="mb-2">Create an instance of the SDK. You can optionally provide the base URL of your API server.</p>
            <CodeBlock title="JavaScript/TypeScript">{`// For API calls from the same origin (e.g., from this Next.js app's frontend)
const sdk = new ContentGuardianSDK(); 

// Or, if your API is hosted on a different domain:
// const sdk = new ContentGuardianSDK('https://your-api-server.example.com');`}</CodeBlock>
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
            <h3 className="font-semibold text-lg mb-1">3. Error Handling</h3>
            <p>
              All SDK methods (<code>moderateText</code>, <code>moderateImage</code>) are asynchronous and return Promises.
              If an API request fails, input validation within the SDK fails, or any other error occurs, the Promise will be rejected with an <code>Error</code> object.
              The <code>error.message</code> property will contain a description of the error. You should wrap SDK calls in <code>try...catch</code> blocks to handle potential errors gracefully.
            </p>
            <CodeBlock title="Error Handling Example">{`async function safeModerateText(text) {
  try {
    const result = await sdk.moderateText(text);
    console.log("Success:", result);
    // Process successful result
  } catch (error) {
    console.error("Moderation failed:", error.message);
    // Display user-friendly error message based on error.message
  }
}

safeModerateText("An example text.");
safeModerateText(""); // This will throw an error due to empty input`}</CodeBlock>
          </div>
           <div>
            <h3 className="font-semibold text-lg mb-1">4. Type Definitions</h3>
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
          <CardDescription>Use these examples if you prefer to interact with the API directly using tools like cURL.</CardDescription>
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
                    <p><Badge variant="secondary">POST</Badge> <code>/api/moderate-text</code></p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Headers</h3>
                    <ul className="list-disc list-inside pl-4">
                    <li><code>Content-Type: application/json</code></li>
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
                    <p><Badge variant="secondary">POST</Badge> <code>/api/moderate-image</code></p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">Headers</h3>
                    <ul className="list-disc list-inside pl-4">
                    <li><code>Content-Type: application/json</code></li>
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

