export default function AnalysisResults({ results }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 w-full animate-fadeIn">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100 border-b pb-2 sm:pb-3 border-gray-200 dark:border-gray-700">
        Analysis Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Location</span>
            <span className="font-medium text-sm sm:text-base">{results.location}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Entries in Dataset</span>
            <span className="font-medium text-sm sm:text-base">{results.totalRows}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Matching Records for Area</span>
            <span className="font-medium text-sm sm:text-base">{results.matchCount}</span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Most Frequent Cuisine</span>
            <span className="font-medium text-sm sm:text-base">{results.mostFrequentCuisine}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Most Frequent Combo (Apriori)</span>
            <span className="font-medium text-sm sm:text-base">
              {results.frequentCombo ? `${results.frequentCombo.lhs} + ${results.frequentCombo.rhs}` : "None"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Highest Rated Combo</span>
            <span className="font-medium text-sm sm:text-base">
              {results.highestRatedCombo.cuisines} — {results.highestRatedCombo.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
          Top 5 Frequent Cuisine Combos by Avg Rating
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md sm:rounded-lg p-3 sm:p-4">
          <ol className="space-y-1 sm:space-y-2">
            {results.top5Combos.map((item, i) => (
              <li
                key={i}
                className="flex justify-between items-center border-b last:border-0 border-gray-200 dark:border-gray-600 pb-1 sm:pb-2 last:pb-0"
              >
                <span className="font-medium text-sm sm:text-base">
                  {i + 1}. {item.cuisines}
                </span>
                <span className="bg-gray-200 dark:bg-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium">
                  {item.rating}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {results.plotPath && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
            Cuisine Distribution
          </h3>
          <div className="bg-gray-50 rounded-md sm:rounded-lg p-3 sm:p-4 overflow-hidden">
            <img
              src={`${import.meta.env.VITE_API_URL}${results.plotPath.replace("./public", "")}`}
              alt="Top Cuisines"
              className="rounded-md sm:rounded-lg shadow w-full object-contain"
            />
          </div>
        </div>
      )}

      {results.regressionPlot && results.regression && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
            Ratings vs Average Cost (Regression)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            y = {results.regression.intercept} + {results.regression.slope} × x (R² = {results.regression.r_squared})
          </p>
          <div className="bg-gray-50 rounded-md sm:rounded-lg p-3 sm:p-4 overflow-hidden">
            <img
              src={`${import.meta.env.VITE_API_URL}${results.regressionPlot.replace("./public", "")}`}
              alt="Regression Plot"
              className="rounded-md sm:rounded-lg shadow w-full object-contain"
            />
          </div>
        </div>
      )}

      {results.clusters && (
        <div className="mt-6 sm:mt-8 flex flex-col gap-4">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
            Clustering Analysis
          </h3>
          <div className="flex flex-col gap-4">
            {results.clusters.ratings && (
              <div className="bg-gray-50 rounded-md p-3 flex flex-col">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Clusters by Rating</p>
                <img
                  src={`${import.meta.env.VITE_API_URL}${results.clusters.ratings.replace("./public", "")}`}
                  alt="Rating Clusters"
                  className="rounded shadow w-full h-auto object-contain"
                />
              </div>
            )}
            {results.clusters.averageCost && (
              <div className="bg-gray-50 rounded-md p-3 flex flex-col">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Clusters by Avg Cost</p>
                <img
                  src={`${import.meta.env.VITE_API_URL}${results.clusters.averageCost.replace("./public", "")}`}
                  alt="Cost Clusters"
                  className="rounded shadow w-full h-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
