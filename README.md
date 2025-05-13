# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Content Guardian API Documentation

You can use the Content Guardian API to moderate text and images programmatically.

### API Endpoints

#### 1. Text Moderation

Moderates text to detect potential hate speech.

- **URL:** `/api/moderate-text`
- **Method:** `POST`
- **Headers:**
    - `Content-Type: application/json`
- **Request Body (JSON):**
  ```json
  {
    "text": "Your text to moderate here."
  }
  ```
- **Parameters:**
    - `text` (string, required): The text content to be analyzed.
- **Example Request (cURL):**
  ```bash
  curl -X POST \
    http://localhost:9002/api/moderate-text \
    -H 'Content-Type: application/json' \
    -d '{
      "text": "This is some example text to check for hate speech."
    }'
  ```
- **Example Success Response (200 OK):**
  ```json
  {
    "isHateSpeech": false,
    "confidenceScore": 0.123456789
  }
  ```
  Or, if hate speech is detected:
  ```json
  {
    "isHateSpeech": true,
    "confidenceScore": 0.987654321
  }
  ```
- **Example Error Response (400 Bad Request - Invalid Input):**
  ```json
  {
    "error": "Text cannot be empty."
  }
  ```
- **Example Error Response (500 Internal Server Error):**
  ```json
  {
    "error": "An unknown error occurred during text moderation."
  }
  ```

#### 2. Image Moderation

Moderates an image to detect NSFW (Not Safe For Work) content.

- **URL:** `/api/moderate-image`
- **Method:** `POST`
- **Headers:**
    - `Content-Type: application/json`
- **Request Body (JSON):**
  ```json
  {
    "imageDataUri": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE..."
  }
  ```
- **Parameters:**
    - `imageDataUri` (string, required): The image encoded as a Base64 data URI. The format must be `data:<mimetype>;base64,<encoded_data>`.
- **How to get `imageDataUri`:**
  You typically generate a data URI from an image file on the client-side using JavaScript. Here's a conceptual example:
  ```javascript
  async function fileToDataUri(file) {
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
  // console.log(dataUri);
  ```
- **Example Request (cURL):**
  *(Note: The `imageDataUri` will be very long, so it's truncated here for brevity.)*
  ```bash
  curl -X POST \
    http://localhost:9002/api/moderate-image \
    -H 'Content-Type: application/json' \
    -d '{
      "imageDataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
    }'
  ```
- **Example Success Response (200 OK):**
  ```json
  {
    "isNsfw": false,
    "confidence": 0.0567890123
  }
  ```
  Or, if NSFW content is detected:
  ```json
  {
    "isNsfw": true,
    "confidence": 0.951234567
  }
  ```
- **Example Error Response (400 Bad Request - Invalid Input):**
  ```json
  {
    "error": "imageDataUri cannot be empty."
  }
  ```
- **Example Error Response (500 Internal Server Error):**
  ```json
  {
    "error": "An unknown error occurred during image moderation."
  }
  ```

### General Notes

- Ensure your API requests are made to the correct port where your Next.js application is running (default is `3000`, but in this project it's configured to `9002` for development).
- The Genkit AI models used for moderation have their own processing times, so API responses might take a few seconds.
- The confidence scores range from 0 (not harmful/NSFW) to 1 (very likely harmful/NSFW).
- For image moderation, ensure the `imageDataUri` is correctly formatted and the image data is properly Base64 encoded. Supported image types by the moderation UI are PNG, JPG, GIF, WebP. The underlying model might support more, but these are validated in the form.
```