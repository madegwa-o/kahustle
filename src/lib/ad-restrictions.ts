import { Types } from "mongoose";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { MembershipPlan } from "@/models/MembershipPlan";
import { connectToDatabase } from "@/lib/db";

export enum PostingRestrictionReason {
    FREE_LIMIT_EXCEEDED = "FREE_LIMIT_EXCEEDED",
    NO_SUBSCRIPTION_FOR_CATEGORY = "NO_SUBSCRIPTION_FOR_CATEGORY",
    SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",
    VALID = "VALID",
}

interface PostingCheckResult {
    allowed: boolean;
    reason: PostingRestrictionReason;
    currentAdCount: number;
    maxAdCount: number;
    message: string;
}

const FREE_USER_AD_LIMIT = 3;

/**
 * Check if a user is allowed to post an ad in a specific category
 */
export async function canUserPostAd(
    userId: Types.ObjectId | string,
    category: string
): Promise<PostingCheckResult> {
    try {
        await connectToDatabase();

        const user = await User.findById(userId);
        if (!user) {
            return {
                allowed: false,
                reason: PostingRestrictionReason.VALID,
                currentAdCount: 0,
                maxAdCount: 0,
                message: "User not found",
            };
        }

        // Check if user has any active subscriptions
        const now = new Date();
        const activeSubscriptions = await MembershipPlan.find({
            userId,
            status: "active",
            endDate: { $gt: now },
        });

        // Free user (no subscriptions)
        if (activeSubscriptions.length === 0) {
            const activeAdCount = await Product.countDocuments({
                userId,
                status: "active",
            });

            if (activeAdCount >= FREE_USER_AD_LIMIT) {
                return {
                    allowed: false,
                    reason: PostingRestrictionReason.FREE_LIMIT_EXCEEDED,
                    currentAdCount: activeAdCount,
                    maxAdCount: FREE_USER_AD_LIMIT,
                    message: `Free users can only post ${FREE_USER_AD_LIMIT} ads. You have reached the limit.`,
                };
            }

            return {
                allowed: true,
                reason: PostingRestrictionReason.VALID,
                currentAdCount: activeAdCount,
                maxAdCount: FREE_USER_AD_LIMIT,
                message: `You can post ${FREE_USER_AD_LIMIT - activeAdCount} more ads with your free account.`,
            };
        }

        // Subscribed user - check if they have subscription for the category
        const categorySubscription = activeSubscriptions.find(
            (sub) => sub.category.toLowerCase() === category.toLowerCase()
        );

        if (!categorySubscription) {
            return {
                allowed: false,
                reason: PostingRestrictionReason.NO_SUBSCRIPTION_FOR_CATEGORY,
                currentAdCount: 0,
                maxAdCount: 0,
                message: `You need a subscription for the "${category}" category to post ads in it.`,
            };
        }

        // Check if subscription is still valid
        if (new Date(categorySubscription.endDate) <= now) {
            return {
                allowed: false,
                reason: PostingRestrictionReason.SUBSCRIPTION_EXPIRED,
                currentAdCount: 0,
                maxAdCount: 0,
                message: "Your subscription for this category has expired. Please renew to continue posting.",
            };
        }

        // Subscribed user with valid subscription - allow unlimited posting
        return {
            allowed: true,
            reason: PostingRestrictionReason.VALID,
            currentAdCount: 0,
            maxAdCount: -1, // -1 means unlimited
            message: "You can post unlimited ads with your active subscription.",
        };
    } catch (error) {
        console.error("Error checking posting restrictions:", error);
        return {
            allowed: false,
            reason: PostingRestrictionReason.VALID,
            currentAdCount: 0,
            maxAdCount: 0,
            message: "An error occurred while checking posting restrictions.",
        };
    }
}

/**
 * Get user's subscription info for a category
 */
export async function getUserSubscriptionInfo(
    userId: Types.ObjectId | string,
    category: string
) {
    try {
        await connectDB();

        const now = new Date();
        const subscription = await MembershipPlan.findOne({
            userId,
            category,
            status: "active",
            endDate: { $gt: now },
        });

        if (!subscription) {
            return null;
        }

        const daysRemaining = Math.ceil(
            (new Date(subscription.endDate).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        return {
            planType: subscription.planType,
            category: subscription.category,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            daysRemaining,
            price: subscription.price,
            discountApplied: subscription.discountApplied,
        };
    } catch (error) {
        console.error("Error getting subscription info:", error);
        return null;
    }
}

/**
 * Get all active subscriptions for a user
 */
export async function getUserSubscriptions(userId: Types.ObjectId | string) {
    try {
        await connectDB();

        const now = new Date();
        const subscriptions = await MembershipPlan.find({
            userId,
            status: "active",
            endDate: { $gt: now },
        }).sort({ endDate: -1 });

        return subscriptions.map((sub) => ({
            id: sub._id,
            planType: sub.planType,
            category: sub.category,
            startDate: sub.startDate,
            endDate: sub.endDate,
            daysRemaining: Math.ceil(
                (new Date(sub.endDate).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            price: sub.price,
            discountApplied: sub.discountApplied,
        }));
    } catch (error) {
        console.error("Error getting subscriptions:", error);
        return [];
    }
}
