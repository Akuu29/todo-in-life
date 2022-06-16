// 日付型の日付を文字列型'yyyy-MM-dd'形式に変換して返却
export const convertDateToString = (date: Date | null): string | null => {
  if(!date) {
    return date;
  }
  const y = date.getFullYear().toString();
  const m = ("0" + (date.getMonth() + 1).toString()).slice(-2);
  const d = ("0" + date.getDate().toString()).slice(-2);

  return y + "-" + m + "-" + d;
};
// 文字列型の日付を日付型に変換して返却
export const convertStrDateToDate = (date: string | null): Date | null => {
  if(typeof date == "string") {
    const dateToDate = new Date(date);
    return dateToDate;
  }

  return date;
};
// 文字列型の日付を'yyyy/MM/dd'形式に変換して返却
export const convertStrDateToDispDate = (date: string | null): string => {
  if(!date) {
    return "None";
  }
  const toDate = convertStrDateToDate(date);
  const y = toDate!.getFullYear().toString();
  const m = ("0" + (toDate!.getMonth() + 1).toString()).slice(-2);
  const d = ("0" + toDate!.getDate().toString()).slice(-2);

  return y + "/" + m + "/" + d;
};