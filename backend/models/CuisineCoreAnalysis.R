args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) quit(status = 1)

location <- args[1]
data <- read.csv("./zomato.csv", stringsAsFactors = FALSE)

if (!all(c("Area", "Cuisines", "Rating") %in% names(data))) quit(status = 1)

filtered <- subset(data, Area == location & !is.na(Cuisines) & !is.na(Rating))
if (nrow(filtered) == 0) quit(status = 1)

# Split cuisines
cuisine_list <- strsplit(filtered$Cuisines, ",\\s*")

# 1. Most Frequent Individual Cuisine
flat_cuisines <- unlist(cuisine_list)
freq_table <- sort(table(flat_cuisines), decreasing = TRUE)
most_common_cuisine <- names(freq_table)[1]
cat("Most Frequent Cuisine:", most_common_cuisine, "\n")

# 2. Most Frequent Combination via Apriori
suppressMessages(library(arules))
transactions <- as(cuisine_list, "transactions")

rules <- apriori(
  transactions,
  parameter = list(supp = 0.1, conf = 0.6, minlen = 2, maxlen = 3)
)

if (length(rules) == 0) {
  cat("Most Frequent Combination: None\n")
} else {
  top_rule <- sort(rules, by = "support", decreasing = TRUE)[1]
  lhs <- labels(lhs(top_rule))[[1]]
  rhs <- labels(rhs(top_rule))[[1]]
  cat("Most Frequent Combination:", lhs, "+", rhs, "\n")
}

# 3. Highest Rated Combination
filtered$CuisineSet <- sapply(cuisine_list, function(x) paste(sort(x), collapse = ", "))
grouped <- aggregate(Rating ~ CuisineSet, data = filtered, FUN = mean)
top_rated <- grouped[which.max(grouped$Rating), ]
cat("Highest Rated Combination:", top_rated$CuisineSet, "\n")
