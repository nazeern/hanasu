'use server'

import { createClient } from "@/utils/supabase/server"
import { User } from "@supabase/auth-js";
import { round } from "./utils";
import { getCurrentPlan } from "./profiles";
import { revalidatePath } from "next/cache";
import { Plan, planInfo } from "@/app/lib/data";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY) // eslint-disable-line

/* Try to get the existing stripe customer id. Else, create a new Stripe customer.*/
export async function stripeCustomer(user: User): Promise<string | null> {  // eslint-disable-line

    // Get saved customer id
    const supabase = await createClient()
    const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('stripe_id, name')
        .eq('id', user.id)
        .single()
    if (fetchError) { return null }

    const { stripe_id: customerId, name } = data
    if (customerId) { return customerId }

    // Create new customer on Stripe
    console.log(`Creating new Stripe customer for user ${user.id}`)
    let customer;
    try {
        customer = await stripe.customers.create({ name, email: user.email })
    } catch (error) {
        console.log(error)
        return null
    }
    if (!customer?.id) {
        console.log("empty customer_id from Stripe.")
        return null
    }

    // Save new customer_id to DB as `stripe_id`
    const { error: saveError } = await supabase
        .from('profiles')
        .update({ stripe_id: customer.id })
        .eq('id', user.id)
    if (saveError) { console.log(`Failed to save customer ${customer.id}`) }

    return customer.id ?? null
}

type StripeSubscription = {
    id: string,
    type: "payment" | "setup",
    clientSecret: string,
}

/* Subscribe customer id to a given price and return client secret. */
export async function createStripeSubscription(customerId: string, plan: Plan, promoId?: string): Promise<StripeSubscription | null> {  // eslint-disable-line
    const priceId = planInfo[plan].priceId
    if (!priceId) { return null }

    console.log(`Creating subscription for customer ${customerId}`)
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price: priceId,
            }],
            discounts: [{
                promotion_code: promoId,
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['pending_setup_intent', 'latest_invoice.payment_intent'],
        })
        if (subscription.pending_setup_intent !== null) {
            return {
                id: subscription.id,
                type: "setup",
                clientSecret: subscription.pending_setup_intent.client_secret
            }
        } else {
            return {
                id: subscription.id,
                type: "payment",
                clientSecret: subscription.latest_invoice.payment_intent.client_secret
            }
        }
    } catch (error) {
        console.log(error)
        return null
    }
}


/* Remove old subscriptions. */
export async function removeOtherSubscriptions(customerId: string, keep: string): Promise<boolean> {
    let subscriptions;
    try {
        subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            limit: 3,
        })
    } catch (error) {
        console.log(error)
        return false
    }
    const deleteIds: string[] = subscriptions.data
        .map((obj: any) => obj.id)  // eslint-disable-line
        .filter((id: string) => id != keep)
    const promises = deleteIds.map((id) => stripe.subscriptions.cancel(id))
    try { 
        await Promise.all(promises)
        return true
    } catch (error) {
        return false
    }
}


/* Send minutes transcribed to Stripe. Stripe accepts a maximum of 12 decimals. */
export async function stripeMeterEvent(userId: string, value: number): Promise<boolean> {
    const { customerId, plan } = await getCurrentPlan(userId)
    if (plan != Plan.USAGE) {
        return true
    }
    if (!customerId) { 
        console.log(`Failed to meter ${value} for user ${userId}`)
        return false
    }
    // Only meter on usage plans
    console.log(`Sending meter event of ${value}`)
    await stripe.v2.billing.meterEvents.create({
        event_name: 'hanasu_chat_minutes',
        payload: {
            stripe_customer_id: customerId,
            value: round(value, 12).toString(),
        },
    });
    return true
  }


  export async function unsubscribeUser(user: User): Promise<boolean> {
    const customerId = await stripeCustomer(user)
    if (!customerId) { return false }
    const removed = removeOtherSubscriptions(customerId, "")

    revalidatePath('/account/usage', 'page')
    return removed
  } 