#!/usr/bin/runghc

import System.Environment (getArgs)
import System.IO

import Data.List
import Data.List.Split

type Crane = Char
type Stack = (Int, [Crane])

type Move = (Int, Int)

main :: IO ()
main = do
  filename <- head <$> getArgs
  content  <- readFile filename

  let (a, b) = break null . lines $ content
  let stacks = parseStacks $ init a
  let moves  = parseMoves $ tail b

  print $ filter (/=' ') . map safeHead . map snd $ rearrange stacks moves


-- ============
-- PUZZLE LOGIC
-- ============

rearrange :: [Stack] -> [Move] -> [Stack]
rearrange stacks []     = stacks
rearrange stacks (m:ms) = rearrange (applyMove m stacks) ms


applyMove :: Move -> [Stack] -> [Stack]
applyMove (f,t) stacks = map update stacks
  where el           = head . snd $ stacks!!(f-1)
        update (i,s) = if i == f then (i, tail s)
                       else if i == t then (i, el:s)
                       else (i, s)


-- =======
-- HELPERS
-- =======

parseStacks :: [String] -> [Stack]
parseStacks lines = zip [1..n] stacks
  where stacks       = map filterCranks . transpose . map parseLine $ lines
        n            = length stacks
        parseLine    = map (!!1) . chunksOf 4
        filterCranks = filter (/=' ')


parseMoves :: [String] -> [Move]
parseMoves = concat . map parseMove 


parseMove :: String -> [Move]
parseMove x = replicate n (from, to)
  where ws   = words x
        n    = readInt $ ws!!1
        from = readInt $ ws!!3
        to   = readInt $ ws!!5

readInt :: String -> Int
readInt x = read x :: Int


safeHead :: [Crane] -> Crane
safeHead []    = ' '
safeHead (h:_) = h
