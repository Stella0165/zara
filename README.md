# AI-Powered Fraud Detection & Transaction Security System

# Overview
An AI-powered banking security system that detects fraudulent transactions using Gemini.

This project is built for Track 5: Secure Digital (FinTech & Security), focusing on preventing digital fraud and improving cybersecurity as well as data privacy in financial transactions.

# Tech stack
- Google AI Studio (Prompt design and testing)
- Google Antigravity (Development environment)
- Gemini API (Fraud detection engine)
- Next.js (Frontend + API routes)
- Firebase (Authentication and Database)
- Google Cloud Run (Deployment)

# Ai development
The fraud detection logic was designed and tested using Google AI Studio.
Multiple test cases (Normal, Suspicious, Fraud) were evaluated before integration.

# Test cases
- Normal transactions
- Suspicious transactions
- Fraud cases

Prompt is included in `AI_STUDIO_PROMPT.md`.

Test cases are available in 'docs/aistudio/test_cases.md'.
Screenshots are available in `/docs/aistudio/screenshots`.

# System flow
User Sign in -> Login -> Transaction Input -> Gemini AI Analysis -> Risk Score -> System Action -> Firebase Update -> Admin Review (if HOLD)

# How to run project
npm install -> npm run dev
