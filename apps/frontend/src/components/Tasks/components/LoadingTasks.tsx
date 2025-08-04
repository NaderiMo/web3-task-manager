import LoadingSpinner from "../../Spinner/LoadingSpinner";

const LoadingTasks = () => {
  return (
    <div className="py-12 text-center">
      <LoadingSpinner size="lg" color="blue" />
      <p className="mt-4 text-gray-600">Loading tasks ...</p>
    </div>
  );
};

export default LoadingTasks;
