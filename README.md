# AI-Powered Fraud Detection & Transaction Security System

## Overview
An AI-powered banking security system that detects fraudulent transactions using Gemini.

This project is built for **Track 5: Secure Digital (FinTech & Security)**, focusing on preventing digital fraud and improving cybersecurity as well as data privacy in financial transactions.

---

## Tech Stack
- Google AI Studio (Prompt design & testing for AI model prototyping)
- Google Antigravity (Primary development environment)
- Gemini API (Fraud detection engine)
- Next.js (Full-stack application: frontend + API routes)
- Firebase (Authentication & Database)
- Google Cloud Run (Deployment)

---

## AI Development Workflow
The fraud detection logic was first designed and prototyped using **Google AI Studio (Gemini)**.

The application was then developed and implemented using **Google Antigravity as the main development environment**, following the Build with AI workflow.

Multiple test cases (Normal, Suspicious, Fraud) were used to validate model behavior and ensure consistency before integration into the full application.

---

## Test Cases
- Normal transactions  
- Suspicious transactions  
- Fraud cases  

Prompt is included in `/docs/aistudio/prompt.md`.

Test cases are available in `/docs/aistudio/test_cases.md`.  
Screenshots are available in `/docs/aistudio/screenshots`.

---

## System Flow
User Sign In → Login → Transaction Input → Gemini AI Analysis → Risk Score → System Action → Firebase Update → Admin Review (if HOLD)

---

## How to Run Project
```bash
npm install
npm install react-icons
npm install firebase
npm install firebase-admin
npm install @google/genai
npm run dev