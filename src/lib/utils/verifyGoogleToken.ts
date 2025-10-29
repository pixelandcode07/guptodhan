import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Web Client ID
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error("Google Token Verify Error:", error);
    throw new Error("Invalid Google ID Token");
  }
};