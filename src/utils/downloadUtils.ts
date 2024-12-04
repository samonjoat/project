export const downloadFile = (content: string | Blob, filename: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const formatLogs = (logs: string[]): string => {
  return logs.join('\n');
};