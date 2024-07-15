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

// used for format date in the rankings screen
export function formatDate(dateString: string): string {
  const currentDate = new Date();
  const createdAtDate = new Date(dateString);
  const diffTime = Math.abs(currentDate.getTime() - createdAtDate.getTime());
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else if (diffMinutes < 1440) {
    const diffHours = Math.ceil(diffMinutes / 60);
    return `${diffHours} heure${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMinutes < 43200) {
    const diffDays = Math.ceil(diffMinutes / 1440);
    return `${diffDays} jour${diffDays > 1 ? "s" : ""} ago`;
  } else {
    const diffMonths = Math.ceil(diffMinutes / 43200);
    return `${diffMonths} mois${diffMonths > 1 ? "s" : ""} ago`;
  }
}
