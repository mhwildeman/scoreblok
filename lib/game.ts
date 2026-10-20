export type Rules = { goal: 'high' | 'low'; end: 'rounds' | 'points'; limit: number; finishRound: boolean; count: number };
export type Player = { id: string; name: string };
export type Game = { rules: Rules; players: Player[]; rounds: (number | null)[][]; createdAt: string };
export const defaults: Rules = { goal: 'high', end: 'rounds', limit: 10, finishRound: true, count: 4 };
export function totals(game: Game) { return game.players.map((_, i) => game.rounds.reduce((sum, round) => sum + (round[i] ?? 0), 0)); }
export function isFinished(game: Game) {
 if (game.rules.end === 'rounds') return game.rounds.length >= game.rules.limit;
 return totals(game).some(score => score >= game.rules.limit);
}
export function rank(game: Game) { const scores = totals(game); return game.players.map((p, i) => ({ ...p, score: scores[i], index: i })).sort((a,b) => game.rules.goal === 'high' ? b.score - a.score : a.score - b.score); }
export function addRound(game: Game, scores: number[]): Game {
 if (isFinished(game)) return game;
 const round: (number | null)[] = [];
 const previous = totals(game);
 let stopped = false;
 scores.forEach((score, i) => { round.push(stopped ? null : score); if (!stopped && game.rules.end === 'points' && !game.rules.finishRound && previous[i] + score >= game.rules.limit) stopped = true; });
 return { ...game, rounds: [...game.rounds, round] };
}
