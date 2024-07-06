// Fonction utilitaire pour mettre la première lettre en majuscule

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const countHowMuchTimeThisSoungAppear = (songs: Versus[]) => {
  let idCount: Record<number, number> = {};
  songs.forEach((subArr) => {
    subArr.forEach((obj) => {
      if (idCount[obj.id]) {
        idCount[obj.id]++;
      } else {
        idCount[obj.id] = 1;
      }
    });
  });
  return idCount;
};

// used for display console logs duels readeable
export const formattedDuels = (duels: Versus[]) =>
  duels.reduce((acc, duel, index) => {
    acc[`Duel ${index + 1}`] = `${duel[0].title} | ${duel[1].title}`;
    return acc;
  }, {} as Record<string, string>);
