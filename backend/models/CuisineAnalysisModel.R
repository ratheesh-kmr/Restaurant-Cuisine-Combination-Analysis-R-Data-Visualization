args <- commandArgs(trailingOnly = TRUE)

if (length(args) == 0) {
  quit(status = 1)
}

location <- args[1]
data <- read.csv("./zomato.csv", stringsAsFactors = FALSE)

if (!"Area" %in% colnames(data) || !"Cuisines" %in% colnames(data)) {
  quit(status = 1)
}

filtered <- subset(data, Area == location)

if (nrow(filtered) == 0) {
  quit(status = 1)
}

filtered$Cuisines <- na.omit(filtered$Cuisines)
cuisine_list <- strsplit(filtered$Cuisines, ",\\s*")

# ---- PART 1: Most frequent individual cuisine ----
flat_cuisines <- unlist(cuisine_list)
freq_table <- sort(table(flat_cuisines), decreasing = TRUE)
most_common_cuisine <- names(freq_table)[1]

cat(most_common_cuisine, "\n")

# ---- PART 2: Most frequent cuisine combination ----
suppressMessages(library(arules))

transactions <- as(cuisine_list, "transactions")
rules <- apriori(
  transactions,
  parameter = list(supp = 0.1, conf = 0.6, minlen = 2, maxlen = 3)
)

if (length(rules) == 0) {
  cat("None\n")
  quit(status = 0)
}

top_rule <- sort(rules, by = "support", decreasing = TRUE)[1]
lhs <- labels(lhs(top_rule))[[1]]
rhs <- labels(rhs(top_rule))[[1]]
cat(lhs, "+", rhs, "\n")
