/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

admin.initializeApp();

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2023-08-16",
});

export const createPaymentIntent = functions.https.onCall(
  async (data, context) => {
    const { amount } = data;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in cents
        currency: "usd",
      });

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Unable to create PaymentIntent"
      );
    }
  }
);
