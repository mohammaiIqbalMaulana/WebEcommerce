import stripe from "../config/stripe";
import prisma from "../config/prisma-client";
import { NextFunction, Request, Response } from "express";

export const getCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.id);
        res.status(200).json(session);
    } catch (error) {
        next({ message: "Unable to retrieve the checkout session", error });
    }
};

export const getCheckoutItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lineItems = await stripe.checkout.sessions.listLineItems(req.params.id);
        const items = await Promise.all(lineItems.data.map(async (lineItem) => {
            const product = await prisma.product.findUnique({
                where: {
                    priceId: lineItem.price?.id 
                }
            });
            return { productId: product?.id, quantity: lineItem.quantity };
        }));
        res.status(200).json(items);
    } catch (error) {
        next({ message: "Unable to retrieve the checkout items", error });
    }
};

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Creating checkout session with data:', {
            lineItems: req.body.lineItems,
            userId: req.body.userId
        });

        // Map the line items to use price directly
        const lineItems = req.body.lineItems.map((item: { price: string; quantity: number }) => ({
            price: item.price,
            quantity: item.quantity
        }));

        console.log('Creating Stripe session with line items:', lineItems);
        
        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173"}/checkout/success?id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173"}/cart`,
            payment_method_types: ['card'],
            mode: "payment",
            line_items: lineItems,
            currency: "usd",
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            metadata: {
                customerId: req.body.userId
            }
        });
        
        console.log('Checkout session created:', session.id);
        res.status(201).json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        console.error('Request body:', req.body);
        console.error('Line items:', req.body.lineItems);
        next({ message: "Unable to create the checkout session", error });
    }
};
