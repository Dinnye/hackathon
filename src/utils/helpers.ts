import _ from "lodash";

export function getErrorMessage(error: Error | unknown): string {
  let message
  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === "object") {
    message = JSON.stringify(error);
  } else {
    message = String(error)
  }
  return message;
}

export function getDateInRequestedFormat(fullDate: Date): string {
  const dateOnly = fullDate.toISOString().slice(0, 10);
  const miliseconds = fullDate.getMilliseconds().toString().slice(0, 2);
  const seconds = fullDate.getSeconds();
  const minutes = fullDate.getMinutes();
  const hour = fullDate.getHours();

  return `${dateOnly}-${hour}-${minutes}-${seconds}-${miliseconds}`;
}

export function getDateObjectFromStringFormat(date: string): Date {
  const stringContents: string[] = date.split("-");
  const year = parseInt(stringContents[0], 10);
  const month = parseInt(stringContents[1], 10) - 1;
  const day = parseInt(stringContents[2], 10);
  const hour = parseInt(stringContents[3], 10);
  const minutes = parseInt(stringContents[4], 10);
  const seconds = parseInt(stringContents[5], 10);
  const miliseconds = parseInt(stringContents[6], 10);

  const fullDate = new Date();
  fullDate.setFullYear(year, month, day);
  fullDate.setHours(hour, minutes, seconds, miliseconds);

  return fullDate;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function updateProperties(targetObj: any, updateObj:any, keyProperty: string) {
  if (!hasOwnProperty(targetObj, keyProperty)) {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    (targetObj as any)[keyProperty] = updateObj[keyProperty];
  }

  if (keyProperty !== "marks" && typeof (targetObj[keyProperty]) === "object" && typeof (updateObj[keyProperty]) === "object") {
    _.merge(targetObj[keyProperty], updateObj[keyProperty]);
  } else {
    targetObj[keyProperty] = updateObj[keyProperty];
  }
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export function hasOwnProperty<X extends unknown, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
