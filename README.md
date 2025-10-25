AI Health Analyzer

An AI-powered Health Report Analysis and Appointment System that analyzes medical reports, detects health conditions, and connects users with doctors automatically.
Built using Python (Flask), HTML, CSS, and JavaScript.

 Project Overview:-

The AI Health Analyzer is a web-based platform that allows users to:

Upload health reports, CT scans, or medical images
Extract data using OCR (Tesseract)
Predict the stage of health (Healthy / Early Stage / Critical) using a trained AI/ML model
Generate detailed AI PDF Health Reports
Automatically recommend doctors and allow appointment booking for critical cases
Manage reports and appointments via secure Login / Signup system

 Key Features
Feature	Description
    AI Diagnosis	Uses trained ML models to predict the user’s health condition
    File Uploads	Supports medical images, PDFs, and CSV health data
    OCR Integration	Extracts key details from medical reports using Tesseract
    AI Health Report	Generates a downloadable PDF summary
    Doctor Booking	Suggests specialists and allows appointment scheduling
    User Authentication	Login/Signup to track health reports & history
    Database	SQLite used to store users, reports, and appointments
    Tech Stack
Layer	Technology :--

Backend	Flask (Python)
Frontend	HTML, CSS, JavaScript
Database	SQLite
AI/ML	scikit-learn (RandomForestClassifier)
OCR	Tesseract
PDF Generation	FPDF

 Project Structure:-
health_ai/
 ├── app.py
 ├── /templates
 │     ├── index.html
 │     ├── login.html
 │     ├── signup.html
 │     ├── dashboard.html
 │     └── appointment.html
 ├── /static
 │     ├── style.css
 │     └── script.js
 ├── /uploads
 ├── /database/health.db
 └── requirements.txt

How to Run Locally
Step 1: Clone the repository
git clone <YOUR_GIT_URL>
cd health_ai

Step 2: Install dependencies
pip install -r requirements.txt

Step 3: Run the Flask app
python app.py

Step 4: Open in browser
http://127.0.0.1:5000

Screenshots (Optional)

(You can add screenshots of the UI here — upload your Flask website screenshots)

Future Enhancements

Integration with real hospital APIs for live doctor appointments

Multi-language OCR support for regional medical reports

AI Chatbot for instant health advice

Cloud deployment for global access


Team Name: Team HealthVision
Members: 

[A.V.S.NARAYANA]

[P.SRI NARAHARI]

[P.CHINMAINADTH]

[K.VARUN]

[N. SHIVA SHARAN TEJ]

Guide: [R. PAVAN KUMAR]
Institution: [PACE INSTITUTE OF TECHNOLOGY AND SCIENCES]

⚡ Deployment

If you’re hosting with Lovable, simply click:
Share → Publish → Confirm Deployment

Or deploy manually on:

Render

Railway

Vercel (via Flask adapter)

Heroku

📜 License

This project is developed for educational purposes and is open for academic research and improvement.
