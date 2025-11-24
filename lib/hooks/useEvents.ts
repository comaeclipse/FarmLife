import { useState, useCallback } from 'react';
import type { FarmEvent } from '@/types';
import { RANDOM_EVENTS } from '@/config';

export function useEvents(initialEvent?: FarmEvent) {
  const [activeEvent, setActiveEvent] = useState<FarmEvent | undefined>(initialEvent);

  const triggerRandomEvent = useCallback(() => {
    // 20% chance of random event
    if (Math.random() < 0.2 && RANDOM_EVENTS.length > 0) {
      const randomEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setActiveEvent(randomEvent);
      return randomEvent;
    }
    return undefined;
  }, []);

  const clearEvent = useCallback(() => {
    setActiveEvent(undefined);
  }, []);

  const setEventDirectly = useCallback((event: FarmEvent | undefined) => {
    setActiveEvent(event);
  }, []);

  return {
    activeEvent,
    triggerRandomEvent,
    clearEvent,
    setEventDirectly
  };
}
