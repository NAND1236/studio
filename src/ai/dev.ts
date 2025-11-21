import { config } from 'dotenv';
config();

import '@/ai/flows/generate-daily-meal-plan.ts';
import '@/ai/flows/suggest-alternate-meals.ts';