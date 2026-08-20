import os
import traceback
from flask import Flask, render_template, request, jsonify
from supabase import create_client, Client
import pusher
from dotenv import load_dotenv
from google import genai
from glin_profanity import Filter

load_dotenv()

app = Flask(__name__)

# GEMINI KEY
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else genai.Client()

# SUPABASE CONFIG
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# PUSHER CONFIG

PUSHER_APP_ID = os.environ.get("PUSHER_APP_ID")
PUSHER_KEY = os.environ.get("PUSHER_KEY")
PUSHER_SECRET = os.environ.get("PUSHER_SECRET")
PUSHER_CLUSTER = os.environ.get("PUSHER_CLUSTER")

pusher_client = pusher.Pusher(
  app_id= PUSHER_APP_ID,
  key= PUSHER_KEY,
  secret= PUSHER_SECRET,
  cluster= PUSHER_CLUSTER,
  ssl=True
)

WEBSITE_CONTEXT = """
You are the personal AI assistant for John Pierre's website.
Answer questions based strictly on this information:

ABOUT ME:
- Name: [John Pierre L. Pampilon]
- What I do: [Student, Web Developer, Aspiring AI engineer]
- Skills: [HTML, CSS, JavaScript, Python]
- Projects: 
  1. [LV Text Analyzer]: [A real-time text analysis tool that instantly counts words, sentences, and letters.]
  2. [Website Portfolio]: [A personal website featuring my background, tech stack, experience, projects, certifications, and contact details.]
- Contact Info: {
                'email': jlpampilon.pacs@gmail.com
                'github': https://github.com/jierre
                'instagram': https://www.instagram.com/jpzz.zr/}
- Education : {
                'School' : Polytechnic University of the Philippines
                'Year' : Freshman
                'Course/Program' : Bachelor of science in Computer Science}

RULES:
- Be polite, concise, and helpful.
- If asked something not in this info, say: "I don't have that detail on the website, but you can reach out via email!"
- If asked aggressively or contains bad words, kindly say: "Please be respectful, bad words are not allowed"
"""

def init_profanity_filter():
    db_words = []

    try:
        response = supabase.table('bad_words').select('word').limit(5000).execute()
        db_words = [row['word'].strip().lower() for row in response.data if row.get('word')]
        print(f"Successfully loaded {len(db_words)} custom words from Supabase.")
    except Exception as e:
        print("Could not load custom bad words from DB:", str(e))

    return Filter({
        "languages": ["english"],
        "detect_leetspeak": True,
        "leetspeak_level": "moderate",
        "custom_words": db_words  
    })

profanity_filter = init_profanity_filter()

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    question = data.get('question', '').strip()

    if not question:
        return jsonify({'error': 'Question is required'}), 400

    # Verify API Key exists before calling Google
    if not os.environ.get("GEMINI_API_KEY"):
        return jsonify({'error': 'GEMINI_API_KEY environment variable is missing on Vercel'}), 500

    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=question,
            config={'system_instruction': WEBSITE_CONTEXT}
        )
        
        return jsonify({'answer': response.text})

    except Exception as e:
        # Print full error stack trace to Vercel logs
        print("ERROR IN CHAT ROUTE:", traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    

@app.route('/')
def home():
    # Fetch recent messages from Supabase so the chat history displays on load
    try:
        response = supabase.table('chat_messages').select('*').order('created_at', desc=False).execute()
        messages = response.data
    except Exception as e:
        messages = []
        print(f"Database error: {e}")

    return render_template('index.html', messages=messages)

@app.route('/api/send-message', methods=['POST'])
def send_message():
    data = request.get_json()
    sender = data.get('sender', 'Anonymous')
    text = data.get('message', '').strip()

    if not text:
        return jsonify({'status': 'error', 'message': 'Message cannot be empty'}), 400

    if profanity_filter.is_profane(text):
        return jsonify({
            'status': 'error', 
            'message': 'Please keep the chat respectful. Bad words are not allowed.'
        }), 400
    
    payload = {                                        
        'sender_name': sender,
        'message': text
    }

    # 1. Save to Supabase DB
    supabase.table('chat_messages').insert(payload).execute()

    try:
        pusher_client.trigger('chat-channel', 'new-message', payload)
    except Exception as e:
        print("Pusher Trigger Error:", str(e))

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)