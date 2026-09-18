// How it works: chapter order. The page's chapters array must match it one for one.
import { anywhere, deleted, everyDevice, lattice, usualWay } from './globe-acts';
import { catchUp, clocks, discovery, fields, lanes, noteMerge, pairing, pieces, punch, record, relay, replicas, resume, trust } from './flat-acts';
import type { Build } from './stage';

export const build: Build = (globe) => [
  usualWay(globe), deleted(globe), everyDevice(globe),
  record(), fields(), clocks(), noteMerge(), catchUp(), pieces(), resume(), lanes(),
  discovery(), pairing(), trust(), punch(), relay(), replicas(),
  anywhere(globe), lattice(globe),
];
