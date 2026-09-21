# BloodScan AI

Build a modern, user-friendly web application for Blood Group Prediction using Artificial Intelligence and Image Processing.

App Name: Smart Blood Group Detection System

Core Features:

1. User Interface:

- Clean dashboard with options to upload images (blood sample or fingerprint)

- Form to enter patient details (Name, ID, Age, Gender)

- Display results clearly with visual indicators

2. Image Upload:

- Accept JPG, PNG, BMP formats

- Allow upload from device or camera

- Validate image quality before processing

3. Image Processing:

- Apply preprocessing (noise removal, resizing, contrast enhancement)

- Detect agglutination regions in blood images

4. AI Prediction:

- Integrate a trained deep learning model (MobileNetV2 or CNN)

- Classify blood group into A, B, AB, O with Rh factor (+/-)

- Show prediction confidence

5. Results:

- Display predicted blood group clearly

- Highlight detected regions visually

- Generate downloadable PDF report

6. Backend:

- Use Python (Flask or Streamlit)

- Integrate AI model using TensorFlow or PyTorch

7. Database:

- Store patient details, uploaded images, and results

- Use SQLite or MySQL

8. Extra Features:

- History of previous predictions

- Simple analytics dashboard

- Responsive design for mobile and desktop

Design Requirements:

- Minimal, clean UI with healthcare theme

- Use cards, icons, and proper spacing

- Fast loading and simple navigation

Goal:

Create an efficient, accurate, and easy-to-use AI-powered system that reduces manual effort in blood group detection and works even in low-resource environments.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://crimson-clarity.lovable.app
**RTP Project**: crimson clarity


## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0233fde7-533c-47b3-8d17-07a23110d8c1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
