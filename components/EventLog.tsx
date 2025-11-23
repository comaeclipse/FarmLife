'use client';

interface Event {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: Date;
}

interface EventLogProps {
  events: Event[];
}

export function EventLog({ events }: EventLogProps) {
  if (events.length === 0) {
    return (
      <div className="border border-green-700 bg-green-950/30 p-4 rounded">
        <h2 className="text-xl font-bold text-green-400 mb-3">Event Log</h2>
        <p className="text-gray-400 text-sm">No events yet</p>
      </div>
    );
  }

  const getEventEmoji = (type: string) => {
    switch (type) {
      case 'WEATHER':
        return '🌤️';
      case 'VISITOR':
        return '🚶';
      case 'ANIMAL_EVENT':
        return '🐾';
      case 'CROP_EVENT':
        return '🌱';
      case 'MARKET':
        return '💰';
      case 'SPECIAL':
        return '⭐';
      default:
        return '📝';
    }
  };

  return (
    <div className="border border-green-700 bg-green-950/30 p-4 rounded">
      <h2 className="text-xl font-bold text-green-400 mb-3">Event Log</h2>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {events.map((event) => (
          <div key={event.id} className="border border-green-800 bg-green-900/30 p-2 rounded">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getEventEmoji(event.type)}</span>
              <span className="font-bold text-green-300 text-sm">{event.title}</span>
            </div>
            <p className="text-xs text-gray-400">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
