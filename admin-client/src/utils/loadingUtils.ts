// Utility to ensure minimum loading time for better UX
export const withMinimumLoadTime = async <T,>(
    promise: Promise<T>,
    minimumMs: number = 2000
): Promise<T> => {
    const start = Date.now();
    const result = await promise;
    const elapsed = Date.now() - start;
    const remaining = minimumMs - elapsed;

    if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
    }

    return result;
};
