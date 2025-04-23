/**
 * Takes a full name and returns the first two initials.
 * If the name is not provided it will return undefined.
 *
 * @param  name The full name to get the initials from
 * @returns  The first two initials of the name
 */
export const getFirstTwoInitials = (name: string) => {
  if (!name) return;
  const nameParts = name.split(' ');
  const initials = [];
  for (let i = 0; i < nameParts.length; i++) {
    if (nameParts[i]) {
      initials.push(nameParts?.[i]?.[0]?.toUpperCase());
    }
  }
  return initials.slice(0, 2).join('');
};

export const convertToLowerCase = (str: string) => str?.toLowerCase();

export const truncateText = (text: string, maxLength: number = 100) =>
  text?.length > maxLength ? `${text?.substring(0, maxLength)}...` : text;
