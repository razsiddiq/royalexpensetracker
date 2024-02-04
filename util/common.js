/* eslint-disable prettier/prettier */
export const trimAndAppendDots  = (inputString, character = 20) => {
    if (inputString.length > character) {
      return inputString.substring(0, character) + '...';
    }
    return inputString;
}