import { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { ValueOfError } from "../../services/api/todoApi";

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