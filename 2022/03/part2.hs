#!/usr/bin/runghc

import System.Environment (getArgs)
import System.IO

import Data.Char (isLower, ord)
import Data.List.Split (chunksOf)

main :: IO ()
main = do
  filename <- head <$> getArgs
  content  <- readFile filename

  print $ sum . map (priority . findDup . sortTriple) . triples . lines $ content


-- =======
-- HELPERS
-- =======

triples :: [a] -> [(a, a, a)]
triples xs = map triple $ chunksOf 3 xs
  where triple (x:y:z:[]) = (x,y,z)


sortTriple :: ([a], [a], [a]) -> ([a], [a], [a])
sortTriple (xs, ys, zs)
  | x <= y && x <= z = (xs, ys, zs)
  | y <= x && y <= z = (ys, xs, zs)
  | otherwise        = (zs, xs, ys)
  where x = length xs
        y = length ys
        z = length zs


findDup :: Eq a => ([a], [a], [a]) -> a
findDup (x:xs, ys, zs)
  | x `elem` ys && x `elem` zs = x
  | otherwise                  = findDup (xs, ys, zs)


priority :: Char -> Int
priority c
  | isLower c = ord c - ord 'a' + 1
  | otherwise = ord c - ord 'A' + 27
