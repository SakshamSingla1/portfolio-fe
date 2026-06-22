import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

const URLS = {
    PAGE:        "/landing/page",
    CONFIG:      "/landing/config",
    FEATURES:    "/landing/features",
    FEATURE_ID:  "/landing/features/:id",
    FAQS:        "/landing/faqs",
    FAQ_ID:      "/landing/faqs/:id",
    STEPS:       "/landing/steps",
    STEP_ID:     "/landing/steps/:id",
    AUDIENCE:    "/landing/audience",
    AUDIENCE_ID: "/landing/audience/:id",
    TESTIMONIALS:   "/landing/testimonials",
    TESTIMONIAL_ID: "/landing/testimonials/:id",
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LandingConfig {
    id?: number;
    heroEyebrow: string;
    heroHeadline1: string;
    heroHeadline2: string;
    heroDescription: string;
    heroPrimaryCtaText: string;
    heroSecondaryCtaText: string;
    heroTrustBadges: string[];
    ctaBadgeText: string;
    ctaHeadline: string;
    ctaDescription: string;
    ctaButtonText: string;
    ctaTrustPoints: string[];
}

export interface LandingFeature {
    id?: number;
    iconName: string;
    colorKey: string;
    title: string;
    description: string;
    sortOrder: number;
    isActive: boolean;
}

export interface LandingFaq {
    id?: number;
    question: string;
    answer: string;
    sortOrder: number;
    isActive: boolean;
}

export interface LandingStep {
    id?: number;
    stepNumber: string;
    iconName: string;
    colorKey: string;
    title: string;
    bullets: string[];
    sortOrder: number;
    isActive: boolean;
}

export interface LandingAudienceCard {
    id?: number;
    iconName: string;
    colorKey: string;
    title: string;
    description: string;
    sortOrder: number;
    isActive: boolean;
}

export interface LandingTestimonial {
    id?: number;
    authorName: string;
    authorRole: string;
    authorCompany: string;
    avatarUrl: string;
    content: string;
    linkedinUrl: string;
    sortOrder: number;
    isActive: boolean;
}

export interface LandingPageData {
    config: LandingConfig | null;
    features: LandingFeature[];
    faqs: LandingFaq[];
    steps: LandingStep[];
    audienceCards: LandingAudienceCard[];
    testimonials: LandingTestimonial[];
}

// ── Service ───────────────────────────────────────────────────────────────────

export const useLandingPageService = () => {
    const { user } = useAuthenticatedUser();

    // Public
    const getPage = () => request(API_METHOD.GET, URLS.PAGE, null, null);

    // Config
    const getConfig  = ()                          => request(API_METHOD.GET, URLS.CONFIG, user, null);
    const updateConfig = (data: LandingConfig)     => request(API_METHOD.PUT, URLS.CONFIG, user, data);

    // Features
    const getFeatures      = ()                                  => request(API_METHOD.GET,    URLS.FEATURES, user, null);
    const createFeature    = (data: LandingFeature)              => request(API_METHOD.POST,   URLS.FEATURES, user, data);
    const updateFeature    = (id: number, data: LandingFeature)  => request(API_METHOD.PUT,    replaceUrlParams(URLS.FEATURE_ID, { id }), user, data);
    const deleteFeature    = (id: number)                        => request(API_METHOD.DELETE, replaceUrlParams(URLS.FEATURE_ID, { id }), user, null);

    // FAQs
    const getFaqs     = ()                              => request(API_METHOD.GET,    URLS.FAQS, user, null);
    const createFaq   = (data: LandingFaq)              => request(API_METHOD.POST,   URLS.FAQS, user, data);
    const updateFaq   = (id: number, data: LandingFaq)  => request(API_METHOD.PUT,    replaceUrlParams(URLS.FAQ_ID, { id }), user, data);
    const deleteFaq   = (id: number)                    => request(API_METHOD.DELETE, replaceUrlParams(URLS.FAQ_ID, { id }), user, null);

    // Steps
    const getSteps     = ()                               => request(API_METHOD.GET,    URLS.STEPS, user, null);
    const createStep   = (data: LandingStep)              => request(API_METHOD.POST,   URLS.STEPS, user, data);
    const updateStep   = (id: number, data: LandingStep)  => request(API_METHOD.PUT,    replaceUrlParams(URLS.STEP_ID, { id }), user, data);
    const deleteStep   = (id: number)                     => request(API_METHOD.DELETE, replaceUrlParams(URLS.STEP_ID, { id }), user, null);

    // Audience Cards
    const getAudienceCards    = ()                                       => request(API_METHOD.GET,    URLS.AUDIENCE, user, null);
    const createAudienceCard  = (data: LandingAudienceCard)              => request(API_METHOD.POST,   URLS.AUDIENCE, user, data);
    const updateAudienceCard  = (id: number, data: LandingAudienceCard)  => request(API_METHOD.PUT,    replaceUrlParams(URLS.AUDIENCE_ID, { id }), user, data);
    const deleteAudienceCard  = (id: number)                             => request(API_METHOD.DELETE, replaceUrlParams(URLS.AUDIENCE_ID, { id }), user, null);

    // Testimonials
    const getTestimonials    = ()                                         => request(API_METHOD.GET,    URLS.TESTIMONIALS, user, null);
    const createTestimonial  = (data: LandingTestimonial)                 => request(API_METHOD.POST,   URLS.TESTIMONIALS, user, data);
    const updateTestimonial  = (id: number, data: LandingTestimonial)     => request(API_METHOD.PUT,    replaceUrlParams(URLS.TESTIMONIAL_ID, { id }), user, data);
    const deleteTestimonial  = (id: number)                               => request(API_METHOD.DELETE, replaceUrlParams(URLS.TESTIMONIAL_ID, { id }), user, null);

    return {
        getPage,
        getConfig, updateConfig,
        getFeatures, createFeature, updateFeature, deleteFeature,
        getFaqs, createFaq, updateFaq, deleteFaq,
        getSteps, createStep, updateStep, deleteStep,
        getAudienceCards, createAudienceCard, updateAudienceCard, deleteAudienceCard,
        getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
    };
};

export default useLandingPageService;
