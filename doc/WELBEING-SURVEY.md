# 🧠 Well-Being Survey System
## Indonesian Orthopaedic & Traumatology Education Dashboard

---

## 1. Entry Point & User Flow

Profile Study Program Page (UGM / Other University)  
→ Click **Well-Being Survey**  
→ Redirect to **Well-Being Survey Page**  
→ Auto-fetch Study Program & Affiliation (by code)  
→ Step-by-step Well-Being Survey  
→ Submit  
→ Scoring + Affirmation + Support Resources  

---

## 2. URL & Parameter Handling

### Source URL (Study Program Page)
https://edashboard-kolegiumortho.com/profile-study-program/FK-UI

> `FK-UI` is a **unique study program / affiliation code**

---

### Redirect URL
https://edashboard-kolegiumortho.com/wellbeing-survey?code=FK-UI

---

### Auto-Resolved Affiliation (Backend)

Resolved using `code=FK-UI`:

- University: Universitas Indonesia
- Faculty: Faculty of Medicine
- Study Program: PPDS Orthopaedi & Traumatology
- Program Type: PPDS
- Affiliation Code: FK-UI
- Source: profile-study-program

---

## 3. Survey Metadata (Hidden / System Use)

- survey_type: wellbeing
- participant_type: resident / fellow / trainee
- affiliation_code: FK-UI
- university: Universitas Indonesia
- faculty: Faculty of Medicine
- study_program_name: PPDS Orthopaedi & Traumatology
- program_type: PPDS

> Metadata is resolved automatically and **not editable by user**

---

## 4. STEP 1 — Mental Well-Being Meter

### How are you feeling today?
Please choose your smile / emoticon

- 🙂 Happy  
- 😐 Normal  
- 😟 Worry  
- 😞 Depressed  
- 🆘 Help Me  

### Risk Flag Logic
- Happy / Normal → Low Risk  
- Worry → Mild Risk  
- Depressed / Help Me → High Risk  

---

## 5. STEP 2 — Mental Health Questionnaire

Please answer the questionnaires:

1. During the past month, have you felt burned out from your work?  
   ( ) Yes   ( ) No

2. During the past month, have you worried that your work is hardening you emotionally?  
   ( ) Yes   ( ) No

3. During the past month, have you often been bothered by feeling down, depressed, or hopeless?  
   ( ) Yes   ( ) No

4. During the past month, have you fallen asleep while sitting inactive in a public place?  
   ( ) Yes   ( ) No

5. During the past month, have you felt that you are being bullied at work?  
   ( ) Yes   ( ) No

### Scoring Rule
- Yes = 1 point  
- No = 0 point  

Score Interpretation:
- 0–1 → Low Risk  
- 2–3 → Moderate Risk  
- 4–5 → High Risk  

---

## 6. STEP 3 — Anonymous Discomfort Report

Do you feel any discomforting condition within the past one month?

( ) Yes   ( ) No

If **Yes**, please describe:

[ Write your reason here... ]

Notes:
- Fully anonymous
- No personal identifier stored
- Used only for aggregated insight and early warning

---

## 7. STEP 4 — Result & Affirmation Page

### Low / Normal Risk
You are a great person and we love you.  
Keep your spirit high.  
You can do this! :)

### Moderate / High Risk
You are not alone.  
Support is available and help is near.  
Please consider reaching out to the resources below.

---

## 8. Always-Visible Support & Crisis Resources

### Crisis Center (Local / Faculty / University)
- Displayed dynamically based on affiliation
- Example:
  - Faculty Counseling Unit
  - University Hospital Emergency Unit

### Suicide & Crisis Lifeline
- +62 811-2800-244 (Call / Text)
- Available 24 hours, 7 days a week

### Professional Behavior Committee
- +62 811-2800-2440
- Available Monday–Friday, 10:00–18:00 WIB

These resources are visible on **all survey steps**.

---

## 9. Backend Payload Example

{
  "survey_type": "wellbeing",
  "affiliation_code": "FK-UI",
  "university": "Universitas Indonesia",
  "study_program": "PPDS Orthopaedi & Traumatology",
  "responses": {
    "mood": "worry",
    "burnout": 1,
    "emotional_hardening": 1,
    "depressed": 0,
    "sleep_issue": 1,
    "bullying": 0,
    "discomfort": true,
    "discomfort_note": "Workload and night shift"
  },
  "risk_level": "moderate",
  "submitted_at": "2026-01-31T10:15:00Z"
}

---

## 10. Ethics & UX Notes

- No medical diagnosis
- Non-judgmental language
- Anonymous by default
- Immediate access to support
- Data used only for wellbeing improvement
- Aggregated reporting only (no individual exposure)
