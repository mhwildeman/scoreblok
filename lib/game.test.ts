import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addRound, defaults, isFinished, rank, totals, type Game } from './game.ts';
const base = (): Game => ({ rules: { ...defaults, count: 2, limit: 2 }, players: [{id:'a',name:'A'},{id:'b',name:'B'}], rounds: [], createdAt: '' });
test('scores accumulate and rounds end the game', () => { let g = addRound(base(), [5,-2]); g = addRound(g,[3,4]); assert.deepEqual(totals(g),[8,2]); assert.equal(isFinished(g),true); assert.equal(addRound(g,[1,1]),g); });
test('point limit can stop partway through a round', () => { const g = base(); g.rules = {...g.rules, end:'points',limit:10,finishRound:false}; const result = addRound(g,[10,20]); assert.deepEqual(result.rounds,[[10,null]]); assert.equal(isFinished(result),true); });
test('finish round counts all players and low score wins', () => { const g = base(); g.rules = {...g.rules,end:'points',limit:10,finishRound:true,goal:'low'}; const result=addRound(g,[10,3]); assert.deepEqual(totals(result),[10,3]); assert.equal(rank(result)[0].name,'B'); });
