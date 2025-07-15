exports.calculateEndDate = (startDate, durationInYears, durationInDays) => {
  const endDate = new Date(startDate);

  if (durationInYears) {
    endDate.setFullYear(endDate.getFullYear() + durationInYears);
  } else if (durationInDays) {
    endDate.setDate(endDate.getDate() + durationInDays);
  } else {
    throw new Error("No valid duration found");
  }
  return endDate;
};
