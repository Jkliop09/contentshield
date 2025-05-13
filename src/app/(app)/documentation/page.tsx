
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

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


  return (
    <div className="space-y-8">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Using the API</AlertTitle>
        <AlertDescription>
          You can use the Content Guardian API to programmatically moderate text and images.
          Ensure your API requests are made to the correct port (default is <code>9002</code> for this project in development).
          API responses might take a few seconds due to AI model processing.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Text Moderation API</CardTitle>
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Image Moderation API</CardTitle>
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
            <p className="mb-2">You typically generate a data URI from an image file on the client-side using JavaScript. Here's a conceptual example:</p>
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
       <footer className="mt-12 md:mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>Confidence scores range from 0 (not harmful/NSFW) to 1 (very likely harmful/NSFW).</p>
        <p className="mt-1">For image moderation, ensure the <code>imageDataUri</code> is correctly formatted and the image data is properly Base64 encoded.</p>
      </footer>
    </div>
  );
}
