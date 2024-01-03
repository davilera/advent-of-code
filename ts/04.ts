import { filter, flow, map, range, reduce, slice, sum } from 'lodash/fp';
import { dot, lines, toInt, words } from './common';

const solve1 = ( input: string ) =>
	flow( lines, map( flow( mkCard, matches, score ) ), sum )( input );

const solve2 = ( input: string ) =>
	flow(
		lines,
		map( flow( mkCard, matches, mkInstance ) ),
		redeemCards,
		map( dot( 'instances' ) ),
		sum
	)( input );

// =======
// HELPERS
// =======

type Card = {
	readonly id: number;
	readonly nums: ReadonlyArray< number >;
	readonly matches: ReadonlyArray< number >;
};

const mkCard = ( s: string ): Card => ( {
	id: toInt( s.match( /Card (\d+):/ )?.[ 1 ] ),
	nums: numbers( s.split( /[:|]/ )[ 1 ] || '' ),
	matches: numbers( s.split( /[:|]/ )[ 2 ] || '' ),
} );

const numbers = ( s: string ): ReadonlyArray< number > =>
	flow( words, map( toInt ) )( s.replace( /\s+/g, ' ' ) );

const matches = ( c: Card ): ReadonlyArray< number > =>
	filter( ( n: number ) => c.matches.includes( n ) )( c.nums );

const score = ( ns: ReadonlyArray< number > ): number =>
	ns.length ? 2 ** ( ns.length - 1 ) : 0;

type WinnerInstance = {
	readonly instances: number;
	readonly matches: ReadonlyArray< number >;
};

const mkInstance = ( ns: ReadonlyArray< number > ): WinnerInstance => ( {
	instances: 1,
	matches: ns,
} );

const redeemCards = (
	wis: ReadonlyArray< WinnerInstance >
): ReadonlyArray< WinnerInstance > =>
	reduce(
		( r: ReadonlyArray< WinnerInstance >, i: number ) => {
			const [ init, c, tail ] = split( i, r );
			return [
				...init,
				c,
				...map(
					( wi: WinnerInstance ) => ( {
						...wi,
						instances: wi.instances + c.instances,
					} ),
					slice( 0, c.matches.length, tail )
				),
				...slice( c.matches.length, tail.length, tail ),
			];
		},
		wis,
		range( 0, wis.length )
	);

const split = < T >( i: number, a: ReadonlyArray< T > ): [ T[], T, T[] ] => [
	slice( 0, i, a ),
	a[ i ] as T,
	slice( i + 1, a.length, a ),
];

// ====
// MAIN
// ====

( async function () {
	const data = {
		example1: await Bun.file( '../data/04-ex.txt' ).text(),
		input1: await Bun.file( '../data/04-input.txt' ).text(),
		example2: await Bun.file( '../data/04-ex.txt' ).text(),
		input2: await Bun.file( '../data/04-input.txt' ).text(),
	};

	console.log( {
		example1: solve1( data.example1 ),
		input1: solve1( data.input1 ),
		example2: solve2( data.example2 ),
		input2: solve2( data.input2 ),
	} );
} )();
