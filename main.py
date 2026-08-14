import os
from flask import Flask, render_template, redirect, request, jsonify
from supabase import create_client, Client
import pusher

app = Flask(__name__)

# SUPABASE CONFIG
SUPABASE_URL = "https://ahazphvlrnzjycnsfabv.supabase.co"
SUPABASE_KEY = "sb_publishable_9TX39uWChlAr3J-a-2-oaQ_8IUS2I9C"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# PUSHER CONFIG
pusher_client = pusher.Pusher(
  app_id='2186109',
  key='8af230300b27d50ac58e',
  secret='d1ac00b709f9273858db',
  cluster='ap1',
  ssl=True
)

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

    payload = {
        'sender_name': sender,
        'message': text
    }

    # 1. Save to Supabase DB
    supabase.table('chat_messages').insert(payload).execute()

    # 2. Trigger real-time broadcast via Pusher to all connected clients
    pusher_client.trigger('chat-channel', 'new-message', payload)

    return jsonify({'status': 'success'})

@app.route('/layout', methods=['GET'])
def layout():
    return render_template("layout.html")

if __name__ == '__main__':
    app.run(debug=True)