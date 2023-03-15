
import { Firestore } from "@google-cloud/firestore";

export const db = new Firestore({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
        private_key: process.env.GCP_SA_PRIVATE_KEY?.replaceAll("\\n", "\n"),
        client_email: process.env.GCP_SA_CLIENT_EMAIL,
    },
})
