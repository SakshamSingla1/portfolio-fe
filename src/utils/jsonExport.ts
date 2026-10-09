/** Builds a JSON file from arbitrary data and triggers a browser download — no server
 * round-trip. Mirrors exportToCsv's Blob-download shape (csvExport.ts). */
export const exportToJson = (filename: string, data: unknown): void => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".json") ? filename : `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
