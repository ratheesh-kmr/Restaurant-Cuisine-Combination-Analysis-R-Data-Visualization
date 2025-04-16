const SubmitButton = ({ onClick, disabled, loading }) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`p-2 px-4 rounded-md transition duration-200 ${
          disabled || loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    );
};

export default SubmitButton;
