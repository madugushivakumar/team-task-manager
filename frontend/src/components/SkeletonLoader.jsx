import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Skeleton height={30} width={200} />
      <Skeleton count={5} height={20} />
    </div>
  );
};

export default SkeletonLoader;