/**
 * Validation utilities for e-commerce system
 * Provides comprehensive validation functions for various data types
 */

import { TouriiBackendAppException } from '../../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../../support/exception/tourii-backend-app-error-type';
import { VALIDATION_CONSTANTS, PAYMENT_CONSTANTS } from '../../../constants/ecommerce.constants';
import type { BillingAddressInterface, ShippingAddressInterface, ContactInformation } from '../types/address.types';

/**
 * Validates email format
 * @param email - Email address to validate
 * @throws TouriiBackendAppException - When email format is invalid
 */
export function validateEmail(email: string): void {
    if (!email || typeof email !== 'string') {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }

    if (!VALIDATION_CONSTANTS.EMAIL_PATTERN.test(email.trim())) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }
}

/**
 * Validates phone number format (international E.164)
 * @param phone - Phone number to validate
 * @throws TouriiBackendAppException - When phone format is invalid
 */
export function validatePhone(phone: string): void {
    if (!phone || typeof phone !== 'string') {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }

    if (!VALIDATION_CONSTANTS.PHONE_PATTERN.test(phone.trim())) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }
}

/**
 * Validates currency code against ISO 4217 standards
 * @param currency - Currency code to validate
 * @throws TouriiBackendAppException - When currency is not supported
 */
export function validateCurrency(currency: string): void {
    if (!currency || typeof currency !== 'string') {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_PAYMENT_002);
    }

    const currencyUpper = currency.toUpperCase();
    
    // Check format (3 uppercase letters)
    if (!VALIDATION_CONSTANTS.CURRENCY_CODE_PATTERN.test(currencyUpper)) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_PAYMENT_002);
    }

    // Check if currency is supported
    if (!PAYMENT_CONSTANTS.SUPPORTED_CURRENCIES.includes(currencyUpper as any)) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_PAYMENT_002);
    }
}

/**
 * Validates country code against ISO 3166-1 alpha-2
 * @param countryCode - Country code to validate
 * @throws TouriiBackendAppException - When country code is invalid
 */
export function validateCountryCode(countryCode: string): void {
    if (!countryCode || typeof countryCode !== 'string') {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }

    if (!VALIDATION_CONSTANTS.COUNTRY_CODE_PATTERN.test(countryCode.toUpperCase())) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }
}

/**
 * Validates postal code format based on country
 * @param postalCode - Postal code to validate
 * @param countryCode - Country code for format validation
 * @throws TouriiBackendAppException - When postal code format is invalid
 */
export function validatePostalCode(postalCode: string, countryCode: string): void {
    if (!postalCode || typeof postalCode !== 'string') {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }

    const countryUpper = countryCode.toUpperCase();
    const pattern = VALIDATION_CONSTANTS.POSTAL_CODE_PATTERNS[countryUpper as keyof typeof VALIDATION_CONSTANTS.POSTAL_CODE_PATTERNS];
    
    // If we have a specific pattern for this country, validate against it
    if (pattern && !pattern.test(postalCode.trim())) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }

    // Basic validation for countries without specific patterns
    if (!pattern && (postalCode.trim().length < 3 || postalCode.trim().length > 10)) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }
}

/**
 * Validates billing address
 * @param address - Billing address to validate
 * @throws TouriiBackendAppException - When address is invalid
 */
export function validateBillingAddress(address: BillingAddressInterface): void {
    if (!address || typeof address !== 'object') {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }

    // Validate required fields
    const requiredFields = ['addressLine1', 'city', 'state', 'postalCode', 'countryCode', 'country', 'fullName'];
    for (const field of requiredFields) {
        const value = address[field as keyof BillingAddressInterface];
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
        }
    }

    // Validate specific formats
    validateCountryCode(address.countryCode);
    validatePostalCode(address.postalCode, address.countryCode);

    // Validate field lengths
    if (address.addressLine1.length > VALIDATION_CONSTANTS.MAX_ADDRESS_LENGTH) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }
    if (address.addressLine2 && address.addressLine2.length > VALIDATION_CONSTANTS.MAX_ADDRESS_LENGTH) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }
    if (address.fullName.length > VALIDATION_CONSTANTS.MAX_NAME_LENGTH) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }
}

/**
 * Validates shipping address
 * @param address - Shipping address to validate
 * @throws TouriiBackendAppException - When address is invalid
 */
export function validateShippingAddress(address: ShippingAddressInterface): void {
    if (!address || typeof address !== 'object') {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }

    // Validate required fields
    const requiredFields = ['addressLine1', 'city', 'state', 'postalCode', 'countryCode', 'country', 'recipientName'];
    for (const field of requiredFields) {
        const value = address[field as keyof ShippingAddressInterface];
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
        }
    }

    // Validate specific formats
    validateCountryCode(address.countryCode);
    validatePostalCode(address.postalCode, address.countryCode);

    // Validate field lengths
    if (address.addressLine1.length > VALIDATION_CONSTANTS.MAX_ADDRESS_LENGTH) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }
    if (address.addressLine2 && address.addressLine2.length > VALIDATION_CONSTANTS.MAX_ADDRESS_LENGTH) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }
    if (address.recipientName.length > VALIDATION_CONSTANTS.MAX_NAME_LENGTH) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }

    // Validate optional phone number if provided
    if (address.deliveryPhone) {
        validatePhone(address.deliveryPhone);
    }
}

/**
 * Validates contact information
 * @param contact - Contact information to validate
 * @throws TouriiBackendAppException - When contact info is invalid
 */
export function validateContactInformation(contact: ContactInformation): void {
    if (!contact || typeof contact !== 'object') {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_005);
    }

    // Email is required
    validateEmail(contact.email);

    // Phone is optional but must be valid if provided
    if (contact.phone) {
        validatePhone(contact.phone);
    }
}

/**
 * Validates order amounts
 * @param amount - Amount to validate (in cents)
 * @throws TouriiBackendAppException - When amount is invalid
 */
export function validateOrderAmount(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_003);
    }

    if (amount <= 0) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_003);
    }

    if (amount > PAYMENT_CONSTANTS.MAX_PAYMENT_AMOUNT) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_PAYMENT_003);
    }
}