import { useEffect, useRef, useState } from 'react';

/**
 * 自动保存Hook
 * @param {Function} saveFn - 保存函数
 * @param {any} data - 需要保存的数据
 * @param {number} delay - 延迟时间（毫秒），默认30秒
 */
export const useAutoSave = (saveFn, data, delay = 30000) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef(null);
  const lastDataRef = useRef(data);

  useEffect(() => {
    // 检查数据是否发生变化
    const dataChanged = JSON.stringify(data) !== JSON.stringify(lastDataRef.current);

    if (!dataChanged) {
      return;
    }

    // 清除之前的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 设置新的定时器
    timerRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await saveFn(data);
        setLastSaved(new Date());
        lastDataRef.current = data;
      } catch (error) {
        console.error('自动保存失败:', error);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    // 清理函数
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data, delay, saveFn]);

  // 手动触发保存
  const triggerSave = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    try {
      setIsSaving(true);
      await saveFn(data);
      setLastSaved(new Date());
      lastDataRef.current = data;
    } catch (error) {
      console.error('手动保存失败:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    lastSaved,
    isSaving,
    triggerSave
  };
};
