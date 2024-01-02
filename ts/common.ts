import { trim } from 'lodash/fp';

export const toInt = ( s: string | undefined ): number =>
	Number.parseInt( s || '' ) || 0;

export const lines = ( text: string ): ReadonlyArray< string > =>
	trim( text ).split( '\n' );

export const unlines = ( ls: ReadonlyArray< string > ): string =>
	ls.join( '\n' );

export const words = ( text: string ): ReadonlyArray< string > =>
	trim( text ).split( ' ' );

export const unwords = ( ws: ReadonlyArray< string > ): string =>
	ws.join( ' ' );
