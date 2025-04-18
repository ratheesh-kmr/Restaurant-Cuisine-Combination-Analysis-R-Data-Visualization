args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) quit(status = 1)

location <- args[1]
data <- read.csv("./zomato.csv", stringsAsFactors = FALSE)

if (!all(c("Area", "Rating", "Average.Cost.for.two") %in% names(data))) quit(status = 1)

filtered <- subset(data, Area == location & !is.na(Rating) & !is.na(Average.Cost.for.two))
if (nrow(filtered) < 5) {
  cat("Not enough data for linear regression.\n")
  quit(status = 0)
}

# Linear Regression: Rating ~ Average Cost
model <- lm(Rating ~ Average.Cost.for.two, data = filtered)
pred_summary <- summary(model)

cat("Linear Regression Summary:\n")
cat("Rating = ", round(model$coefficients[1], 3), " + ",
    round(model$coefficients[2], 3), " * AverageCost\n", sep = "")
cat("R-squared:", round(pred_summary$r.squared, 3), "\n")
