# AI-Powered Fraud Detection & Transaction Security System

## Overview
This is a FinTech security system that detects fraudulent transactions using Google Gemini AI and Firebase.

It is built for Track 5: Secure Digital (FinTech & Security) under GDG Project 2030.

The system prevents fraud by blocking flagged accounts immediately and using AI to analyze new transactions.

---

## Tech Stack
- Google AI Studio (Prompt design & testing for AI model prototyping)
- Google Antigravity (Primary development environment)
- Gemini API (Fraud detection engine)
- Next.js (Frontend + API routes)
- Firebase Firestore (Database)
- Firebase Auth (User authentication)
- Google Cloud Run (Deployment)

---

## AI Development Workflow
The fraud detection logic was first designed and prototyped using Google AI Studio (Gemini).

The application was then developed and implemented using Google Antigravity as the main development environment**, following the Build with AI workflow.

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
1. User Sign In
2. User Login
3. User request new transaction
4. System checks Firestore for flagged recipient
5. If flagged, transaction is rejected immediately
6. If not flagged, Gemini AI evaluates risk
7. Result is stored in Firebase
8. If normal transaction, user will immediately received transaction number through their email.
9. Admin can review suspicious transactions and check whether they want to make it normal or set as flagged
10. If normal, transaction number is automatically send to user's email
11. If flagged, transaction is rejected.

---

## AI Logic
Gemini evaluates:
- Transaction amount
- Recipient details
- Behavioral patterns

Output:
- NORMAL → allow transaction
- SUSPICIOUS → send to admin review
- FLAGGED → block transaction (if detected by AI or system rules)

---

## How to Run Project locally
```bash
cd trustpay
npm install
npm install react-icons
npm install firebase
npm install firebase-admin
npm install @google/genai
npm run dev