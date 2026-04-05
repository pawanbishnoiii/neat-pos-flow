export type Language = 'en' | 'hi';

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.workspace': { en: 'Workspace', hi: 'वर्कस्पेस' },
  'nav.billing': { en: 'Billing', hi: 'बिलिंग' },
  'nav.settings': { en: 'Settings', hi: 'सेटिंग्स' },
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.reports': { en: 'Reports', hi: 'रिपोर्ट्स' },
  'nav.customers': { en: 'Customers', hi: 'ग्राहक' },
  'nav.offers': { en: 'Offers & Coupons', hi: 'ऑफ़र और कूपन' },
  'nav.history': { en: 'Bill History', hi: 'बिल इतिहास' },
  'nav.store': { en: 'Store Manager', hi: 'स्टोर मैनेजर' },
  'nav.expenses': { en: 'Expenses', hi: 'खर्चे' },
  'nav.credit': { en: 'Credit Ledger', hi: 'उधार खाता' },

  // Dashboard
  'dashboard.today_sales': { en: 'Today Sales', hi: 'आज की बिक्री' },
  'dashboard.monthly_sales': { en: 'Monthly Sales', hi: 'मासिक बिक्री' },
  'dashboard.products': { en: 'Products', hi: 'उत्पाद' },
  'dashboard.low_stock': { en: 'Low Stock', hi: 'कम स्टॉक' },
  'dashboard.revenue_week': { en: 'Revenue This Week', hi: 'इस सप्ताह की आय' },
  'dashboard.quick_actions': { en: 'Quick Actions', hi: 'त्वरित कार्य' },
  'dashboard.total_customers': { en: 'Total Customers', hi: 'कुल ग्राहक' },
  'dashboard.invoices': { en: 'Invoices', hi: 'चालान' },
  'dashboard.active_offers': { en: 'Active Offers', hi: 'सक्रिय ऑफ़र' },
  'dashboard.total_expenses': { en: 'Total Expenses', hi: 'कुल खर्चे' },
  'dashboard.outstanding_credit': { en: 'Outstanding Credit', hi: 'बकाया उधार' },

  // Billing
  'billing.new_bill': { en: 'New Bill', hi: 'नया बिल' },
  'billing.cart': { en: 'Cart', hi: 'कार्ट' },
  'billing.payment': { en: 'Payment', hi: 'भुगतान' },
  'billing.cash': { en: 'Cash', hi: 'नकद' },
  'billing.upi': { en: 'UPI', hi: 'यूपीआई' },
  'billing.card': { en: 'Card', hi: 'कार्ड' },
  'billing.total': { en: 'Total', hi: 'कुल' },
  'billing.powered_by': { en: 'Powered by Ezo', hi: 'Ezo द्वारा संचालित' },

  // Customers
  'customers.add': { en: 'Add Customer', hi: 'ग्राहक जोड़ें' },
  'customers.search': { en: 'Search customers...', hi: 'ग्राहक खोजें...' },
  'customers.total_spent': { en: 'Total Spent', hi: 'कुल खर्च' },
  'customers.visits': { en: 'Visits', hi: 'विज़िट' },
  'customers.credit_balance': { en: 'Credit Balance', hi: 'उधार बैलेंस' },

  // Offers
  'offers.new': { en: 'New Offer', hi: 'नया ऑफ़र' },
  'offers.expires': { en: 'Expires', hi: 'समाप्ति' },
  'offers.claims': { en: 'Claims', hi: 'दावे' },
  'offers.active': { en: 'Active', hi: 'सक्रिय' },
  'offers.inactive': { en: 'Inactive', hi: 'निष्क्रिय' },
  'offers.expired': { en: 'Expired', hi: 'समाप्त' },

  // Expenses
  'expenses.add': { en: 'Add Expense', hi: 'खर्चा जोड़ें' },
  'expenses.rent': { en: 'Rent', hi: 'किराया' },
  'expenses.salary': { en: 'Salary', hi: 'वेतन' },
  'expenses.supplies': { en: 'Supplies', hi: 'सामग्री' },
  'expenses.utilities': { en: 'Utilities', hi: 'बिजली-पानी' },
  'expenses.transport': { en: 'Transport', hi: 'परिवहन' },
  'expenses.other': { en: 'Other', hi: 'अन्य' },

  // Common
  'common.save': { en: 'Save', hi: 'सहेजें' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'common.delete': { en: 'Delete', hi: 'हटाएं' },
  'common.edit': { en: 'Edit', hi: 'संपादित' },
  'common.search': { en: 'Search', hi: 'खोजें' },
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'common.no_data': { en: 'No data found', hi: 'कोई डेटा नहीं मिला' },
  'common.back': { en: 'Back', hi: 'वापस' },
  'common.next': { en: 'Next', hi: 'आगे' },
  'common.confirm': { en: 'Confirm', hi: 'पुष्टि करें' },
  'common.logout': { en: 'Logout', hi: 'लॉगआउट' },

  // Onboarding
  'onboarding.title': { en: 'Setup Your Business', hi: 'अपना व्यवसाय सेटअप करें' },
  'onboarding.language': { en: 'Choose Language', hi: 'भाषा चुनें' },
  'onboarding.social': { en: 'Social & WhatsApp', hi: 'सोशल और व्हाट्सएप' },
  'onboarding.skip': { en: 'Skip', hi: 'छोड़ें' },

  // Notifications
  'notifications.title': { en: 'Notifications', hi: 'सूचनाएं' },
  'notifications.mark_read': { en: 'Mark as read', hi: 'पढ़ा हुआ चिह्नित करें' },
  'notifications.clear_all': { en: 'Clear all', hi: 'सब हटाएं' },
  'notifications.empty': { en: 'No notifications', hi: 'कोई सूचना नहीं' },
};

export const t = (key: string, lang: Language = 'en'): string => {
  return translations[key]?.[lang] || translations[key]?.en || key;
};

export const EXPENSE_CATEGORIES = [
  { id: 'rent', label: { en: 'Rent', hi: 'किराया' }, emoji: '🏠' },
  { id: 'salary', label: { en: 'Salary', hi: 'वेतन' }, emoji: '💰' },
  { id: 'supplies', label: { en: 'Supplies', hi: 'सामग्री' }, emoji: '📦' },
  { id: 'utilities', label: { en: 'Utilities', hi: 'बिजली-पानी' }, emoji: '💡' },
  { id: 'transport', label: { en: 'Transport', hi: 'परिवहन' }, emoji: '🚗' },
  { id: 'maintenance', label: { en: 'Maintenance', hi: 'रखरखाव' }, emoji: '🔧' },
  { id: 'marketing', label: { en: 'Marketing', hi: 'मार्केटिंग' }, emoji: '📣' },
  { id: 'food', label: { en: 'Food & Beverages', hi: 'खाना-पीना' }, emoji: '🍔' },
  { id: 'general', label: { en: 'General', hi: 'सामान्य' }, emoji: '📝' },
  { id: 'other', label: { en: 'Other', hi: 'अन्य' }, emoji: '🔹' },
];
