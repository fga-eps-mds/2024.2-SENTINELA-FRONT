import PropTypes from "prop-types";
import "./index.css";

export default function AdvantagesCard({ title, onClick }) {
  return (
    <>
      <div className="containerCard">
        <p className="text">{title}</p>
        <a className="link" onClick={onClick}>
          Saber mais
        </a>
      </div>
    </>
  );
}

AdvantagesCard.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
};
