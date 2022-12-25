#!/usr/bin/runghc

import System.Environment (getArgs)
import System.IO

import Data.Maybe (fromMaybe)
import Data.List (elemIndex)

type Assignment = (Int, Int)

main :: IO ()
main = do
  filename <- head <$> getArgs
  content  <- readFile filename

  print $ length . filter overlaps . map parseAssignmentPair . lines $ content


-- =======
-- HELPERS
-- =======

overlaps :: (Assignment, Assignment) -> Bool
overlaps ((a, b), (x, y))
  | x <= a && a <= y = True
  | x <= b && b <= y = True
  | a <= x && x <= b = True
  | a <= y && y <= b = True
  | otherwise        = False

parseAssignmentPair :: String -> (Assignment, Assignment)
parseAssignmentPair pair = (parseAssignment $ fst s, parseAssignment $ snd s)
  where s = splitWith ',' pair


parseAssignment :: String -> Assignment
parseAssignment s = transformPair parseInt (splitWith '-' s)


splitWith :: Eq a => a -> [a] -> ([a], [a])
splitWith c xs = (fst s, tail $ snd s)
  where i = fromMaybe 0 (c `elemIndex` xs)
        s = splitAt i xs


transformPair :: (a -> b) -> (a, a) -> (b, b)
transformPair f (x, y) = (f x, f y)


parseInt :: String -> Int
parseInt x = read x :: Int
