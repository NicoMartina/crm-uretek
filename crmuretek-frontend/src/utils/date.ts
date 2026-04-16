export const formatDisplayDate = (date?: string | null) => {
  if (!date) {
    return "Sin fecha";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}-${month}-${year}`;
};
