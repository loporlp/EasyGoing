

export const getIdToken = async (auth) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const idToken = await user.getIdToken(true); // Retrieve the ID token
        return idToken;
      } catch (error) {
        console.error("Error fetching ID token:", error);
        throw error;
      }
    } else {
      console.error("No user is logged in.");
      throw new Error("User not authenticated");
    }
  };