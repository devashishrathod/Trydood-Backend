module.exports = {
  ROLES: Object.freeze({
    ADMIN: "admin",
    USER: "user",
    VENDOR: "vendor",
    SUB_VENDOR: "subVendor",
    MARKETER: "marketer",
  }),

  PLATFORMS: Object.freeze({
    WEB: "web", // Vendor app
    ANDROID: "android", // Customer app
    IOS: "ios",
  }),

  BANK_ACCOUNT_TYPES: Object.freeze({
    JOINT: "joint",
    SAVINGS: "savings",
    CURRENT: "current",
    SALARY: "salary",
    FIXED_DEPOSIT: "fixed_deposit",
    NRE: "nre", // Non-Resident External
    NRO: "nro", // Non-Resident Ordinary
    OTHER: "other",
  }),

  PAYMENT_STATUS: Object.freeze({
    CREATED: "created",
    AUTHORIZED: "authorized",
    CAPTURED: "captured",
    FAILED: "failed",
  }),

  PAYMENT_METHODS: Object.freeze({
    CARD: "card",
    NETBANKING: "netbanking",
    UPI: "upi",
    WALLET: "wallet",
    PAYLATER: "paylater",
    EMI: "emi",
    COD: "cod",
    BANK_TRANSFER: "bank_transfer",
    CARDLESS_EMI: "cardless_emi",
  }),

  WALLET_PROVIDERS: Object.freeze([
    "paytm",
    "phonepe",
    "amazonpay",
    "mobikwik",
    "freecharge",
    "jiomoney",
    "olamoney",
    "airtelmoney",
  ]),

  VOUCHER_TYPES: Object.freeze({
    PERCENTAGE: "percentage",
    FLAT: "flat",
    CASHBACK: "cashback",
  }),

  VOUCHER_STATUS: Object.freeze({
    DRAFT: "draft",
    COMPLETED: "completed",
    ACTIVE: "active",
    INACTIVE: "inactive",
    EXPIRED: "expired",
    USED_UP: "used_up",
    UPCOMING: "upcoming",
    DELETED: "deleted",
  }),

  ZIP_CODE_REGEX_MAP: Object.freeze({
    IN: /^[1-9][0-9]{5}$/, // India (6 digits)
    US: /^\d{5}(-\d{4})?$/, // USA (ZIP or ZIP+4)
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // Canada (A1A 1A1)
    UK: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, // United Kingdom (SW1A 1AA)
    AU: /^\d{4}$/, // Australia (4 digits)
    DE: /^\d{5}$/, // Germany
    FR: /^\d{5}$/, // France
    IT: /^\d{5}$/, // Italy
    ES: /^\d{5}$/, // Spain
    BR: /^\d{5}-?\d{3}$/, // Brazil (12345-678 or 12345678)
    RU: /^\d{6}$/, // Russia
  }),

  COUNTRY_NAME_TO_ISO: Object.freeze({
    india: "IN",
    unitedstates: "US",
    usa: "US",
    canada: "CA",
    uk: "UK",
    unitedkingdom: "UK",
    australia: "AU",
    germany: "DE",
    france: "FR",
    italy: "IT",
    spain: "ES",
    brazil: "BR",
    russia: "RU",
  }),

  DefaultImages: Object.freeze({
    profileUrl:
      "https://res.cloudinary.com/dbrkf1j5w/image/upload/v1750941792/male-avatar_i8f9mx.png",
  }),
};
