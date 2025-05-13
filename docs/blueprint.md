# **App Name**: Content Guardian

## Core Features:

- API Endpoints: Provides `/moderate-text` and `/moderate-image` endpoints for moderation.
- Text Analysis: Analyze the input text using a transformer model for hate speech detection.
- Image Analysis: Use an NSFW detection tool for analyzing images to determine if they are not safe for work.
- Rate Limiting: Implement rate limiting to handle up to 100 requests per minute to ensure stable performance.
- API Documentation: Generate OpenAPI/Swagger documentation to describe API endpoints and usage.

## Style Guidelines:

- Primary color: Neutral white or light gray for clean presentation.
- Secondary color: Darker gray or black for text and important UI elements to provide contrast.
- Accent: Teal (#008080) to highlight moderation status (e.g., safe, flagged).
- Simple, well-spaced layout for the demo frontend, focusing on clarity and ease of use.
- Use simple icons to represent the moderation status and actions.