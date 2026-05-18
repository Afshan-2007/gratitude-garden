import ollama
import json

def generate_learning_path(goal, level):
    """Generates a 6-week curriculum and project ideas."""
    prompt = f"""
    Create a 6-week learning roadmap for a {level} level student learning {goal}.
    Return ONLY a JSON object with this exact structure:
    {{
      "weeks": [
        {{"week_number": 1, "topic": "Topic Name", "description": "Short overview"}},
        {{"week_number": 2, "topic": "Topic Name", "description": "Short overview"}},
        {{"week_number": 3, "topic": "Topic Name", "description": "Short overview"}},
        {{"week_number": 4, "topic": "Topic Name", "description": "Short overview"}},
        {{"week_number": 5, "topic": "Topic Name", "description": "Short overview"}},
        {{"week_number": 6, "topic": "Topic Name", "description": "Short overview"}}
      ],
      "projects": [
        {{"name": "Beginner Project", "desc": "Description"}},
        {{"name": "Intermediate Project", "desc": "Description"}},
        {{"name": "Advanced Project", "desc": "Description"}}
      ]
    }}
    """
    response = ollama.generate(model='llama3.2', prompt=prompt, format="json")
    return json.loads(response['response'])

def generate_weekly_quiz(topic, level):
    """Generates 10 MCQs for a specific topic."""
    prompt = f"""
    Generate 10 MCQs for the topic '{topic}' at a {level} level. 
    IMPORTANT: The 'correct' field must EXACTLY MATCH one of the strings in the 'options' list.
    Return ONLY JSON:
    {{
      "quiz": [
        {{
          "q": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct": "Option A"
        }}
      ]
    }}
    """
    response = ollama.generate(model='llama3.2', prompt=prompt, format="json")
    return json.loads(response['response'])