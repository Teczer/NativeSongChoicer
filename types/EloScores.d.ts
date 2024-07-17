type EloScores = Record<number, number>;
interface SongWithEloScore {
  song: Song;
  eloScore: number;
}

interface SongRankInfo {
  eloScore: number;
  title: string;
}
[];
