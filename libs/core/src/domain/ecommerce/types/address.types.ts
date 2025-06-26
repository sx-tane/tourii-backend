/**
 * Address types for e-commerce system
 * Provides type-safe interfaces for billing and shipping addresses
 */

export interface AddressInterface {
    /** Street address line 1 */
    addressLine1: string;
    /** Street address line 2 (optional) */
    addressLine2?: string;
    /** City name */
    city: string;
    /** State/Province/Region */
    state: string;
    /** Postal/ZIP code */
    postalCode: string;
    /** Country code (ISO 3166-1 alpha-2) */
    countryCode: string;
    /** Full country name */
    country: string;
}

export interface BillingAddressInterface extends AddressInterface {
    /** Billing contact name */
    fullName: string;
    /** Company name (optional) */
    company?: string;
    /** Tax ID or VAT number (optional) */
    taxId?: string;
}

export interface ShippingAddressInterface extends AddressInterface {
    /** Recipient full name */
    recipientName: string;
    /** Company name (optional) */
    company?: string;
    /** Special delivery instructions */
    deliveryInstructions?: string;
    /** Phone number for delivery contact */
    deliveryPhone?: string;
}

export interface ContactInformation {
    /** Customer email address */
    email: string;
    /** Customer phone number (international format) */
    phone?: string;
    /** Preferred contact method */
    preferredContactMethod?: 'email' | 'phone' | 'sms';
}

// Type guards for runtime validation
export function isBillingAddress(address: any): address is BillingAddressInterface {
    return (
        address &&
        typeof address === 'object' &&
        typeof address.addressLine1 === 'string' &&
        typeof address.city === 'string' &&
        typeof address.state === 'string' &&
        typeof address.postalCode === 'string' &&
        typeof address.countryCode === 'string' &&
        typeof address.country === 'string' &&
        typeof address.fullName === 'string'
    );
}

export function isShippingAddress(address: any): address is ShippingAddressInterface {
    return (
        address &&
        typeof address === 'object' &&
        typeof address.addressLine1 === 'string' &&
        typeof address.city === 'string' &&
        typeof address.state === 'string' &&
        typeof address.postalCode === 'string' &&
        typeof address.countryCode === 'string' &&
        typeof address.country === 'string' &&
        typeof address.recipientName === 'string'
    );
}

export function isContactInformation(contact: any): contact is ContactInformation {
    return (
        contact &&
        typeof contact === 'object' &&
        typeof contact.email === 'string' &&
        (contact.phone === undefined || typeof contact.phone === 'string')
    );
}

// Validation helpers
export function validateAddress(address: AddressInterface): boolean {
    return !!(
        address.addressLine1?.trim() &&
        address.city?.trim() &&
        address.state?.trim() &&
        address.postalCode?.trim() &&
        address.countryCode?.trim() &&
        address.country?.trim()
    );
}

export function validateContactInformation(contact: ContactInformation): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    
    return !!(
        contact.email?.trim() &&
        emailPattern.test(contact.email) &&
        (!contact.phone || phonePattern.test(contact.phone))
    );
}