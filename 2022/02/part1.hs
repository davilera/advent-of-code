#!/usr/bin/runghc

import System.Environment (getArgs)
import System.IO

data Move = Rock
          | Paper
          | Scissors
          deriving (Eq, Show)

data Result = Draw
            | Win
            | Lose
            deriving (Show)


main :: IO ()
main = do
  filename <- head <$> getArgs
  content  <- readFile filename

  let moves = map parseRound . map words . lines $ content
  print $ sum . map points $ moves


-- ==========
-- GAME LOGIC
-- ==========

playRound :: Move -> Move -> Result
playRound Rock Rock     = Draw
playRound Rock Paper    = Win
playRound Rock Scissors = Lose
playRound Paper Rock     = Lose
playRound Paper Paper    = Draw
playRound Paper Scissors = Win
playRound Scissors Rock     = Win
playRound Scissors Paper    = Lose
playRound Scissors Scissors = Draw


points :: (Move, Move) -> Int
points (elf, user) = game + move
  where game = roundPoints $ playRound elf user
        move = movePoints user


roundPoints :: Result -> Int
roundPoints Win  = 6
roundPoints Draw = 3
roundPoints Lose = 0


movePoints :: Move -> Int
movePoints Rock     = 1
movePoints Paper    = 2
movePoints Scissors = 3


-- =======
-- HELPERS
-- =======

parseRound :: [String] -> (Move, Move)
parseRound (x:y:[]) = (parseMove x, parseMove y)
parseRound _        = error "Invalid round"


parseMove :: String -> Move
parseMove "A" = Rock
parseMove "B" = Paper
parseMove "C" = Scissors
parseMove "X" = Rock
parseMove "Y" = Paper
parseMove "Z" = Scissors
parseMove _   = error "Unknown move"
