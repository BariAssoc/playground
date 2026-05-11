/**
 * day1Onboarding — §8 Day-1 Onboarding Spine.
 *
 * 6 steps. Each step gets one video (clickable from CosmosDB).
 * Card rule: Day 1 starts with TWO cards, not one. Either or both may be
 * education cards.
 */

import { DAY1_SPINE, type Day1Step } from '../canon/constants.js';

export interface Day1State {
  currentStep: number;
  completed: number[];
  skipped: number[];
}

export const DAY1_INITIAL: Day1State = {
  currentStep: 1,
  completed: [],
  skipped: [],
};

export function day1Step(n: number): Day1Step | undefined {
  return DAY1_SPINE.find((s) => s.step === n);
}

export function day1Advance(state: Day1State): Day1State {
  if (state.currentStep >= DAY1_SPINE.length) return state;
  return {
    ...state,
    completed: [...state.completed, state.currentStep],
    currentStep: state.currentStep + 1,
  };
}

export function day1Skip(state: Day1State): Day1State {
  if (state.currentStep >= DAY1_SPINE.length) return state;
  return {
    ...state,
    skipped: [...state.skipped, state.currentStep],
    currentStep: state.currentStep + 1,
  };
}

export function day1IsComplete(state: Day1State): boolean {
  return state.currentStep > DAY1_SPINE.length;
}

export { DAY1_SPINE };
