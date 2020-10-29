const DateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
};

export function FormatDate(date: Date) {
    return date.toLocaleDateString("en-US", DateOptions);
}

export function suspicious(date: Date) {
    return date.getTime() > new Date().getTime() - 8.64e7;
}
