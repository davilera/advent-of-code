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


getMove :: Result -> Move -> Move
getMove Win Rock     = Paper
getMove Win Paper    = Scissors
getMove Win Scissors = Rock
getMove Draw Rock     = Rock
getMove Draw Paper    = Paper
getMove Draw Scissors = Scissors
getMove Lose Rock     = Scissors
getMove Lose Paper    = Rock
getMove Lose Scissors = Paper


-- =======
-- HELPERS
-- =======

parseRound :: [String] -> (Move, Move)
parseRound (x:y:[]) = (elf, user)
  where elf  = parseMove x
        user = getMove (parseResult y) elf
parseRound _        = error "Invalid round"


parseMove :: String -> Move
parseMove "A" = Rock
parseMove "B" = Paper
parseMove "C" = Scissors
parseMove _   = error "Unknown move"


parseResult :: String -> Result
parseResult "X" = Lose
parseResult "Y" = Draw
parseResult "Z" = Win
parseResult _   = error "Unknown result"
