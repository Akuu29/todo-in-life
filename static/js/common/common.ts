import { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { ValueOfError } from "../api/todoApi";

/*
 * カテゴリー
 */
export const CATEGORY = Object.freeze({
  SHORT: "short",
  MEDIUM: "medium",
  LONG: "long",
  COMPLETE: "complete",
});
/*
 * 日付
 */
export class DateFunctions {
  static convertDateToString(date: Date | null): string | null {
    if(!date) {
      return date;
    }
    const y = date.getFullYear().toString();
    const m = ("0" + (date.getMonth() + 1).toString()).slice(-2);
    const d = ("0" + date.getDate().toString()).slice(-2);
  
    return y + "-" + m + "-" + d;
  }
  static convertStrDateToDate(date: string | null): Date | null {
    if(typeof date == "string") {
      const dateToDate = new Date(date);
      return dateToDate;
    }
  
    return date;
  }
  static convertStrDateToDispDate(date: string | null): string {
    if(!date) {
      return "None";
    }
    const toDate = this.convertStrDateToDate(date);
    const y = toDate!.getFullYear().toString();
    const m = ("0" + (toDate!.getMonth() + 1).toString()).slice(-2);
    const d = ("0" + toDate!.getDate().toString()).slice(-2);
  
    return y + "/" + m + "/" + d;
  }
}
/*
 * Httpリクエスト
 */
export const handleErrorResponse = 
  (error: AxiosError<ValueOfError> | Error): AxiosResponse<ValueOfError> | undefined => {
  /*
   * 考えられるエラー3パターン
   * 1: AxiosError バリデーション
   * 2: AxiosError バリデーション以外 -> AxiosResponseの'data'に'status'を使いして返却
   * 3: Error AxiosError以外
   */
  if(axios.isAxiosError(error)) {
    if(error.response) {
      if(typeof error.response.data != "object") {
        const data: ValueOfError = {
          status: "error"
        };
        error.response.data = data;
      }

      return error.response;
    }
  }

  console.log(`errorMessage:${error.message}`);
  return undefined;
}