# Get the location argument passed from the command line
args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) quit(status = 1)

# Load required libraries without cluttering console
suppressMessages(library(arules))     # For Apriori algorithm
suppressMessages(library(ggplot2))    # For plotting
suppressMessages(library(jsonlite))   # For JSON output

# Get the location from the argument
input_location <- args[1]

# Read the dataset
data <- read.csv("./zomato.csv", stringsAsFactors = FALSE)

# Convert ratings to numeric (some values may be characters)
data$Ratings <- suppressWarnings(as.numeric(data$Ratings))

# Ensure all required columns exist
required_columns <- c("Area", "Cuisines", "Ratings")
if (!all(required_columns %in% names(data))) quit(status = 1)

# Normalize location strings (lowercase, trimmed)
data$Area <- trimws(tolower(data$Area))
input_location <- trimws(tolower(input_location))

# Count how many rows match the input location
matching_count <- sum(data$Area == input_location)

# Filter the dataset to only matching rows with valid cuisines and ratings
filtered_data <- subset(data, Area == input_location & !is.na(Cuisines) & !is.na(Ratings))
if (nrow(filtered_data) == 0) quit(status = 1)

# Split cuisine strings into a list of cuisines for each row
cuisine_list <- strsplit(filtered_data$Cuisines, ",\\s*")

# ------------------------------------------------------------
# 1. Most Frequent Individual Cuisine
# ------------------------------------------------------------
all_cuisines <- unlist(cuisine_list)
cuisine_frequency <- sort(table(all_cuisines), decreasing = TRUE)
most_frequent_cuisine <- names(cuisine_frequency)[1]

# ------------------------------------------------------------
# 2. Most Frequent Cuisine Combination (Apriori Algorithm)
# ------------------------------------------------------------
# Convert the list to transaction format
transactions <- as(cuisine_list, "transactions")

# Suppress Apriori’s console output
sink(tempfile())  # redirect stdout
rules <- suppressWarnings(apriori(
  transactions,
  parameter = list(supp = 0.1, conf = 0.6, minlen = 2, maxlen = 3)
))
sink()  # restore stdout

# Pick the strongest frequent combination (if any rules found)
if (length(rules) == 0) {
  most_common_combo <- NULL
} else {
  top_rule <- sort(rules, by = "support", decreasing = TRUE)[1]
  lhs <- labels(lhs(top_rule))[[1]]
  rhs <- labels(rhs(top_rule))[[1]]
  most_common_combo <- list(lhs = lhs, rhs = rhs)
}

# ------------------------------------------------------------
# 3. Highest Rated Cuisine Combination
# ------------------------------------------------------------
# Create a string version of sorted cuisines per row
filtered_data$CuisineGroup <- sapply(cuisine_list, function(items) {
  paste(sort(items), collapse = ", ")
})

# Group by cuisine group and compute average rating
grouped_ratings <- aggregate(Ratings ~ CuisineGroup, data = filtered_data, FUN = mean)
best_combo <- grouped_ratings[which.max(grouped_ratings$Ratings), ]

# ------------------------------------------------------------
# 4. Top 5 Most Frequent Cuisine Groups (by Rating)
# ------------------------------------------------------------
# Count how often each cuisine group appears
combo_counts <- table(filtered_data$CuisineGroup)
top5_names <- names(sort(combo_counts, decreasing = TRUE))[1:5]
top5_data <- subset(filtered_data, CuisineGroup %in% top5_names)

# Calculate average rating for each of the top 5 combinations
top5_ratings <- aggregate(Ratings ~ CuisineGroup, data = top5_data, FUN = mean)
top5_ratings <- top5_ratings[order(-top5_ratings$Ratings), ]

# Convert into list of {cuisines, rating} for JSON
top5_list <- lapply(1:nrow(top5_ratings), function(i) {
  list(
    cuisines = top5_ratings$CuisineGroup[i],
    rating = round(top5_ratings$Ratings[i], 2)
  )
})

# ------------------------------------------------------------
# 5. Plot Top 10 Most Common Individual Cuisines
# ------------------------------------------------------------
top10_cuisines <- head(cuisine_frequency, 10)
top10_df <- data.frame(Cuisine = names(top10_cuisines), Count = as.numeric(top10_cuisines))

# Build the bar plot
plot <- ggplot(top10_df, aes(x = reorder(Cuisine, -Count), y = Count, fill = Cuisine)) +
  geom_bar(stat = "identity") +
  coord_flip() +
  theme_minimal() +
  labs(
    title = paste("Top 10 Cuisines in", input_location),
    x = "Cuisine",
    y = "Count"
  ) +
  theme(legend.position = "none")

# Save the plot image
plot_filename <- paste0("./public/plots/", gsub(", ", "_", input_location), "_top10.png")
ggsave(filename = plot_filename, plot = plot, width = 6, height = 4, dpi = 300)

# ------------------------------------------------------------
# Final Output as JSON
# ------------------------------------------------------------
output <- list(
  location = input_location,
  totalRows = nrow(data),
  matchCount = matching_count,
  sampleAreas = unique(head(data$Area, 10)),
  mostFrequentCuisine = most_frequent_cuisine,
  frequentCombo = most_common_combo,
  highestRatedCombo = list(
    cuisines = best_combo$CuisineGroup,
    rating = round(best_combo$Ratings, 2)
  ),
  top5Combos = top5_list,
  plotPath = plot_filename
)

# Print result as JSON for the backend
cat(toJSON(output, auto_unbox = TRUE, pretty = TRUE))
