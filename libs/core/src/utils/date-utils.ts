import dayjs, { type OpUnitType } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { TouriiBackendAppErrorType } from '../support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '../support/exception/tourii-backend-app-exception';

const ASIA_TOKYO_TIMEZONE = 'Asia/Tokyo';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(ASIA_TOKYO_TIMEZONE);

dayjs.locale('ja', {
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
});
// FIXME: day.jsのparse時にformat指定
export const DateUtils = {
    /**
     * JSTの現在日時を取得する
     *
     * @returns {Date} JSTの現在日時
     */
    getJSTDate(): Date {
        return DateUtils.fromYYYYMMDDHHmm(
            dayjs.utc().tz(ASIA_TOKYO_TIMEZONE).format('YYYYMMDD HH:mm'),
        );
    },

    /**
     * JSTの現在日時を取得する (秒まで)
     *
     * @returns {Date} JSTの現在日時(秒まで)
     */
    getJSTDateTimeSeconds(): Date {
        return DateUtils.fromYYYYMMDDHHmmss(
            dayjs.utc().tz(ASIA_TOKYO_TIMEZONE).format('YYYYMMDD HH:mm:ss'),
        );
    },

    /**
     * Date型をDate型のYYYYMMDDに変換する
     *
     * @param {Date} date 日時
     * @returns {Date} YYYYMMDDフォーマットのDate型
     */
    formatToYYYYMMDDDate(date: Date): Date {
        // YYYYMMDDのstring型に変換
        const yyyymmddString = dayjs.utc(date).format('YYYYMMDD');

        // YYYYMMDDをDateオブジェクトに変換
        return new Date(dayjs.utc(yyyymmddString, 'YYYYMMDD').toDate());
    },

    /**
     * Date型をDate型のYYYYMMDD HH:mm:ssに変換する
     *
     * @param {Date} date 日時
     * @returns {Date} YYYYMMDD HH:mm:ssフォーマットのDate型
     */
    formatToYYYYMMDDHHmmssDate(date: Date): Date {
        // YYYYMMDD HH:mm:ssのstring型に変換
        const yyyymmddhhmmssString = dayjs
            .utc(date)
            .format('YYYYMMDD HH:mm:ss');

        // YYYYMMDD HH:mm:ssをDateオブジェクトに変換
        return new Date(
            dayjs.utc(yyyymmddhhmmssString, 'YYYYMMDD HH:mm:ss').toDate(),
        );
    },

    /**
     * Date型をString型のYYMMに変換する
     *
     * @param {Date} date 日時
     * @returns {string} YYMMフォーマットの文字列
     */
    formatToYYMM(date: Date | undefined): string {
        if (date === undefined) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_000,
            );
        }
        return dayjs.utc(date).format('YYMM');
    },

    /**
     * Date型をString型のYYYYMMDDに変換する
     *
     * @param {Date} date 日時
     * @returns {string} YYYYMMDDフォーマットの文字列
     */
    formatToYYYYMMDD(date: Date): string {
        return dayjs.utc(date).format('YYYYMMDD');
    },

    /**
     * Date型をString型のYYYY/MM/DD（ddd）に変換する
     *
     * @param {Date} date 日付
     * @returns {string} YYYY/MM/DD（ddd）フォーマットの文字列
     */
    formatToYYYYMMDDddd(date: Date | undefined): string {
        if (date === undefined) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_000,
            );
        }
        return dayjs.utc(date).format('YYYY/MM/DD（ddd）');
    },

    /**
     * Date型をString型のYYYY/MM/DDに変換する
     *
     * @param {Date} date 日付
     * @returns {string} YYYY/MM/DDフォーマットの文字列
     */
    formatToYYYYMMDDWithSlash(date: Date | undefined): string {
        if (date === undefined) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_000,
            );
        }
        return dayjs.utc(date).format('YYYY/MM/DD');
    },

    /**
     * Date型をString型のYYYYMMDD HH:mm:ssに変換する
     *
     * @param {Date} date 日時
     * @returns {string} YYYYMMDD HH:mm:ssフォーマットの文字列
     */
    formatToYYYYMMDDHHmmss(date: Date): string {
        return dayjs.utc(date).format('YYYYMMDD HH:mm:ss');
    },

    /**
     * Date型をString型のJSTのYYYY/MM/DD HH:mm:ssに変換する
     *
     * @param {Date} date 日時
     * @returns {string} YYYY/MM/DD HH:mm:ssフォーマットの文字列
     */
    formatToYYYYMMDDHHmmssSlash(date: Date): string {
        return dayjs
            .utc(date)
            .tz(ASIA_TOKYO_TIMEZONE)
            .format('YYYY/MM/DD HH:mm:ss');
    },

    /**
     * Date型をString型のYYYYMMDD HH:mmに変換する
     *
     * @param {Date} date 日時
     * @returns {string} YYYYMMDD HH:mmフォーマットの文字列
     */
    formatToYYYYMMDDHHmm(date: Date): string {
        return dayjs.utc(date).format('YYYYMMDD HH:mm');
    },

    /**
     * Date型をString型のHH:mmに変換する
     *
     * @param {Date} date 日時
     * @returns {string} HH:mmフォーマットの文字列
     */
    formatToHHmm(date: Date): string {
        return dayjs.utc(date).format('HH:mm');
    },

    /**
     * Date型をString型のHHmmssに変換する
     *
     * @param {Date} date 日時
     * @returns {string} HHmmssフォーマットの文字列
     */
    formatToHHmmss(date: Date): string {
        return dayjs.utc(date).format('HHmmss');
    },

    /**
     * Date型をString型のHH:mm:ssに変換する
     *
     * @param {Date} date 日時
     * @returns {string} HH:mm:ssフォーマットの文字列
     */
    formatToHHmmssWithColon(date: Date): string {
        return dayjs.utc(date).format('HH:mm:ss');
    },

    /**
     * String型のHHmmをHH:mmに変換する
     *
     * @param {string} timeString HHmm形式の文字列
     * @returns {string} HH:mmフォーマットの文字列
     */
    stringFormatToHHmm(timeString: string | undefined): string {
        if (timeString === undefined) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_000,
            );
        }
        if (timeString.includes(':')) {
            return timeString;
        }
        return `${timeString.slice(0, 2)}:${timeString.slice(2)}`;
    },

    /**
     * String型のYYYYMMDDをDate型に変換する
     *
     * @param {string} dateString YYYYMMDD形式の文字列
     * @returns {Date} 変換後の日時
     */
    fromYYYYMMDD(dateString: string): Date {
        return dayjs.utc(dateString, 'YYYYMMDD').toDate();
    },

    /**
     * String型のYYYYMMDD HH:mmをDate型に変換する
     *
     * @param {string} dateString YYYYMMDD HH:mm形式の文字列
     * @returns {Date} 変換後の日時
     */
    fromYYYYMMDDHHmm(dateString: string): Date {
        return dayjs.utc(dateString, 'YYYYMMDD HH:mm').toDate();
    },

    /**
     * String型のYYYYMMDD HH:mm:ssをDate型に変換する
     *
     * @param {string} dateString YYYYMMDD HH:mm:ss形式の文字列
     * @returns {Date} 変換後の日時
     */
    fromYYYYMMDDHHmmss(dateString: string): Date {
        return dayjs.utc(dateString, 'YYYYMMDD HH:mm:ss').toDate();
    },

    /**
     * String型のYYYYMMDDとString型のHH:mmをDate型に変換する
     *
     * @param {string} dateString YYYYMMDD形式の文字列
     * @param {string} timeString HH:mm形式の文字列
     * @returns {Date} 変換後の日時
     */
    fromYYYYMMDDHHmmNoHyphen(dateString: string, timeString: string): Date {
        return dayjs
            .utc(`${dateString} ${timeString}`, 'YYYYMMDD HH:mm')
            .toDate();
    },

    /**
     * 日付文字列をDateオブジェクトに変換する
     * @param timestamp 日付文字列
     * @returns {Date} 変換後の日時
     */
    fromTimestamp(timestamp: string): Date {
        return dayjs.utc(timestamp).toDate();
    },

    /**
     * 現在のJST日付から利用開始日までの残り日数を計算する
     *
     * @param {Date} useDateFrom 利用開始日
     * @returns {number} 残り日数
     */
    getDaysLeft(useDateFrom: Date): number {
        const currentDate = dayjs(
            DateUtils.formatToYYYYMMDD(DateUtils.getJSTDate()),
            'YYYYMMDD',
        );
        const useDate = dayjs(
            DateUtils.formatToYYYYMMDD(useDateFrom),
            'YYYYMMDD',
        );

        return useDate.diff(currentDate, 'day');
    },

    /**
     * 指定した日付に日数を加算または減算し、時間部分を00:00:00に設定したDateオブジェクトを返す
     * @param date - 基準となる日付
     * @param days - 加算または減算する日数（負の値で減算）
     * @param months - 加算または減算する月数（負の値で減算）
     * @param years - 加算または減算する年数（負の値で減算）
     * @returns {Date} 調整された新しいDateオブジェクト（時間は00:00:00）
     */
    addOrSubtractDaysMonthsYears(
        date: Date,
        days: number,
        months?: number,
        years?: number,
    ): Date {
        // 新しい日付オブジェクトを作成し、元の日付を変更しないようにする
        const newDate = new Date(date);

        // 日付を調整する
        newDate.setDate(newDate.getDate() + days);
        newDate.setMonth(newDate.getMonth() + (months ?? 0));
        newDate.setFullYear(newDate.getFullYear() + (years ?? 0));

        // 時間を00:00:00にリセットする
        newDate.setUTCHours(0, 0, 0, 0);
        return newDate;
    },

    /**
     * YYYYMMDD形式の文字列が有効な日付か確認する
     * @param {string} value 検証する文字列
     * @returns {{success: boolean, message: string}} 検証結果
     */
    isValidDate(value: string): {
        success: boolean;
        message: string;
    } {
        const YYYYMMDD_REGEX = /^\d{8}$/;
        if (!YYYYMMDD_REGEX.test(value)) {
            return {
                success: false,
                message: 'Invalid date format, expected YYYYMMDD',
            };
        }

        const date = dayjs(value, 'YYYYMMDD', true);
        // フォーマットの一致とカレンダー上の有効性を確認
        const isValid = date.isValid() && date.format('YYYYMMDD') === value;
        if (!isValid) {
            return {
                success: false,
                message: 'Invalid date(like 20259999), expected valid date',
            };
        }
        return {
            success: true,
            message: 'valid date',
        };
    },

    /**
     * YYYYMMDD HH:mm形式の文字列が有効な日付か確認する
     * @param {string} value 検証する文字列
     * @returns {{success: boolean, message: string}} 検証結果
     */
    isValidDateTime(value: string): {
        success: boolean;
        message: string;
    } {
        const DATETIME_REGEX = /^\d{4}\d{2}\d{2} \d{2}:\d{2}$/;
        if (!DATETIME_REGEX.test(value)) {
            return {
                success: false,
                message: 'Invalid datetime format, expected YYYYMMDD HH:mm',
            };
        }

        // フォーマットが一致する場合、日付と時刻の有効性を確認
        const [datePart, timePart] = value.split(' ');
        const isDateValid = DateUtils.isValidDate(datePart).success;
        const [hour, minute] = timePart.split(':').map(Number);

        if (
            !isDateValid ||
            hour < 0 ||
            hour > 23 ||
            minute < 0 ||
            minute > 59
        ) {
            return {
                success: false,
                message:
                    'Invalid datetime(like 20259999 99:99), expected valid date',
            };
        }

        return {
            success: true,
            message: 'valid datetime',
        };
    },

    /**
     * YYYYMMDD HH:mm:ss形式の文字列が有効な日付か確認する
     * @param {string} value 検証する文字列
     * @returns {{success: boolean, message: string}} 検証結果
     */
    isValidDateTimeWithSeconds(value: string): {
        success: boolean;
        message: string;
    } {
        // フォーマットチェック
        const DATETIME_WITH_SECONDS_REGEX =
            /^\d{4}\d{2}\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!DATETIME_WITH_SECONDS_REGEX.test(value)) {
            return {
                success: false,
                message: 'Invalid datetime format, expected YYYYMMDD HH:mm:ss',
            };
        }

        // `isValidDateTime`で秒を除く部分をチェック
        const dateTimeWithoutSeconds = value.slice(0, -3);
        const baseValidation = DateUtils.isValidDateTime(
            dateTimeWithoutSeconds,
        );

        if (!baseValidation.success) {
            return baseValidation; // 基本チェックで失敗した場合、その結果をそのまま返す
        }

        // 秒の範囲を確認
        const seconds = Number(value.slice(-2));
        if (seconds < 0 || seconds > 59) {
            return {
                success: false,
                message: 'Invalid seconds, expected value between 00 and 59',
            };
        }

        // 全てのチェックをパス
        return {
            success: true,
            message: 'valid datetime with seconds',
        };
    },

    /**
     * 指定した時間単位の開始時刻に変換する
     * @param {Date} date 基準となる日時
     * @param {OpUnitType} unit 時間単位
     * @returns {Date} 変換後の日時
     */
    startOf(date: Date, unit: OpUnitType): Date {
        return dayjs.utc(date).startOf(unit).toDate();
    },

    /**
     * 指定した時間単位の終了時刻に変換する
     * @param {Date} date 基準となる日時
     * @param {OpUnitType} unit 時間単位
     * @returns {Date} 変換後の日時
     */
    endOf(date: Date, unit: OpUnitType): Date {
        return dayjs.utc(date).endOf(unit).toDate();
    },
} as const;
