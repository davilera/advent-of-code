#!/usr/bin/runghc

import System.Environment (getArgs)
import System.IO
import Data.List (sort)

main :: IO ()
main = do
  filename <- head <$> getArgs
  content  <- readFile filename

  print $ sum . take 3 . reverse . sort . map sum . map (map parseInt) . chunks null . lines $ content


chunks :: ( a -> Bool ) -> [a] -> [[a]]
chunks _ [] = []
chunks f xs = h : t
  where h = takeWhile (not.f) xs
        t = chunks f $ tail $ dropWhile (not.f) xs


parseInt :: String -> Int
parseInt x = read x :: Int
