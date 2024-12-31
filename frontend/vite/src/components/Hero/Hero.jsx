import "./Hero.css";

import githubIcon from "@assets/github.svg";

export default function Hero() {
  return (
    <header>
      <h1>Apply, Track, Follow-up.</h1>
      <p>
        A wrapper around the <span>Infopark</span> job portal with super-user
        features.
      </p>
      <a href="#" className="btn btn-git">
        <img src={githubIcon} alt="" width={20} /> Contribute on Github
      </a>
    </header>
  );
}
