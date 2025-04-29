args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) quit(status = 1)

load_or_install <- function(pkg) {
  if (!require(pkg, character.only = TRUE)) {
    install.packages(pkg, repos = "https://cloud.r-project.org")
    library(pkg, character.only = TRUE)
  }
}

suppressMessages(load_or_install("arules"))
suppressMessages(load_or_install("factoextra"))
suppressMessages(load_or_install("ggplot2"))
suppressMessages(load_or_install("jsonlite"))

# 📂 Load & validate data
# ─────────────────────────────────────────────────────
input_location <- tolower(trimws(args[1]))
data <- read.csv("./zomato.csv", stringsAsFactors = FALSE)

required_columns <- c("Area", "Cuisines", "Ratings")
if (!all(required_columns %in% names(data))) quit(status = 1)

data$Area <- tolower(trimws(data$Area))
data$Ratings <- suppressWarnings(as.numeric(data$Ratings))

# Filter rows by location
filtered_data <- subset(data, Area == input_location & !is.na(Cuisines) & !is.na(Ratings))
if (nrow(filtered_data) == 0) quit(status = 1)

# 1. Most Frequent Individual Cuisine
# ─────────────────────────────────────────────────────
cuisine_list <- strsplit(filtered_data$Cuisines, ",\\s*")
all_cuisines <- unlist(cuisine_list)
cuisine_frequency <- sort(table(all_cuisines), decreasing = TRUE)
most_frequent_cuisine <- names(cuisine_frequency)[1]

# 2. Apriori: Most Frequent Cuisine Combination
# ─────────────────────────────────────────────────────
transactions <- as(cuisine_list, "transactions")
sink(tempfile())  # silence apriori
rules <- suppressWarnings(apriori(
  transactions,
  parameter = list(supp = 0.1, conf = 0.6, minlen = 2, maxlen = 3)
))
sink()

if (length(rules) > 0) {
  top_rule <- sort(rules, by = "support", decreasing = TRUE)[1]
  lhs <- labels(lhs(top_rule))[[1]]
  rhs <- labels(rhs(top_rule))[[1]]
  most_common_combo <- list(lhs = lhs, rhs = rhs)
} else {
  most_common_combo <- NULL
}

# 3. Highest Rated Cuisine Combination
# ─────────────────────────────────────────────────────
filtered_data$CuisineGroup <- sapply(cuisine_list, function(items) paste(sort(items), collapse = ", "))
grouped_ratings <- aggregate(Ratings ~ CuisineGroup, data = filtered_data, FUN = mean)
best_combo <- grouped_ratings[which.max(grouped_ratings$Ratings), ]

# 4. Top 5 Most Frequent Cuisine Combinations by Rating
# ─────────────────────────────────────────────────────
combo_counts <- table(filtered_data$CuisineGroup)
top5_names <- names(sort(combo_counts, decreasing = TRUE))[1:5]
top5_data <- subset(filtered_data, CuisineGroup %in% top5_names)
top5_ratings <- aggregate(Ratings ~ CuisineGroup, data = top5_data, FUN = mean)
top5_ratings <- top5_ratings[order(-top5_ratings$Ratings), ]

top5_list <- lapply(1:nrow(top5_ratings), function(i) {
  list(
    cuisines = top5_ratings$CuisineGroup[i],
    rating = round(top5_ratings$Ratings[i], 2)
  )
})

# 5. Bar Chart: Top 10 Cuisines
# ─────────────────────────────────────────────────────
top10_cuisines <- head(cuisine_frequency, 10)
top10_df <- data.frame(Cuisine = names(top10_cuisines), Count = as.numeric(top10_cuisines))

bar_plot <- ggplot(top10_df, aes(x = reorder(Cuisine, -Count), y = Count, fill = Cuisine)) +
  geom_bar(stat = "identity") +
  coord_flip() +
  theme_minimal() +
  labs(
    title = paste("Top 10 Cuisines in", input_location),
    x = "Cuisine",
    y = "Count"
  ) +
  theme(legend.position = "none")

plot_filename <- paste0("./public/plots/", gsub(", ", "_", input_location), "_top10.png")
ggsave(filename = plot_filename, plot = bar_plot, width = 6, height = 4, dpi = 300)

# 6. Linear Regression: Ratings ~ AverageCost
# ─────────────────────────────────────────────────────
regression <- NULL
regression_plot <- NULL

if ("AverageCost" %in% names(filtered_data)) {
  filtered_data$AverageCost <- suppressWarnings(as.numeric(filtered_data$AverageCost))
  reg_data <- subset(filtered_data, !is.na(AverageCost) & !is.na(Ratings))

  if (nrow(reg_data) >= 5) {
    model <- lm(Ratings ~ AverageCost, data = reg_data)
    summary_model <- summary(model)

    regression <- list(
      intercept = round(coef(model)[1], 3),
      slope = round(coef(model)[2], 3),
      r_squared = round(summary_model$r.squared, 3)
    )

    reg_plot <- ggplot(reg_data, aes(x = AverageCost, y = Ratings)) +
      geom_point(alpha = 0.6, color = "#007ACC") +
      geom_smooth(method = "lm", color = "darkred") +
      theme_minimal() +
      labs(
        title = paste("Rating vs Average Cost in", input_location),
        x = "Average Cost for Two",
        y = "Rating"
      )

    reg_filename <- paste0("./public/plots/", gsub(", ", "_", input_location), "_regression.png")
    ggsave(filename = reg_filename, plot = reg_plot, width = 6, height = 4, dpi = 300)
    regression_plot <- reg_filename
  }
}

# 7. Clustering Analysis
# ─────────────────────────────────────────────────────
cluster_paths <- list()

# Create a subfolder for clusters if not exists
dir.create("./public/plots/clusters", showWarnings = FALSE)

# Helper to save cluster plot
save_cluster_plot <- function(data_vec, label, location_slug) {
  df <- data.frame(value = data_vec)
  df <- df[complete.cases(df), , drop = FALSE]

  # Ensure enough unique values for K-means
  if (length(unique(df$value)) < 3) return(NULL)

  km <- kmeans(df, centers = 3)
  
  cluster_df <- data.frame(value = df$value, cluster = factor(km$cluster))
  
  cluster_plot <- ggplot(cluster_df, aes(x = value, fill = cluster)) +
    geom_histogram(bins = 15, alpha = 0.7, position = "identity") +
    theme_minimal() +
    labs(
      title = paste(label, "Clusters in", location_slug),
      x = label,
      y = "Frequency"
    )
  
  filename <- paste0("./public/plots/clusters/", location_slug, "_", tolower(label), "_cluster.png")
  ggsave(filename = filename, plot = cluster_plot, width = 6, height = 4, dpi = 300)
  
  return(filename)
}

location_slug <- gsub(", ", "_", input_location)

# 7.1 Cluster by Ratings
cluster_paths$ratings <- save_cluster_plot(filtered_data$Ratings, "Ratings", location_slug)

# 7.2 Cluster by Average Cost
if ("AverageCost" %in% names(filtered_data)) {
  filtered_data$AverageCost <- suppressWarnings(as.numeric(filtered_data$AverageCost))
  cluster_paths$averageCost <- save_cluster_plot(filtered_data$AverageCost, "Average Cost", location_slug)
}

# 📤 Final JSON Output
# ─────────────────────────────────────────────────────
output <- list(
  location = input_location,
  totalRows = nrow(data),
  matchCount = nrow(filtered_data),
  mostFrequentCuisine = most_frequent_cuisine,
  frequentCombo = most_common_combo,
  highestRatedCombo = list(
    cuisines = best_combo$CuisineGroup,
    rating = round(best_combo$Ratings, 2)
  ),
  top5Combos = top5_list,
  plotPath = plot_filename,
  regression = regression,
  regressionPlot = regression_plot,
  clusters = cluster_paths
)

cat(toJSON(output, auto_unbox = TRUE, pretty = TRUE))
