args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) quit(status = 1)

location <- args[1]
data <- read.csv("./zomato.csv", stringsAsFactors = FALSE)

if (!all(c("Area", "Cuisines", "Rating") %in% names(data))) quit(status = 1)

filtered <- subset(data, Area == location & !is.na(Cuisines) & !is.na(Rating))
if (nrow(filtered) == 0) quit(status = 1)

# Create cuisine set
cuisine_list <- strsplit(filtered$Cuisines, ",\\s*")
filtered$CuisineSet <- sapply(cuisine_list, function(x) paste(sort(x), collapse = ", "))

# Top 5 Most Frequent Cuisine Combinations
combo_freq <- table(filtered$CuisineSet)
top5_combos <- names(sort(combo_freq, decreasing = TRUE))[1:5]
top5_data <- subset(filtered, CuisineSet %in% top5_combos)

# Average Rating per Combo
ranked <- aggregate(Rating ~ CuisineSet, data = top5_data, FUN = mean)
ranked <- ranked[order(-ranked$Rating), ]

cat("Top 5 Frequent Cuisine Combinations by Avg Rating:\n")
for (i in 1:nrow(ranked)) {
  cat(i, ")", ranked$CuisineSet[i], "-", round(ranked$Rating[i], 2), "\n")
}
