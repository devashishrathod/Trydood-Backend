const { VOUCHER_STATUS } = require("../../constants");

exports.validateVoucherDatesAndStatus = (
  status,
  publishedDate,
  validFrom,
  validTill
) => {
  if (!status) return "Voucher status is required.";
  const now = new Date();

  const pubDate = publishedDate ? new Date(publishedDate) : null;
  const start = validFrom ? new Date(validFrom) : null;
  const end = validTill ? new Date(validTill) : null;

  if (
    (pubDate && isNaN(pubDate)) ||
    (start && isNaN(start)) ||
    (end && isNaN(end))
  ) {
    return "One or more provided dates are invalid.";
  }
  if (start && end && end <= start) {
    return "Valid till date must be after valid from date.";
  }

  switch (status) {
    case VOUCHER_STATUS.DRAFT:
      if (pubDate && pubDate <= now)
        return "Draft cannot have a published date in the past.";
      if (start && start <= now)
        return "Draft cannot have a valid from date in the past.";
      if (end && end <= now)
        return "Draft cannot have a valid till date in the past.";
      return null;

    case VOUCHER_STATUS.COMPLETED:
      if (!end || end > now)
        return "Completed vouchers must have a valid till date in the past.";
      return null;

    case VOUCHER_STATUS.ACTIVE:
      if (!pubDate || pubDate > now)
        return "Active voucher must have published date in the past.";
      if (!start || start > now)
        return "Active voucher must have valid from in the past.";
      if (!end || end < now) return "Active voucher must not be expired.";
      return null;

    case VOUCHER_STATUS.EXPIRED:
      if (!end || end > now)
        return "Expired vouchers must have valid till in the past.";
      return null;

    case VOUCHER_STATUS.USED_UP:
      if (!pubDate || pubDate > now)
        return "Used-up voucher must be already published.";
      if (!start || start > now)
        return "Used-up voucher must already be valid.";
      if (!end || end < now) return "Used-up voucher must not be expired.";
      return null;

    case VOUCHER_STATUS.UPCOMING:
      if (!pubDate || pubDate <= now)
        return "Upcoming voucher must have a future published date.";
      if (!start || start <= now)
        return "Upcoming voucher must have future valid from.";
      if (!end || end <= start)
        return "Upcoming voucher must have valid till after valid from.";
      return null;

    case VOUCHER_STATUS.DELETED:
      return null;

    default:
      return "Invalid voucher status.";
  }
};
