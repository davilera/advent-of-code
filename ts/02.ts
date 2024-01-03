import { filter, flow, map, max, sum } from 'lodash/fp';
import { dot, lines, product, toInt } from './common';

const solve1 = ( input: string ) =>
	flow(
		lines,
		map( game ),
		filter( possible( [ 12, 13, 14 ] ) ),
		map( dot( 'id' ) ),
		sum
	)( input );

const solve2 = ( input: string ): number =>
	flow( lines, map( flow( game, biggestBag, product ) ), sum )( input );

// =======
// HELPERS
// =======

type Game = {
	readonly id: number;
	readonly subsets: ReadonlyArray< Bag >;
};
type Bag = [ number, number, number ];

const game = ( s: string ): Game => {
	const [ g = '', r = '' ] = s.split( ': ' );
	return {
		id: toInt( g.replace( 'Game ', '' ) ),
		subsets: map(
			( s: string ): Bag => [
				toInt( s.match( /(\d+) red/ )?.[ 0 ] ),
				toInt( s.match( /(\d+) green/ )?.[ 0 ] ),
				toInt( s.match( /(\d+) blue/ )?.[ 0 ] ),
			]
		)( r.split( '; ' ) ),
	};
};

const possible =
	( b: Bag ) =>
	( g: Game ): boolean => {
		const bb = biggestBag( g );
		return bb[ 0 ] <= b[ 0 ] && bb[ 1 ] <= b[ 1 ] && bb[ 2 ] <= b[ 2 ];
	};

const biggestBag = ( g: Game ): Bag => [
	max( map( ( b: Bag ) => b[ 0 ] )( g.subsets ) ) || 0,
	max( map( ( b: Bag ) => b[ 1 ] )( g.subsets ) ) || 0,
	max( map( ( b: Bag ) => b[ 2 ] )( g.subsets ) ) || 0,
];

// ====
// MAIN
// ====

( async function () {
	const data = {
		example1: await Bun.file( '../data/02-ex.txt' ).text(),
		input1: await Bun.file( '../data/02-input.txt' ).text(),
		example2: await Bun.file( '../data/02-ex.txt' ).text(),
		input2: await Bun.file( '../data/02-input.txt' ).text(),
	};

	console.log( {
		example1: solve1( data.example1 ),
		input1: solve1( data.input1 ),
		example2: solve2( data.example2 ),
		input2: solve2( data.input2 ),
	} );
} )();
