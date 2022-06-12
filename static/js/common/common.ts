// 日付型の日付を文字列型'yyyy/MM/dd'形式に変換して返却
export const convertDateToString = (date: Date | null): string => {
  if(!date) {
    return "";
  }
  const y = date.getFullYear().toString();
  const m = ("0" + (date.getMonth() + 1).toString()).slice(-2);
  const d = ("0" + date.getDate().toString()).slice(-2);

  return y + "/" + m + "/" + d;
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
    return "";
  }
  const toDate = convertStrDateToDate(date);
  return convertDateToString(toDate);
};