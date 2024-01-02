import { trim } from 'lodash/fp';

export const len =
	( l: number ): ( ( a: string | any[] ) => boolean ) =>
	( a ) =>
		a.length === l;

export const toInt = ( s: string | undefined ): number =>
	Number.parseInt( s || '' ) || 0;

export const chars = ( text: string ): ReadonlyArray< string > =>
	trim( text ).split( '' );

export const unchars = ( cs: ReadonlyArray< string > ): string => cs.join( '' );

export const lines = ( text: string ): ReadonlyArray< string > =>
	trim( text ).split( '\n' );

export const unlines = ( ls: ReadonlyArray< string > ): string =>
	ls.join( '\n' );

export const words = ( text: string ): ReadonlyArray< string > =>
	trim( text ).split( ' ' );

export const unwords = ( ws: ReadonlyArray< string > ): string =>
	ws.join( ' ' );

export const pair = < A, B >( a: A, b: B ): [ A, B ] => [ a, b ];

export const fst = < A, B >( pair: [ A, B ] ): A => pair[ 0 ];

export const snd = < A, B >( pair: [ A, B ] ): B => pair[ 1 ];

export function parallel< I, R1, R2, R3 >(
	f1: ( i: I ) => R1,
	f2: ( i: I ) => R2,
	f3: ( i: I ) => R3
): ( i: I ) => readonly [ R1, R2, R3 ];
export function parallel< I, R1, R2 >(
	f1: ( i: I ) => R1,
	f2: ( i: I ) => R2
): ( i: I ) => readonly [ R1, R2 ];
export function parallel< I, R1 >(
	f1: ( i: I ) => R1
): ( i: I ) => readonly [ R1 ];
export function parallel< I >(
	...fs: ( ( i: I ) => any )[]
): ( i: I ) => readonly any[] {
	return ( i: I ) => fs.map( ( f ) => f( i ) );
} //end parallel()

export const product = ( ns: number[] ): number =>
	ns.reduce( ( r, n ) => r * n, 1 );
