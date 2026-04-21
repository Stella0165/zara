# AI Studio Test Cases
----------------------

## Test case 1: Normal
# Input
recipient_name: Ali
recipient_phone: 0123456789
amount: 100
flagged_database: []

# Output
{
    "status": "NORMAL",
    "risk_score": 5,
    "reason": "The recipient is not found in the flagged database. The transaction amount is low ($100), and the phone number format is standard. There are no immediate indicators of fraudulent activity.",
    "action": "APPROVE",
    "admin_suggestion": "No action required.",
    "confidence": 0.95
}

## Test case 2: Suspicious
# Input
recipient_name: Siti
recipient_phone: 0199999999
amount: 5000
flagged_database: []

# Output

{
    "status": "SUSPICIOUS",
    "risk_score": 42,
    "reason": "The transaction amount is significantly higher than the baseline. Although the recipient is not in the flagged database, the phone number '0199999999' is highly repetitive, which is often a pattern used for placeholder accounts or temporary SIM cards. This warrants a standard review for a first-time transfer of this value.",
    "action": "HOLD",
    "admin_suggestion": "Verify the sender's identity via multi-factor authentication (MFA) and check if this recipient has been used by other accounts recently.",
    "confidence": 0.85
}

## Test case 3: Fraud
# Input
recipient_name: Shaun
recipient_phone: 0199999999
amount: 10000
flagged_database: ["0199999999"]

# Output
{
  "status": "FRAUD",
  "risk_score": 98,
  "reason": "The recipient's phone number (0199999999) is a direct match in the flagged_database of known suspicious entities. Furthermore, the transaction amount is high (10,000), which, combined with the blacklisted contact, strongly indicates a high-risk fraudulent transfer.",
  "action": "REJECT",
  "admin_suggestion": "Immediately block the transaction and the sender's ability to initiate further transfers. Flag the account for a manual security audit and investigate if other users have attempted to send money to this specific number.",
  "confidence": 0.99
}
