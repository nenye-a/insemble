export function trialCheck(createdAt: Date): boolean {
  let today = new Date().getTime();
  let trialEndMonth = createdAt.getMonth() + 3;
  let trialEnd = new Date(
    createdAt.getFullYear(),
    trialEndMonth,
    createdAt.getDate(),
  ).getTime();
  if (today < trialEnd) {
    return true;
  }
  return false;
}
