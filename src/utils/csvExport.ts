const escapeCsvValue = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const s = String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Builds a CSV from row objects and triggers a browser download — no server round-trip. */
export const exportToCsv = (filename: string, rows: Record<string, unknown>[]): void => {
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const lines = [
        headers.join(","),
        ...rows.map((row) => headers.map((h) => escapeCsvValue(row[h])).join(",")),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
