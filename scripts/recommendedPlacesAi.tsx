import axios from 'axios';
import { getIdToken } from '../scripts/getFirebaseID';
import { auth } from '../firebaseConfig';


export const recommended_places = async (numRecommendations: number) => {
  const url = "https://ezgoing.app/api/openai/chat";

  // Retrieve the ID token from Firebase
    const firebaseID = await getIdToken(auth);
  
  const headers = {
    'Authorization': `Bearer ${firebaseID}`,
    'Content-Type': 'application/json'
  };

  const agent = "You generate JSON."
  const input = `Please come up with ${numRecommendations.toString} recommended places and format them like this. DO NOT ADD ANYTHING ELSE:
    [
        {
            destination: "Statue of Liberty",
            image: "statue",
            time: "3h",
            amount: "$25",
            review: "4.7",
            reviewAmt: "105k",
            saved: false
        },
        {
            destination: "The Metropolitan Meuseum of Art",
            image: "moma",
            time: "4h",
            amount: "$30",
            review: "4.8",
            reviewAmt: "84k",
            saved: false
        },
        {
            destination: "Grand Central Market",
            image: "market",
            time: "1h",
            amount: "$$$",
            review: "4.5",
            reviewAmt: "1468",
            saved: false
        },
    ]
        `
                            

  const body = {
    model: "gpt-4o-mini",
    messages: [
        {"role": "system", "content": agent},
        {"role": "user", "content": input}
    ],
    temperature: 0.8,        // Creativeness
    top_p: 0.9,             // Top p Reponses
    frequency_penalty: 0.1,  // How much to avoid repeats
    max_tokens: 1000
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
