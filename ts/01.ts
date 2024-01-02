import { first, flow, last, map, sum } from 'lodash/fp';
import { lines } from './common';

const solve1 = ( input: string ) =>
	flow( lines, map( flow( digits, bounds, toInt ) ), sum )( input );

const solve2 = ( input: string ): number =>
	flow(
		lines,
		map( flow( numberify, digits, bounds, toInt ) ),
		sum
	)( input );

// =======
// HELPERS
// =======

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

const isDigit = ( s: string ): s is Digit =>
	s.length === 1 && s.charCodeAt( 0 ) - '0'.charCodeAt( 0 ) <= 9;

const digits = ( s: string ): ReadonlyArray< Digit > =>
	s.split( '' ).filter( isDigit );

const bounds = ( ds: ReadonlyArray< Digit > ): [ Digit, Digit ] => [
	first( ds ) || '0',
	last( ds ) || '0',
];

const toInt = ( ds: ReadonlyArray< Digit > ): number =>
	Number.parseInt( ds.join( '' ) );

const nums: ReadonlyArray< [ string, string ] > = [
	[ 'one', '1' ],
	[ 'two', '2' ],
	[ 'three', '3' ],
	[ 'four', '4' ],
	[ 'five', '5' ],
	[ 'six', '6' ],
	[ 'seven', '7' ],
	[ 'eight', '8' ],
	[ 'nine', '9' ],
];

const numberify = ( s: string ) =>
	! s
		? ''
		: [ ...nums, [ s[ 0 ] || '', s[ 0 ] || '' ] as const ].reduce(
				( a, [ n, i ] ): string =>
					a.startsWith( n ) ? i + numberify( a.substring( 1 ) ) : a,
				s
		  );

// ====
// MAIN
// ====

( async function () {
	const data = {
		example1: await Bun.file( '../data/01-ex1.txt' ).text(),
		input1: await Bun.file( '../data/01-input.txt' ).text(),
		example2: await Bun.file( '../data/01-ex2.txt' ).text(),
		input2: await Bun.file( '../data/01-input.txt' ).text(),
	};

	console.log( {
		example1: solve1( data.example1 ),
		input1: solve1( data.input1 ),
		example2: solve2( data.example2 ),
		input2: solve2( data.input2 ),
	} );
} )();
