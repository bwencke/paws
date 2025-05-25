export function formatPhoneNumber(phoneNumber: string | null | undefined): string {
  if (!phoneNumber) return '';
  
  // Strip all non-digits
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX if 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
  }
  
  // Format as XXX-XXXX if 7 digits
  if (cleaned.length === 7) {
    return `${cleaned.slice(0,3)}-${cleaned.slice(3)}`;
  }
  
  // Return cleaned number if not 7 or 10 digits
  return cleaned;
} 