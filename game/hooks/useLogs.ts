import { useState, useCallback } from 'react';
import type { LogEntry } from '@/types';
import { uid } from '@/utils';

export function useLogs(initialLogs: LogEntry[] = []) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info', day: number) => {
    setLogs(prev => [...prev, { id: uid(), day, message, type }].slice(-100));
  }, []);

  const setLogsDirectly = useCallback((newLogs: LogEntry[]) => {
    setLogs(newLogs);
  }, []);

  return {
    logs,
    addLog,
    setLogsDirectly
  };
}
