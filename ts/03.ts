import { filter, flatMap, flow, map, reduce, some, sum } from 'lodash/fp';
import { chars, len, lines, parallel, product, snd, toInt } from './common';

const solve1 = ( input: string ) =>
	flow(
		numbers,
		filter( adjacent( marks( input ) ) ),
		map( value ),
		sum
	)( input );

const solve2 = ( input: string ) =>
	flow(
		parallel( flow( marks, filter( gear ) ), numbers ),
		mapMarksToAdjacentNumbers,
		filter( len( 2 ) ),
		map( flow( map( value ), product ) ),
		sum
	)( input );

// =======
// HELPERS
// =======

type PartialNum = {
	readonly v: string;
	readonly e: number;
};

type PartialNums = readonly [ PartialNum, ...PartialNum[] ];

type Number = {
	readonly v: number;
	readonly l: number;
	readonly r: [ number, number ];
};

const numbers = ( s: string ): ReadonlyArray< Number > =>
	flow(
		lines,
		indexed,
		flatMap(
			( [ l, t ] ): ReadonlyArray< Number > =>
				flow(
					chars,
					indexed,
					filter( flow( snd, isDigit ) ),
					reduce(
						( [ pn, ...pns ], [ c, d ] ): PartialNums =>
							c === pn.e
								? [ { v: pn.v + d, e: pn.e + 1 }, ...pns ]
								: [ { v: d, e: c + 1 }, pn, ...pns ],
						[ { v: '', e: 0 } ] as PartialNums
					),
					filter( ( { v } ) => !! v ),
					map(
						( { v, e } ): Number => ( {
							v: toInt( v ),
							l,
							r: [ e - v.length, e - 1 ],
						} )
					)
				)( t )
		)
	)( s );

type Mark = {
	readonly v: string;
	readonly l: number;
	readonly c: number;
};

const marks = ( s: string ): ReadonlyArray< Mark > =>
	flow(
		lines,
		indexed,
		flatMap(
			( [ l, t ] ): ReadonlyArray< Mark > =>
				flow(
					chars,
					indexed,
					filter( flow( snd, isSym ) ),
					map( ( [ c, v ] ): Mark => ( { v, l, c } ) )
				)( t )
		)
	)( s );

const adjacent =
	( ms: ReadonlyArray< Mark > ) =>
	( n: Number ): boolean =>
		some(
			( m: Mark ) =>
				between( n.l - 1, n.l + 1 )( m.l ) &&
				between( n.r[ 0 ] - 1, n.r[ 1 ] + 1 )( m.c )
		)( ms );

const value = ( n: Number ): number => n.v;

const isSym = ( s: string ): boolean => /^[^\d.]$/.test( s );

const isDigit = ( s: string ): boolean => /\d/.test( s );

const indexed = < T >(
	a: ReadonlyArray< T >
): ReadonlyArray< [ number, T ] > => a.map( ( v, i ) => [ i, v ] );

const between = ( min: number, max: number ) => ( n: number ) =>
	min <= n && n <= max;

const gear = ( s: Mark ): boolean => s.v === '*';

const mapMarksToAdjacentNumbers = ( [ ms, ns ]: [
	ReadonlyArray< Mark >,
	ReadonlyArray< Number >,
] ): ReadonlyArray< ReadonlyArray< Number > > =>
	map( ( m ) => filter( adjacent( [ m ] ) )( ns ), ms );

// ====
// MAIN
// ====

( async function () {
	const data = {
		example1: await Bun.file( '../data/03-ex.txt' ).text(),
		input1: await Bun.file( '../data/03-input.txt' ).text(),
		example2: await Bun.file( '../data/03-ex.txt' ).text(),
		input2: await Bun.file( '../data/03-input.txt' ).text(),
	};

	console.log( {
		example1: solve1( data.example1 ),
		input1: solve1( data.input1 ),
		example2: solve2( data.example2 ),
		input2: solve2( data.input2 ),
	} );
} )();
