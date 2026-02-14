# 🧠 Well-Being Survey System
## Indonesian Orthopaedic & Traumatology Education Dashboard

---

## 1. Entry Point & User Flow (Updated with NIK Verification)

Profile Study Program Page (UGM / Other University)  
→ Click **Well-Being Survey**  
→ Redirect to **Well-Being Survey Page**  
→ Input **NIK (Nomor Induk Keanggotaan / Unique Code)**  
→ System validates NIK against Database Member  
→ System auto-detects Name, Affiliation, Category  
→ User confirms identity  
→ Step-by-step Well-Being Survey  
→ Submit  
→ Scoring + Affirmation + Support Resources  

---

## 2. Verification Flow (Database Member Validation)

### STEP 0 — Identity Verification

User must enter:

- NIK (Unique Member Code)

### System Process:

1. Lookup NIK in `database_members`
2. If NIK not found → show:
   > "NIK tidak ditemukan. Silakan hubungi admin prodi."
3. If found:
   - Retrieve:
     - Name (masked)
     - Affiliation
     - Category (Resident / Fellow / Trainee)
     - Status (Active / Inactive)

### Identity Confirmation

Display:
> "Selamat datang, Ahmad S**** (Residen – FK UI)"

User clicks:
- ✅ Lanjutkan Survey

If status ≠ Active → survey blocked.

---

## 3. Auto-Resolved Metadata (System Controlled)

- survey_type: wellbeing
- member_id: auto from database
- affiliation_code: auto from database
- university: auto
- faculty: auto
- study_program_name: auto
- category: auto
- survey_period: auto (e.g., Jan 2026)

> Metadata is not editable by user.

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

## 6. STEP 3 — Discomfort Report (Private Input)

Do you feel any discomforting condition within the past one month?

( ) Yes   ( ) No

If **Yes**, please describe:

[ Write your reason here... ]

Notes:
- Identified at system level (member_id)
- Not shown publicly
- Used only for risk detection & internal follow-up

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

## 8. Risk Notification Logic

Notification is triggered if:

- Star rating ⭐ 1–3  
OR  
- Critical “Yes” answers detected

Recipients (Level 4):
- Kolegium
- KPS
- Sekretaris Prodi
- Sekretaris Kolegium

> Notification does not expose full responses publicly.
> Follow-up must follow ethical guidelines.

---

## 9. Backend Payload Example

{
  "survey_type": "wellbeing",
  "member_id": 1023,
  "affiliation_code": "FK-UI",
  "category": "resident",
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
  "star_rating": 3,
  "survey_period": "2026-01",
  "submitted_at": "2026-01-31T10:15:00Z"
}

---

## 10. Dashboard Output

Public View:
- Average Star Rating (1–5)
- Percentage Wellbeing Score
- Total Respondents per Prodi
- Last Updated (e.g., “Well-Being Survey conducted on January 2026”)

Internal View (Authorized Only):
- Risk cases summary
- Trend per period
- No public exposure of personal identity

---

## 11. Ethics & Data Governance

- Identity verified via Database Member
- No public individual exposure
- One submission per member per period
- Data encrypted & access-controlled
- Used strictly for wellbeing improvement

---

## 12. Operational Cycle

- Survey conducted every 6 months
- Unique submission per period
- Data archived per cycle
