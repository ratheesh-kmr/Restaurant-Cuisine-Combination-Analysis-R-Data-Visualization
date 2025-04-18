args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) quit(status = 1)

location <- args[1]
data <- read.csv("./zomato.csv", stringsAsFactors = FALSE)
cat("Loaded", nrow(data), "rows from CSV\n")

# Convert Ratings to numeric early
data$Ratings <- suppressWarnings(as.numeric(data$Ratings))

# Check for required columns
if (!all(c("Area", "Cuisines", "Ratings") %in% names(data))) quit(status = 1)

# Normalize Area and location input (trim spaces, make lowercase)
data$Area <- trimws(tolower(data$Area))
location <- trimws(tolower(location))

# Debug: Show sample Area values
cat("Sample Area values:\n")
print(unique(head(data$Area, 10)))

# Check for matching location
match_count <- sum(data$Area == location)
cat("Filtered rows for", location, ":", match_count, "\n")

# Filter the dataset
filtered <- subset(data, Area == location & !is.na(Cuisines) & !is.na(Ratings))
if (nrow(filtered) == 0) {
  cat("No rows matched the location.\n")
  quit(status = 1)
}

# --- Split cuisines ---
cuisine_list <- strsplit(filtered$Cuisines, ",\\s*")

# ---------------------
# 1. Most Frequent Individual Cuisine
# ---------------------
flat_cuisines <- unlist(cuisine_list)
freq_table <- sort(table(flat_cuisines), decreasing = TRUE)
most_common_cuisine <- names(freq_table)[1]
cat("\nMost Frequent Individual Cuisine:\n")
cat("   •", most_common_cuisine, "\n")

# ---------------------
# 2. Most Frequent Combination via Apriori
# ---------------------
suppressMessages(library(arules))
transactions <- as(cuisine_list, "transactions")

rules <- suppressWarnings(apriori(
  transactions,
  parameter = list(supp = 0.1, conf = 0.6, minlen = 2, maxlen = 3)
))

cat("\n📊 Most Frequent Cuisine Combination (Apriori):\n")
if (length(rules) == 0) {
  cat("   • None (no strong association found)\n")
} else {
  top_rule <- sort(rules, by = "support", decreasing = TRUE)[1]
  lhs_rule <- labels(lhs(top_rule))[[1]]
  rhs_rule <- labels(rhs(top_rule))[[1]]
  cat("   •", lhs_rule, "+", rhs_rule, "\n")
}

# ---------------------
# 3. Highest Rated Cuisine Combination
# ---------------------
filtered$CuisineSet <- sapply(cuisine_list, function(x) paste(sort(x), collapse = ", "))
grouped <- aggregate(Ratings ~ CuisineSet, data = filtered, FUN = mean)
top_rated <- grouped[which.max(grouped$Ratings), ]
cat("\nHighest Rated Cuisine Combination:\n")
cat("   •", top_rated$CuisineSet, "(", round(top_rated$Ratings, 2), ")\n")

# ---------------------
# 4. Top 5 Frequent Cuisine Combinations by Avg Rating
# ---------------------
combo_freq <- table(filtered$CuisineSet)
top5_combos <- names(sort(combo_freq, decreasing = TRUE))[1:5]
top5_data <- subset(filtered, CuisineSet %in% top5_combos)

ranked <- aggregate(Ratings ~ CuisineSet, data = top5_data, FUN = mean)
ranked <- ranked[order(-ranked$Ratings), ]

cat("\nTop 5 Frequent Cuisine Combinations by Avg Rating:\n")
for (i in 1:nrow(ranked)) {
  cat(paste0("   ", i, ". ", ranked$CuisineSet[i], " — ", round(ranked$Ratings[i], 2), "\n"))
}

suppressMessages(library(ggplot2))

# ---- Save Top 10 Cuisines Bar Plot ----
top10 <- head(freq_table, 10)
df_top10 <- data.frame(Cuisine = names(top10), Count = as.numeric(top10))

p <- ggplot(df_top10, aes(x = reorder(Cuisine, -Count), y = Count, fill = Cuisine)) +
  geom_bar(stat = "identity") +
  coord_flip() +
  theme_minimal() +
  labs(title = paste("Top 10 Cuisines in", location), x = "Cuisine", y = "Count") +
  theme(legend.position = "none")

# Save image
plot_file <- paste0("./public/plots/", gsub(", ", "_", location), "_top10.png")
ggsave(filename = plot_file, plot = p, width = 6, height = 4, dpi = 300)
