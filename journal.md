# Project PP - AI Agent Journal & Log

## Project Overview
**App Name:** PP
**Purpose:** Ingest sports betting picks, categorize them using AI, log to Google Sheets, and generate a composed 4000x5333 JPG asset for sharing.
**Tech Stack:** React (Next.js/Vite), Vercel, GitHub, Google Sheets, Gemini AI.

## Strict Rules
* **No Local Previews:** Never test or preview code locally (no node/npm). All code must be pushed to GitHub to be previewed directly on Vercel by the user.

## Core Flow
1. **Intake:** User uploads an image, enters "Pick" text, and enters Odds (e.g., -110).
2. **AI & Review:**
   - AI assigns the Pick to a major sport (MLB, NFL, etc.).
   - App presents a confirmation screen with UI for previewing the data and the image.
   - User manually confirms the layout/data.
3. **Image Output & Logging:**
   - App composites a 4000x5333 JPG:
     - Base: Provided Template
     - Cutout/Uploaded Image: Inserted into the purple border (bottom half).
     - Text elements: Word-for-word Pick text, Current Date, AI-generated "Insight Stat" (green text at the bottom).
   - Confirmed picks are logged to the 2026 Write Sheet.
   - Mechanism included to provide feedback on the "Insight Stat" to improve AI generation.

## Log
* **2026-04-23:** Initial project setup and gameplan confirmed. Waiting on user to set up the GitHub repo, connect the Google Sheets permissions, and verify API keys.

---
*Note: This journal will serve as the source of truth for the PP project, preserving context across sessions.*
