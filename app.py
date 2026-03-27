from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__)
DB_NAME = 'contacts.db'

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# CRITICAL: Initialize the database
init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.json
        name, email, msg = data.get('name'), data.get('email'), data.get('message')
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', (name, email, msg))
        conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get_contacts')
def get_contacts():
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM contacts ORDER BY timestamp DESC LIMIT 5')
        rows = cursor.fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])
    except:
        return jsonify([])

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = '0.0.0.0' if os.environ.get("PORT") else '127.0.0.1'
    app.run(host=host, port=port, debug=True)