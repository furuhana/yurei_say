import { GuestEntry } from '../types';

const API_URL = '/api/guestbook';

// MOCK DATA for Preview Mode
const MOCK_DATA: GuestEntry[] = [
  { id: '1', name: 'TimeTraveler_01', message: 'The train is late in my timeline.', date: '公元3033年', oc: 'Cyborg Historian' },
  { id: '2', name: 'LostSoul', message: 'Is this the stop for the Void?', date: 'The Void', oc: 'Ghost' },
  { id: '3', name: 'RetroFan', message: 'Love the static noise.', date: '1999-12-31', oc: '' },
];

export const fetchMessages = async (): Promise<GuestEntry[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      if (response.status === 404) {
        return MOCK_DATA;
      }
      throw new Error('Failed to fetch messages');
    }
    return await response.json();
  } catch (error) {
    return MOCK_DATA;
  }
};

export const postMessage = async (name: string, message: string, date: string, oc: string): Promise<void> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, message, date, oc }),
    });

    if (!response.ok) {
       if (response.status === 404) {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        return;
      }
      throw new Error('Failed to post message');
    }
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 800));
  }
};