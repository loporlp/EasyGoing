import axios from 'axios';
import { getIdToken } from '../scripts/getFirebaseID';
import { auth } from '../firebaseConfig';


export const travelAgentApi = async (user_input: string) => {
  const url = "https://ezgoing.app/api/openai/chat";

  // Retrieve the ID token from Firebase
    const firebaseID = await getIdToken(auth);
  
  const headers = {
    'Authorization': `Bearer ${firebaseID}`,
    'Content-Type': 'application/json'
  };

  const travel_agent_mode = "You are a travel agent called GoBot who helps give users recommended locations based on the place they want to visit. All responses are at most 200 words with an average of around 60."

  const body = {
    model: "gpt-4o-mini",
    messages: [
        {"role": "system", "content": travel_agent_mode},
        {"role": "user", "content": user_input}
    ],
    temperature: 1.2,        // Creativeness
    top_p: 0.95,             // Top p Reponses
    frequency_penalty: 0.3,  // How much to avoid repeats
    max_tokens: 150
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling travel agent API:', error);
    throw error;
  }
};
