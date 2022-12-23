#!/usr/bin/runghc

import System.Environment (getArgs)
import System.IO

import Data.Char (isLower, ord)

main :: IO ()
main = do
  filename <- head <$> getArgs
  content  <- readFile filename

  print $ sum . map ( priority . findDup . halve ) . lines $ content


-- =======
-- HELPERS
-- =======

halve :: [a] -> ([a], [a])
halve xs = (take n xs, drop n xs)
  where n = (length xs) `div` 2


findDup :: Eq a => ([a], [a]) -> a
findDup ((x:xs), ys) = if x `elem` ys then x else findDup (xs, ys)


priority :: Char -> Int
priority c
  | isLower c = ord c - ord 'a' + 1
  | otherwise = ord c - ord 'A' + 27
