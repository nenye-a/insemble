const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Convert "yyyy-mm-dd" format into "dd Mon yyyy" date format.
 */

export default function dateFormatter(date: string) {
  let newDate = new Date(date);
  let formattedDate =
    newDate.getDate() + '-' + MONTH[newDate.getMonth()] + '-' + newDate.getFullYear();
  return formattedDate;
}
