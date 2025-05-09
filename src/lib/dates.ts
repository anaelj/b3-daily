export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`;
};
