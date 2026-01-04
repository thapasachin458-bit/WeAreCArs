'use server';

/**
 * @fileOverview A flow that forecasts fleet needs and suggests investment strategies.
 *
 * - forecastFleetNeeds - A function that forecasts fleet needs and suggests investment strategies.
 * - FleetForecastingInput - The input type for the forecastFleetNeeds function.
 * - FleetForecastingOutput - The return type for the forecastFleetNeeds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FleetForecastingInputSchema = z.object({
  activeBookings: z
    .number()
    .describe('The number of currently active car rental bookings.'),
});
export type FleetForecastingInput = z.infer<typeof FleetForecastingInputSchema>;

const FleetForecastingOutputSchema = z.object({
  projectedCarNeeds: z
    .string()
    .describe(
      'An estimate of the number of cars needed in the next month, considering current bookings and trends.'
    ),
  investmentSuggestion: z
    .string()
    .describe(
      'A suggestion on whether fleet growth would be a good investment, based on the projected car needs.'
    ),
});
export type FleetForecastingOutput = z.infer<typeof FleetForecastingOutputSchema>;

export async function forecastFleetNeeds(
  input: FleetForecastingInput
): Promise<FleetForecastingOutput> {
  return forecastFleetNeedsFlow(input);
}

const fleetForecastingPrompt = ai.definePrompt({
  name: 'fleetForecastingPrompt',
  input: {schema: FleetForecastingInputSchema},
  output: {schema: FleetForecastingOutputSchema},
  prompt: `You are an expert in car rental fleet management.
Given the current number of active bookings, estimate the number of cars the company will need in the next month and suggest whether fleet growth would be a good investment.

Active Bookings: {{{activeBookings}}}

Consider factors like seasonal trends and potential increase in demand.
`,
});

const forecastFleetNeedsFlow = ai.defineFlow(
  {
    name: 'forecastFleetNeedsFlow',
    inputSchema: FleetForecastingInputSchema,
    outputSchema: FleetForecastingOutputSchema,
  },
  async input => {
    const {output} = await fleetForecastingPrompt(input);
    return output!;
  }
);
