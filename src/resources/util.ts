export const transformDateForDB = (date: Date): number => {
    return date.getTime();
};

export const transformDateFromDB = (date: string | number): Date => {
    return new Date(date);
};
