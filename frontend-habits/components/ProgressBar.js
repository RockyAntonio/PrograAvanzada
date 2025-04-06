const ProgressBar = ({ progress }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
        <div
          className="bg-green-500 h-full text-center text-white text-sm"
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>
    );
  };
  
  export default ProgressBar;
  