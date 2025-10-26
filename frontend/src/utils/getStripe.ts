import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
export const getStripe = async () => {
    try {
        if (!stripePromise) {
            // Log all available environment variables (just the keys, not values for security)
            console.log("Available env variables:", 
                Object.keys(import.meta.env)
                    .filter(key => key.startsWith('VITE_'))
            );
            
            const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
            console.log("Stripe key exists:", !!key);
            
            if (!key) {
                throw new Error("Stripe publishable key is not set in environment variables. Please check your .env file and restart the development server.");
            }
            
            console.log("Initializing Stripe with key length:", key.length);
            stripePromise = loadStripe(key);
        }
        
        const stripe = await stripePromise;
        if (!stripe) {
            throw new Error("Failed to initialize Stripe instance");
        }
        console.log("Stripe initialized successfully");
        return stripe;
    } catch (error) {
        console.error("Error initializing Stripe:", error);
        throw error;
    }
};