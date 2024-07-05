// Fonction utilitaire pour mettre la première lettre en majuscule

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
