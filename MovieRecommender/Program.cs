using Microsoft.VisualBasic.FileIO;
using System;
using System.ComponentModel.DataAnnotations;

namespace MovieRecommender
{
    class Program
    {
        public static void Main(string[] args)
        {
            double[,] ratings =
            {
                { 5, 1, 5, 1, 3, 3 }, 
                { 4, 4, 4, 2, 4, 1 }, 
                { 4, 3, 5, 5, 2, 5 },
                { 2, 1, 4, 5, 3, 1 },
                { 3, 2, 2, 2, 5, 2 },
                { 4, 5, 3, 1, 1, 1 }
            };

            double[,] simMatrix = simMatx(ratings);


            for (int i = 0; i < simMatrix.GetLength(0); i++)
            {
                for (int j = 0; j < simMatrix.Length / simMatrix.GetLength(0); j++)
                {
                    Console.Write(simMatrix[i, j]);
                    Console.Write(" ");
                }
                Console.WriteLine();
            }

            // selectd movie id
            int selectedMovieIdx = 2;
            int totalNumCol = simMatrix.GetLength(0);
            int totalNumRow = simMatrix.Length / simMatrix.GetLength(0);
            int highestSimilarityMovieIdx = 0;
            double maxSimilarityScore = 0;

            for (int i = 0; i < simMatrix.GetLength(0); i++)
            {
                if (simMatrix[i, selectedMovieIdx] != 1 && simMatrix[i, selectedMovieIdx] > maxSimilarityScore)
                {
                    maxSimilarityScore = simMatrix[i, selectedMovieIdx];
                    highestSimilarityMovieIdx = i;
                }
            }

            Console.WriteLine($"\nMovie {selectedMovieIdx + 1} has the highest similarity score with Movie {highestSimilarityMovieIdx + 1}.");


        }


        static double[,] simMatx(double[,] ratings)
        {
            int totalNumCol = ratings.GetLength(0);
            int totalNumRow = ratings.Length / ratings.GetLength(0);
            double[,] matrix = new double[totalNumRow, totalNumCol];
            for (int i = 0; i < totalNumCol; i++)
            {
                for (int j = 0; j < totalNumRow; j++)
                {
                    double nom = 0;
                    double den1 = 0;
                    double den2 = 0;
                    for (int k = 0; k < totalNumRow; k++)
                    {
                        nom += ratings[k, i] * ratings[k, j];
                        den1 += Math.Pow(ratings[k, i], 2);
                        den2 += Math.Pow(ratings[k, j], 2);
                    }
                    matrix[i, j] = nom / Math.Pow(den1 * den2, 0.5);
                }
            }
            return matrix;
        }
    }
}