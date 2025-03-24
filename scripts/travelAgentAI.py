import sys
from openai import OpenAI

def travel_agent_recommendation(user_input):
    client = OpenAI()
    
    travel_agent_mode = '''You are a travel agent who helps give users recommended locations based on the place they want to visit.
                            All responses are at most 200 words with an average of around 60.'''

    # GPT completion
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": travel_agent_mode},
            {"role": "user", "content": user_input}
        ],
        temperature=1.2,        # Creativeness
        top_p=0.95,             # Top p Reponses
        frequency_penalty=0.3,  # How much to avoid repeats
        max_tokens=150
    )

    # Return Travel Agent's Response
    return str(completion.choices[0].message.content)
