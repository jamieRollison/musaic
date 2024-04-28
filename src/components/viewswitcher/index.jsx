import PropTypes from "prop-types";
import { IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";

export default function ViewSwitcher({ view, setView }) {
  return (
    <div className="item-viewswitcher">
      <div className="rounded-xl bg-gray-700 mt-1 flex w-4/5 justify-between self-center px-10">
        <button onClick={() => setView(!view)}>
          <IoIosSkipBackward className="text-white" />
        </button>
        <h3 className="text-gray-300 ">{view ? "Top Songs" : "Mood"}</h3>
        <button className="text-white" onClick={() => setView(!view)}>
          <IoIosSkipForward />
        </button>
      </div>
    </div>
  );
}
ViewSwitcher.propTypes = {
  view: PropTypes.bool.isRequired,
  setView: PropTypes.func.isRequired,
};
