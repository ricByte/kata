export const transformDateForDB = (date: Date): string => {
    return date.toISOString();
};

export const transformDateFromDB = (date: string): Date => {
    return new Date(date);
};
