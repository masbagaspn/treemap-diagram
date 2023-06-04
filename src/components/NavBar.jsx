import clsx from "clsx";
import PropTypes from "prop-types";

function NavBar({ data, state }) {
  console.log(state.active);
  return (
    <nav>
      <ul className="w-fit flex items-center gap-6 text-xs bg-white rounded-lg drop-shadow-md px-5 py-3">
        {data.map((d) => (
          <li
            key={d.id}
            onClick={() => state.setSection(d.id)}
            className={clsx(
              "py-1 transition-color font-semibold cursor-pointer",
              {
                "opacity-50": state.section !== d.id,
              },
              {
                "opacity-100": state.section === d.id,
              }
            )}
          >
            {d.link}
          </li>
        ))}
      </ul>
    </nav>
  );
}

NavBar.propTypes = {
  data: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
};

export default NavBar;
