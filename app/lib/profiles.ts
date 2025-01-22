'use server'

import { User } from "@supabase/auth-js";
import { stripeCustomer, createStripeSubscription, removeOtherSubscriptions } from "@/app/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database.types";
import { revalidatePath } from "next/cache";
import { Plan, planFromPriceId, planInfo } from "@/app/lib/data";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)  // eslint-disable-line

type SubscribeUserResponse = {
    clientSecret: string,
    type: "payment" | "setup",
}

/** Subscribe a user onto the plan! 
 * 
 * Get customer id, price id and create subscription. Remove old subscriptions.
*/
export async function subscribeUser(user: User, plan: Plan): Promise<SubscribeUserResponse | null> {
    const customerId = await stripeCustomer(user)
    if (!customerId) { return null }

    const priceId = planInfo[plan].priceId
    if (!priceId) { return null }

    const subscription = await createStripeSubscription(customerId, priceId)
    if (!subscription) { return null }

    const cleanedUp = await removeOtherSubscriptions(customerId, subscription.id)
    if (!cleanedUp) { console.log(`Failed to remove old subscriptions for customer ${customerId}`) }

    return {
        clientSecret: subscription.clientSecret,
        type: subscription.type,
    }
}

type CurrentPlanResponse = {
    plan: Plan,
    customerId?: string,
}

/* Use the Stripe customer's subscriptions to determine their current Plan. */
export async function getCurrentPlan(userId?: string): Promise<CurrentPlanResponse> {
    if (!userId) { return { plan: Plan.FREE } }
    const profile = await selectProfile(userId)
    if (!profile?.stripe_id) { return { plan: Plan.FREE } }
    const customerId = profile.stripe_id

    let subscriptions;
    try {
        subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1,
        })
    } catch (error) {
        return {
            plan: Plan.FREE
        }
    }
    const priceId = subscriptions.data?.[0]?.items?.data?.[0]?.price?.id
    return { 
        plan: planFromPriceId(priceId),
        customerId: customerId,
    }
}

/** Check upcoming invoice from Stripe for user's upcomingCost. */
export async function upcomingCost(userId: string): Promise<number | null> {
    const { customerId } = await getCurrentPlan(userId)
    if (!customerId) { return null }

    let invoice;
    try {
        invoice = await stripe.invoices.retrieveUpcoming({
            customer: customerId
        })
    } catch (error) {
        return null
    }
    return invoice.total
}

export async function selectProfile(userId: string | undefined): Promise<Tables<'profiles'> | null> {
    if (!userId) { return null }
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    if (!data) {
        console.log(error)
        return null
    } else {
        return data
    }
}

export async function updateProfile(profile: Tables<'profiles'>): Promise<boolean> {
    const supabase = await createClient()
    const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id)
    if (error) {
        console.log(error)
        return false
    } else {
        revalidatePath("/dashboard");
        return true
    }
}