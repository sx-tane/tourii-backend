import { DateUtils } from '@app/core/utils/date-utils';
import type { TransformFnParams } from 'class-transformer';

export const TransformDate = {
  /**
   * 'YYYYMMDD' 形式の日付文字列を Date オブジェクトに変換します。
   * 入力文字列が undefined である場合、関数は undefined を返します。
   *
   * @param {TransformFnParams} { value } - 'value' プロパティを含むオブジェクト。
   * @returns {(Date | undefined)} 入力形式が正しい場合は Date オブジェクトを返し、そうでない場合は undefined　または null を返します。
   */
  transformYYYYMMDDToDate({
    value,
  }: TransformFnParams): Date | undefined | null {
    return value === undefined
      ? undefined
      : value === null
        ? null
        : DateUtils.fromYYYYMMDD(value);
  },

  /**
   * 'YYYYMMDDHHmm' 形式の日付文字列を Date オブジェクトに変換します。
   * 入力文字列が undefined である場合、関数は undefined を返します。
   *
   * @param {TransformFnParams} { value } - 'value' プロパティを含むオブジェクト。
   * @returns {(Date | undefined)} 入力形式が正しい場合は Date オブジェクトを返し、そうでない場合は undefined　または null を返します。
   */
  transformYYYYMMDDHHmmToDate({
    value,
  }: TransformFnParams): Date | undefined | null {
    return value === undefined
      ? undefined
      : value === null
        ? null
        : DateUtils.fromYYYYMMDDHHmm(value);
  },

  /**
   * 'YYYYMMDDHHmmss' 形式の日付文字列を Date オブジェクトに変換します。
   * 入力文字列が undefined である場合、関数は undefined を返します。
   *
   * @param {TransformFnParams} { value } - 'value' プロパティを含むオブジェクト。
   * @returns {(Date | undefined)} 入力形式が正しい場合は Date オブジェクトを返し、そうでない場合は undefined　または null を返します。
   */
  transformYYYYMMDDHHmmssToDate({
    value,
  }: TransformFnParams): Date | undefined | null {
    return value === undefined
      ? undefined
      : value === null
        ? null
        : DateUtils.fromYYYYMMDDHHmmss(value);
  },

  /**
   * Date オブジェクトを'YYYYMMDD' 形式の日付文字列に変換します。
   * Date オブジェクトが undefined である場合、関数は undefined を返します。
   * @param {value}
   * @returns {(string | undefined)} 入力形式が正しい場合は'YYYYMMDDHHmm' 形式の日付文字列を返し、そうでない場合は undefinedを返します。
   */
  transformDateToYYYYMMDD(value: Date | undefined): string | undefined {
    return value !== undefined ? DateUtils.formatToYYYYMMDD(value) : undefined;
  },

  /**
   * Date オブジェクトを'YYYYMMDDHHmm' 形式の日付文字列に変換します。
   * Date オブジェクトが undefined である場合、関数は undefined を返します。
   * @param {value}
   * @returns {(string | undefined)} 入力形式が正しい場合は'YYYYMMDDHHmm' 形式の日付文字列を返し、そうでない場合は undefinedを返します。
   */
  transformDateToYYYYMMDDHHmm(value: Date | undefined): string | undefined {
    return value !== undefined
      ? DateUtils.formatToYYYYMMDDHHmm(value)
      : undefined;
  },

  /**
   * Date オブジェクトを'YYYYMMDDHHmmss' 形式の日付文字列に変換します。
   * Date オブジェクトが undefined である場合、関数は undefined を返します。
   * @param {value}
   * @returns {(string | undefined)} 入力形式が正しい場合は'YYYYMMDDHHmmss' 形式の日付文字列を返し、そうでない場合は undefinedを返します。
   */
  transformDateToYYYYMMDDHHmmss(value: Date | undefined): string | undefined {
    return value !== undefined
      ? DateUtils.formatToYYYYMMDDHHmmss(value)
      : undefined;
  },

  /**
   * Date オブジェクトを'YYYYMMDD' 形式のDate型に変換します。
   * Date オブジェクトが undefined である場合、関数は undefined を返します。
   * @param {value}
   * @returns {(Date | undefined)} 入力形式が正しい場合は'YYYYMMDD' 形式の日付文字列を返し、そうでない場合は undefinedを返します。
   */
  transformDateToYYYYMMDDDate(value: Date | undefined): Date | undefined {
    return value !== undefined
      ? DateUtils.formatToYYYYMMDDDate(value)
      : undefined;
  },

  /**
   * Date オブジェクトを'HH:mm' 形式の時刻文字列に変換します。
   * Date オブジェクトが undefined である場合、関数は undefined を返します。
   * @param {value}
   * @returns {(string | undefined)} 入力形式が正しい場合は'YYYYMMDD' 形式の日付文字列を返し、そうでない場合は undefinedを返します。
   */
  transformDateToHHmm(value: Date): string | undefined {
    return value !== undefined ? DateUtils.formatToHHmm(value) : undefined;
  },
} as const;
