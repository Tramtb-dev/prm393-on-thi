import { useCallback, useEffect, useState } from 'react';
import type { ProgressState } from '../types';
import { clearProgress, defaultProgress, loadProgress, saveProgress, withStreakUpdate } from '../lib/storage';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const recordAnswer = useCallback((key: string, correct: boolean) => {
    setProgress((prev) => {
      const mistakes = { ...prev.mistakes };
      if (correct) {
        delete mistakes[key];
      } else {
        mistakes[key] = true;
      }
      return {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        mistakes,
        ...withStreakUpdate(prev),
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    clearProgress();
    setProgress(defaultProgress());
  }, []);

  return { progress, recordAnswer, resetProgress };
}
